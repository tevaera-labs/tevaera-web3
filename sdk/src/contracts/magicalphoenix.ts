/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { GetContractAddresses, GetRpcProvider } from "../utils";
import { Network } from "../types";

export class MagicalPhoenix {
  readonly contract: ethers.Contract;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;
    if (!network) throw new Error("network is reuired.");
    const { magicalPhoenixContractAddress } = GetContractAddresses(network);

    if (!magicalPhoenixContractAddress) throw new Error("Contract not found!");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        magicalPhoenixContractAddress,
        require("../abi/MagicalPhoenix.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!privateKey) throw new Error("private key is reuired.");

      const rpcProvider = GetRpcProvider(network);
      const wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        magicalPhoenixContractAddress,
        require("../abi/MagicalPhoenix.json").abi,
        wallet
      );
    }
  }

  async GetMetadataUri(tokenId: number): Promise<string> {
    const uri = await this.contract.tokenURI(tokenId);

    return uri;
  }

  async GetMagicalPhoenixByWallet(
    address: string
  ): Promise<number | undefined> {
    const noOfMagicalPhoenix = await this.contract.balanceOf(address);
    if (noOfMagicalPhoenix > 0) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, 0);
      return tokenId;
    }

    return undefined;
  }

  async GetMagicalPhoenixesByWallet(address: string): Promise<number[]> {
    const noOfMagicalPhoenix = await this.contract.balanceOf(address);
    const tokenIds: number[] = [];
    for (let index = 0; index < noOfMagicalPhoenix; index++) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, index);
      tokenIds.push(tokenId);
    }

    return tokenIds;
  }

  async MintMagicalPhoenix(): Promise<unknown> {
    const mintTx = await this.contract.mint();
    await mintTx.wait();

    return mintTx;
  }

  async IsWhitelisted(address: string): Promise<boolean> {
    const isWhitelisted = await this.contract.whitelisted(address);

    return isWhitelisted;
  }
}
