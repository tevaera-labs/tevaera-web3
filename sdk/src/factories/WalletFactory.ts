import * as ethers from "ethers";
import * as zksync from "zksync-ethers";

import { SupportedRpcProvider, SupportedWallet } from "../types";

export class WalletFactory {
  private rpcProvider: SupportedRpcProvider;

  constructor(rpcProvider: SupportedRpcProvider) {
    this.rpcProvider = rpcProvider;
  }

  // Method to create wallet dynamically
  createWallet(privateKey: string): SupportedWallet {
    try {
      if (this.isZkSyncProvider()) {
        return new zksync.Wallet(
          privateKey,
          this.rpcProvider as zksync.Provider
        );
      } else if (this.isEthersProvider()) {
        return new ethers.Wallet(
          privateKey,
          this.rpcProvider as ethers.JsonRpcApiProvider
        );
      } else {
        throw new Error("Unsupported provider");
      }
    } catch (error) {
      throw error;
    }
  }

  private isEthersProvider() {
    return this.rpcProvider instanceof ethers.JsonRpcProvider;
  }

  private isZkSyncProvider() {
    return this.rpcProvider instanceof zksync.Provider;
  }
}
