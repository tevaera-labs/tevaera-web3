/* import dependencies */
import * as zksync from "zksync-web3";
import { BigNumber, BigNumberish, ethers, utils } from "ethers";

import {
  getLzChainId,
  getPaymasterCustomOverrides,
  getRpcProvider
} from "../utils";
import { Network } from "../types";

export class ONFT {
  readonly contract: ethers.Contract;
  readonly network: Network;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    onftContractAddress: string;
    privateKey?: string;
  }) {
    const { web3Provider, network, onftContractAddress, privateKey } = options;
    if (!network) throw new Error("network is reuired.");
    if (!onftContractAddress)
      throw new Error("onftContractAddress is reuired.");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        onftContractAddress,
        require("../abi/ONFT.json").abi,
        web3Provider.getSigner() || web3Provider
      );
    } else {
      const rpcProvider = getRpcProvider(network);

      let wallet;
      if (privateKey) wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        onftContractAddress,
        require("../abi/ONFT.json").abi,
        wallet || rpcProvider
      );
    }

    this.network = network;
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
    const address = await this.contract.ownerOf(
      ethers.utils.parseUnits(tokenId, 0)
    );
    return address;
  }

  async getTotalSupply(): Promise<string> {
    const totalSupply = await this.contract.totalSupply();
    return utils.formatUnits(totalSupply, 0);
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
        ? Number(ethers.utils.formatUnits(royaltyAmount, 18)) // Assuming it's ETH
        : 0
    };
  }

  // ONFT Routines

  async getCrosschainFeeEstimation(
    dest: Network,
    wallet: string,
    tokenId: BigNumberish
  ): Promise<unknown> {
    const adapterParams = ethers.utils.solidityPack(
      ["uint16", "uint256"],
      ["1", "350000"] // package type (1 = send), min gas = 350000 wei
    );
    const destChainId = getLzChainId(dest);
    const fee = await this.contract.estimateSendFee(
      destChainId,
      wallet,
      BigNumber.from(tokenId),
      false,
      adapterParams
    );
    return utils.formatEther(fee.nativeFee);
  }

  async crosschainTransfer(
    dest: Network,
    wallet: string,
    tokenId: BigNumberish,
    refundAddress: string,
    fee: string,
    feeToken?: string,
    isGaslessFlow?: boolean
  ): Promise<unknown> {
    const adapterParams = ethers.utils.solidityPack(
      ["uint16", "uint256"],
      ["1", "350000"] // package type (1 = send), min gas = 350000 wei
    );
    const destChainId = getLzChainId(dest);

    // prepare overrides
    let overrides = {
      value: utils.parseEther(fee)
    };

    // get paymaster overrides if applicable
    overrides = await getPaymasterCustomOverrides({
      network: this.network,
      overrides,
      feeToken,
      isGaslessFlow
    });

    const tx = await this.contract.sendFrom(
      wallet,
      destChainId,
      wallet,
      BigNumber.from(tokenId),
      refundAddress,
      "0x0000000000000000000000000000000000000000",
      adapterParams,
      overrides
    );

    return tx;
  }

  async isONft(): Promise<boolean> {
    const onftInterfaceId = ethers.utils.arrayify("0x22bac5d9");
    const isONft = await this.contract.supportsInterface(onftInterfaceId);
    return isONft;
  }
}
