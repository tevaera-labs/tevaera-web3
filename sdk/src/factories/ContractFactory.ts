import * as ethers from "ethers";
import * as zksync from "zksync-ethers";

import { Network, SupportedContract, SupportedProvider } from "../types";

export class ContractFactory {
  private network: Network;

  constructor(network: Network) {
    this.network = network;
  }

  // Method to create contracts dynamically
  createContract(
    contractAddress: string,
    abi: any,
    runner?: ethers.ContractRunner
  ): SupportedContract {
    try {
      if (this.isZkSync()) {
        return new zksync.Contract(contractAddress, abi, runner);
      }

      return new ethers.Contract(contractAddress, abi, runner);
    } catch (error) {
      throw error;
    }
  }

  private isZkSync() {
    return [
      Network.ZksyncEra,
      Network.ZksyncEraGoerli,
      Network.ZksyncEraSepolia
    ].includes(this.network);
  }
}
