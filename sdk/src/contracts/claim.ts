/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { CLAIM_CONTRACT_ADDRESS, GetZkSyncProvider } from "../utils";
import { Network } from "../types";

export class Claim {
  readonly contract: zksync.Contract;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network?: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;

    if (web3Provider) {
      this.contract = new zksync.Contract(
        CLAIM_CONTRACT_ADDRESS,
        require("../abi/Claim.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!network || !privateKey)
        throw new Error("network and private key are reuired.");

      const zkSyncProvider = GetZkSyncProvider(network);
      const wallet = new zksync.Wallet(privateKey, zkSyncProvider);

      this.contract = new zksync.Contract(
        CLAIM_CONTRACT_ADDRESS,
        require("../abi/Claim.json").abi,
        wallet._signerL2()
      );
    }
  }

  async Claim(): Promise<unknown> {
    const claimTx = await this.contract.claim();
    await claimTx.wait();

    return claimTx;
  }
}
