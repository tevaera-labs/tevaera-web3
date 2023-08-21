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
    const { citizenIdContractAddress } = getContractAddresses(network);

    if (!citizenIdContractAddress) throw new Error("Contract not found!");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        citizenIdContractAddress,
        require("../abi/CitizenId.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!privateKey) throw new Error("private key is reuired.");

      const rpcProvider = getRpcProvider(network);
      const wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        citizenIdContractAddress,
        require("../abi/CitizenId.json").abi,
        wallet
      );
    }

    this.network = network;
    this.web3Provider = web3Provider;
  }

  public async mintCitizenID(
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
    const mintTx = await this.contract.mintCitizenId(overrides);
    await mintTx.wait();

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

    await batchTx.wait();

    return batchTx;
  }
}
