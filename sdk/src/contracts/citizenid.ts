/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import {
  getContractAddresses,
  getPaymasterCustomOverrides,
  getRpcProvider
} from "../utils";
import { Network } from "../types";

export class CitizenId {
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
    const { citizenIdContractAddress } = getContractAddresses(network);

    if (!citizenIdContractAddress) throw new Error("Contract not found!");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        citizenIdContractAddress,
        require("../abi/CitizenId.json").abi,
        web3Provider.getSigner() || web3Provider
      );
    } else {
      const rpcProvider = getRpcProvider(network, customRpcUrl);

      let wallet;
      if (privateKey) wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        citizenIdContractAddress,
        require("../abi/CitizenId.json").abi,
        wallet || rpcProvider
      );
    }

    this.network = network;
  }

  public async mintCitizenID(
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
      gasLimit = await this.contract.estimateGas.mintCitizenId(overrides);
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

    const mintTx = await this.contract.mintCitizenId(overrides);

    return mintTx;
  }

  async getCitizenID(address: string): Promise<number> {
    const noOfCitizenId = await this.contract.balanceOf(address);
    if (noOfCitizenId > 0) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, 0);

      return tokenId;
    }

    return 0;
  }

  async getCitizenIDPrice(): Promise<number> {
    const price = await this.contract.tokenPrice();

    return price;
  }

  async getMetadataUri(citizenId: number): Promise<string> {
    const uri = await this.contract.tokenURI(citizenId);

    return uri;
  }

  async updateRep(tokens: number[], reps: number[]): Promise<string> {
    const batchTx = await this.contract.updateRep(tokens, reps);

    return batchTx;
  }
}
