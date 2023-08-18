/* import dependencies */
import * as zksync from "zksync-web3";
import { BigNumber, BigNumberish, ethers, utils } from "ethers";

import { GetLzChainId, GetRpcProvider } from "../utils";
import { formatUnits } from "ethers/lib/utils";
import { Network } from "../types";

export class ONFT {
  readonly contract: ethers.Contract;

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
      if (!privateKey) throw new Error("private key is reuired.");

      const rpcProvider = GetRpcProvider(network);
      const wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        onftContractAddress,
        require("../abi/ONFT.json").abi,
        wallet
      );
    }
  }

  async GetBalanceOf(address: string): Promise<number> {
    const balance = await this.contract.balanceOf(address);
    return balance;
  }

  async GetName(): Promise<string> {
    const name = await this.contract.name();
    return name;
  }

  async GetSymbol(): Promise<string> {
    const symbol = await this.contract.symbol();
    return symbol;
  }

  async GetOwnerOf(tokenId: string): Promise<string> {
    const address = await this.contract.ownerOf(
      ethers.utils.parseUnits(tokenId, 0)
    );
    return address;
  }

  async GetTotalSupply(): Promise<string> {
    const totalSupply = await this.contract.totalSupply();
    return formatUnits(totalSupply, 0);
  }

  async GetContractURI(): Promise<string> {
    const contractURI = await this.contract.contractURI();
    return contractURI;
  }

  async GetOwner(): Promise<string> {
    const owner = await this.contract.owner();
    return owner;
  }

  async GetRoyaltyInfo(
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

  async GetCrosschainFeeEstimation(
    dest: Network,
    wallet: string,
    tokenId: BigNumberish
  ): Promise<unknown> {
    const adapterParams = ethers.utils.solidityPack(
      ["uint16", "uint256"],
      ["1", "350000"] // package type (1 = send), min gas = 350000 wei
    );
    const destChainId = GetLzChainId(dest);
    const fee = await this.contract.estimateSendFee(
      destChainId,
      wallet,
      BigNumber.from(tokenId),
      false,
      adapterParams
    );
    return utils.formatEther(fee.nativeFee);
  }

  async CrosschainTransfer(
    dest: Network,
    wallet: string,
    tokenId: BigNumberish,
    refundAddress: string,
    fee: string
  ): Promise<unknown> {
    const adapterParams = ethers.utils.solidityPack(
      ["uint16", "uint256"],
      ["1", "350000"] // package type (1 = send), min gas = 350000 wei
    );
    const destChainId = GetLzChainId(dest);

    console.log({
      from: wallet,
      destChainId,
      to: wallet,
      tokenId: BigNumber.from(tokenId),
      refundAddress,
      zro: "0x0000000000000000000000000000000000000000",
      adapterParams,
      value: {
        value: utils.parseEther(fee)
      }
    });

    const tx = await this.contract.sendFrom(
      wallet,
      destChainId,
      wallet,
      BigNumber.from(tokenId),
      refundAddress,
      "0x0000000000000000000000000000000000000000",
      adapterParams,
      {
        value: utils.parseEther(fee)
      }
    );

    await tx.wait();
    return tx;
  }

  async IsONft(): Promise<boolean> {
    const onftInterfaceId = ethers.utils.arrayify("0x02c7ea66");
    const isONft = await this.contract.supportsInterface(onftInterfaceId);
    return isONft;
  }
}
