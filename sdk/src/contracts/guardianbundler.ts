/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { GetContractAddresses, GetRpcProvider } from "../utils";
import { Network } from "../types";

export class GuardianBundler {
  readonly contract: ethers.Contract;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;
    if (!network) throw new Error("network is reuired.");
    const { guardianBundlerContractAddress } = GetContractAddresses(network);

    if (!guardianBundlerContractAddress) throw new Error("Contract not found!");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        guardianBundlerContractAddress,
        require("../abi/GuardianBundler.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!privateKey) throw new Error("private key is reuired.");

      const rpcProvider = GetRpcProvider(network);
      const wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        guardianBundlerContractAddress,
        require("../abi/GuardianBundler.json").abi,
        wallet
      );
    }
  }

  async GetMetadataUri(tokenId: number): Promise<string> {
    const uri = await this.contract.tokenURI(tokenId);

    return uri;
  }

  async GetGuardianBundlerByWallet(
    address: string
  ): Promise<number | undefined> {
    const noOfGuardianBundler = await this.contract.balanceOf(address);
    if (noOfGuardianBundler > 0) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, 0);
      return tokenId;
    }

    return undefined;
  }

  async GetGuardianBundleresByWallet(address: string): Promise<number[]> {
    const noOfGuardianBundler = await this.contract.balanceOf(address);
    const tokenIds: number[] = [];
    for (let index = 0; index < noOfGuardianBundler; index++) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, index);
      tokenIds.push(tokenId);
    }

    return tokenIds;
  }

  async GetGuardianBundlerPrice(): Promise<number> {
    const price = await this.contract.bundlePrice();

    return price;
  }

  async MintGuardianBundler(): Promise<unknown> {
    const price = await this.contract.bundlePrice();
    const mintTx = await this.contract.mintBundle({
      value: price
    });
    await mintTx.wait();

    return mintTx;
  }
}
