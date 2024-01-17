/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import {
  getContractAddresses,
  getPaymasterCustomOverrides,
  getRpcProvider
} from "../utils";
import { Network } from "../types";

export class ReformistSphinx {
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
    const { reformistSphinxContractAddress } = getContractAddresses(network);

    if (!reformistSphinxContractAddress) throw new Error("Contract not found!");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        reformistSphinxContractAddress,
        require("../abi/ReformistSphinx.json").abi,
        web3Provider.getSigner() || web3Provider
      );
    } else {
      const rpcProvider = getRpcProvider(network, customRpcUrl);

      let wallet;
      if (privateKey) wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        reformistSphinxContractAddress,
        require("../abi/ReformistSphinx.json").abi,
        wallet || rpcProvider
      );
    }

    this.network = network;
  }

  async getMetadataUri(tokenId: number): Promise<string> {
    const uri = await this.contract.tokenURI(tokenId);

    return uri;
  }

  async getReformistSphinxByWallet(
    address: string
  ): Promise<number | undefined> {
    const noOfReformistSphinx = await this.contract.balanceOf(address);
    if (noOfReformistSphinx > 0) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, 0);
      return tokenId;
    }

    return undefined;
  }

  async getReformistSphinxesByWallet(address: string): Promise<number[]> {
    const noOfReformistSphinx = await this.contract.balanceOf(address);
    const tokenIds: number[] = [];
    for (let index = 0; index < noOfReformistSphinx; index++) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, index);
      tokenIds.push(tokenId);
    }

    return tokenIds;
  }

  async mintReformistSphinx(
    feeToken?: string,
    isGaslessFlow?: boolean
  ): Promise<unknown> {
    // get paymaster overrides if applicable
    let overrides = {};

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
