/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import {
  getContractAddresses,
  getPaymasterCustomOverrides,
  getRpcProvider
} from "../utils";
import { Network } from "../types";

export class BalancerDragon {
  readonly contract: ethers.Contract;
  readonly network: Network;
  readonly web3Provider:
    | zksync.Web3Provider
    | ethers.providers.Web3Provider
    | undefined;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;
    if (!network) throw new Error("network is reuired.");
    const { balancerDragonContractAddress } = getContractAddresses(network);

    if (!balancerDragonContractAddress) throw new Error("Contract not found!");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        balancerDragonContractAddress,
        require("../abi/BalancerDragon.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!privateKey) throw new Error("private key is reuired.");

      const rpcProvider = getRpcProvider(network);
      const wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        balancerDragonContractAddress,
        require("../abi/BalancerDragon.json").abi,
        wallet
      );
    }

    this.network = network;
    this.web3Provider = web3Provider;
  }

  async getMetadataUri(tokenId: number): Promise<string> {
    const uri = await this.contract.tokenURI(tokenId);

    return uri;
  }

  async getBalancerDragonByWallet(
    address: string
  ): Promise<number | undefined> {
    const noOfBalancerDragon = await this.contract.balanceOf(address);
    if (noOfBalancerDragon > 0) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, 0);
      return tokenId;
    }

    return undefined;
  }

  async getBalancerDragonsByWallet(address: string): Promise<number[]> {
    const noOfBalancerDragon = await this.contract.balanceOf(address);
    const tokenIds: number[] = [];
    for (let index = 0; index < noOfBalancerDragon; index++) {
      // eslint-disable-next-line no-await-in-loop
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, index);
      tokenIds.push(tokenId);
    }

    return tokenIds;
  }

  async getBalancerDragonPrice(): Promise<number> {
    const price = await this.contract.tokenPrice();

    return price;
  }

  async mintBalancerDragon(
    feeToken?: string,
    isGaslessFlow?: boolean
  ): Promise<unknown> {
    const price = await this.contract.tokenPrice();
    let overrides = {
      value: price
    };
    // get paymaster overrides if applicable
    if (this.web3Provider) {
      overrides = await getPaymasterCustomOverrides({
        web3Provider: this.web3Provider,
        network: this.network,
        overrides,
        feeToken,
        isGaslessFlow
      });
    }
    const mintTx = await this.contract.mint(overrides);
    await mintTx.wait();

    return mintTx;
  }
}
