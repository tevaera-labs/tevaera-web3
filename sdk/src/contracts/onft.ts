/* import dependencies */
import {
  ContractRunner,
  ZeroAddress,
  formatEther,
  formatUnits,
  getBytes,
  parseEther,
  parseUnits,
  solidityPacked
} from "ethers";

import { ContractFactory } from "../factories/ContractFactory";
import {
  getLzChainId,
  getPaymasterCustomOverrides,
  getRpcProvider
} from "../utils";
import { Network, SupportedContract } from "../types";
import { WalletFactory } from "../factories/WalletFactory";

export class ONFT {
  readonly contract: SupportedContract;
  readonly network: Network;

  constructor(options: {
    network: Network;
    onftContractAddress: string;
    contractRunner?: ContractRunner;
    privateKey?: string;
    customRpcUrl?: string;
  }) {
    const {
      contractRunner,
      customRpcUrl,
      network,
      onftContractAddress,
      privateKey
    } = options;
    if (!network) throw new Error("network is reuired.");
    if (!onftContractAddress)
      throw new Error("onftContractAddress is reuired.");

    if (contractRunner) {
      const contractFactory = new ContractFactory(network);
      this.contract = contractFactory.createContract(
        onftContractAddress,
        require("../abi/ONFT.json").abi,
        contractRunner
      );
    } else {
      const rpcProvider = getRpcProvider(network, customRpcUrl);

      let wallet;
      if (privateKey) {
        const walletFactory = new WalletFactory(rpcProvider);
        wallet = walletFactory.createWallet(privateKey);
      }

      const contractFactory = new ContractFactory(network);
      this.contract = contractFactory.createContract(
        onftContractAddress,
        require("../abi/ONFT.json").abi,
        wallet || rpcProvider
      );
    }

    this.network = network;
  }

  async getLzRemoteAddress(network: Network): Promise<string> {
    const address = await this.contract.getTrustedRemoteAddress(
      getLzChainId(network)
    );

    return address;
  }

  async getBalanceOf(address: string): Promise<number> {
    const balance = await this.contract.balanceOf(address);
    return balance;
  }

  async getName(): Promise<string> {
    const name = await this.contract.name();
    return name;
  }

  async getSymbol(): Promise<string> {
    const symbol = await this.contract.symbol();
    return symbol;
  }

  async getOwnerOf(tokenId: string): Promise<string> {
    const address = await this.contract.ownerOf(parseUnits(tokenId, 0));
    return address;
  }

  async getTotalSupply(): Promise<string> {
    const totalSupply = await this.contract.totalSupply();
    return formatUnits(totalSupply, 0);
  }

  async getContractURI(): Promise<string> {
    const contractURI = await this.contract.contractURI();
    return contractURI;
  }

  async getOwner(): Promise<string> {
    const owner = await this.contract.owner();
    return owner;
  }

  async getRoyaltyInfo(
    tokenId: string,
    salePrice: string
  ): Promise<{ receiver?: string; royaltyAmount: number }> {
    const { receiver, royaltyAmount } = await this.contract.royaltyInfo(
      tokenId,
      salePrice
    );

    return {
      receiver,
      royaltyAmount: royaltyAmount
        ? Number(formatUnits(royaltyAmount, 18)) // Assuming it's ETH
        : 0
    };
  }

  // ONFT Routines

  async getCrosschainFeeEstimation(
    dest: Network,
    wallet: string,
    tokenId: bigint,
    minGas?: string
  ): Promise<unknown> {
    const minGasWei = minGas || "350000";
    const adapterParams = solidityPacked(
      ["uint16", "uint256"],
      ["1", minGasWei] // package type (1 = send), min gas = 350000 wei
    );
    const destChainId = getLzChainId(dest);
    const fee = await this.contract.estimateSendFee(
      destChainId,
      wallet,
      BigInt(tokenId),
      false,
      adapterParams
    );
    return formatEther(fee.nativeFee);
  }

  async crosschainTransfer(
    dest: Network,
    wallet: string,
    tokenId: bigint,
    refundAddress: string,
    fee: string,
    feeToken?: string,
    isGaslessFlow?: boolean,
    minGas?: string
  ): Promise<unknown> {
    const minGasWei = minGas || "350000";
    const adapterParams = solidityPacked(
      ["uint16", "uint256"],
      ["1", minGasWei] // package type (1 = send), min gas = 350000 wei
    );
    const destChainId = getLzChainId(dest);

    // prepare overrides
    let overrides = {
      value: parseEther(fee)
    };

    // estimate gas for paymaster transaction
    let gasLimit;
    if (feeToken) {
      gasLimit = await this.contract.sendFrom.estimateGas(
        wallet,
        destChainId,
        wallet,
        BigInt(tokenId),
        refundAddress,
        ZeroAddress,
        adapterParams,
        overrides
      );
    }

    // update paymaster params with the updated fee
    overrides = await getPaymasterCustomOverrides({
      network: this.network,
      overrides,
      feeToken,
      isGaslessFlow,
      contract: this.contract,
      gasLimit
    });

    const tx = await this.contract.sendFrom(
      wallet,
      destChainId,
      wallet,
      BigInt(tokenId),
      refundAddress,
      ZeroAddress,
      adapterParams,
      overrides
    );

    return tx;
  }

  async isONft(): Promise<boolean> {
    const onftInterfaceId = getBytes("0x22bac5d9");
    const isONft = await this.contract.supportsInterface(onftInterfaceId);
    return isONft;
  }
}
