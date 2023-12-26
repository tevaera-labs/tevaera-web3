/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import {
  getContractAddresses,
  getPaymasterCustomOverrides,
  getRpcProvider
} from "../utils";
import { Network } from "../types";

export class GuardianBundler {
  readonly contract: ethers.Contract;
  readonly network: Network;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    privateKey?: string;
    customRpcUrl?: string;
  }) {
    const { web3Provider, network, privateKey, customRpcUrl } = options;
    if (!network) throw new Error("network is reuired.");
    const { guardianBundlerContractAddress } = getContractAddresses(network);

    if (!guardianBundlerContractAddress) throw new Error("Contract not found!");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        guardianBundlerContractAddress,
        require("../abi/GuardianBundler.json").abi,
        web3Provider.getSigner() || web3Provider
      );
    } else {
      const rpcProvider = getRpcProvider(network, customRpcUrl);

      let wallet;
      if (privateKey) wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        guardianBundlerContractAddress,
        require("../abi/GuardianBundler.json").abi,
        wallet || rpcProvider
      );
    }

    this.network = network;
  }

  async getMetadataUri(tokenId: number): Promise<string> {
    const uri = await this.contract.tokenURI(tokenId);

    return uri;
  }

  async getGuardianBundlerByWallet(
    address: string
  ): Promise<number | undefined> {
    const noOfGuardianBundler = await this.contract.balanceOf(address);
    if (noOfGuardianBundler > 0) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, 0);
      return tokenId;
    }

    return undefined;
  }

  async getGuardianBundleresByWallet(address: string): Promise<number[]> {
    const noOfGuardianBundler = await this.contract.balanceOf(address);
    const tokenIds: number[] = [];
    for (let index = 0; index < noOfGuardianBundler; index++) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, index);
      tokenIds.push(tokenId);
    }

    return tokenIds;
  }

  async getGuardianBundlerPrice(): Promise<number> {
    const price = await this.contract.bundlePrice();

    return price;
  }

  async mintGuardianBundler(
    feeToken?: string,
    isGaslessFlow?: boolean
  ): Promise<unknown> {
    const price = await this.contract.bundlePrice();
    let overrides = {
      value: price
    };

    // get paymaster overrides if applicable
    overrides = await getPaymasterCustomOverrides({
      network: this.network,
      overrides,
      feeToken,
      isGaslessFlow
    });

    const mintTx = await this.contract.mintBundle(overrides);
    await mintTx.wait();

    return mintTx;
  }
}
