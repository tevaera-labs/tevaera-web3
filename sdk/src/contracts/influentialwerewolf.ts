/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import {
  getContractAddresses,
  getPaymasterCustomOverrides,
  getRpcProvider
} from "../utils";
import { Network } from "../types";

export class InfluentialWerewolf {
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
    const { influentialWerewolfContractAddress } =
      getContractAddresses(network);

    if (!influentialWerewolfContractAddress)
      throw new Error("Contract not found!");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        influentialWerewolfContractAddress,
        require("../abi/InfluentialWerewolf.json").abi,
        web3Provider.getSigner() || web3Provider
      );
    } else {
      const rpcProvider = getRpcProvider(network, customRpcUrl);

      let wallet;
      if (privateKey) wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        influentialWerewolfContractAddress,
        require("../abi/InfluentialWerewolf.json").abi,
        wallet || rpcProvider
      );
    }

    this.network = network;
  }

  async getMetadataUri(tokenId: number): Promise<string> {
    const uri = await this.contract.tokenURI(tokenId);

    return uri;
  }

  async getInfluentialWerewolfByWallet(
    address: string
  ): Promise<number | undefined> {
    const noOfInfluentialWerewolf = await this.contract.balanceOf(address);
    if (noOfInfluentialWerewolf > 0) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, 0);
      return tokenId;
    }

    return undefined;
  }

  async getInfluentialWerewolfsByWallet(address: string): Promise<number[]> {
    const noOfInfluentialWerewolf = await this.contract.balanceOf(address);
    const tokenIds: number[] = [];
    for (let index = 0; index < noOfInfluentialWerewolf; index++) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, index);
      tokenIds.push(tokenId);
    }

    return tokenIds;
  }

  async getInfluentialWerewolfPrice(): Promise<number> {
    const price = await this.contract.tokenPrice();

    return price;
  }

  async mintInfluentialWerewolf(
    feeToken?: string,
    isGaslessFlow?: boolean
  ): Promise<unknown> {
    const price = await this.contract.tokenPrice();
    let overrides = {
      value: price
    };

    // estimate gas for paymaster transaction
    let gasLimit;
    if (feeToken) {
      gasLimit = await this.contract.estimateGas.mint(overrides);
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

    const mintTx = await this.contract.mint(overrides);

    return mintTx;
  }
}
