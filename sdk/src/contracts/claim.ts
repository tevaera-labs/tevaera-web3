/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { GetContractAddresses, GetZkSyncProvider } from "../utils";
import { Network } from "../types";

export class Claim {
  readonly contract: zksync.Contract;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;
    if (!network) throw new Error("network is reuired.");
    const { claimContractAddress } = GetContractAddresses(network);

    if (web3Provider) {
      this.contract = new zksync.Contract(
        claimContractAddress,
        require("../abi/Claim.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!privateKey) throw new Error("private key is reuired.");

      const zkSyncProvider = GetZkSyncProvider(network);
      const wallet = new zksync.Wallet(privateKey, zkSyncProvider);

      this.contract = new zksync.Contract(
        claimContractAddress,
        require("../abi/Claim.json").abi,
        wallet._signerL2()
      );
    }
  }

  async Claim(citizenIdPrice: number): Promise<unknown> {
    const claimTx = await this.contract.claim({
      value: citizenIdPrice,
    });
    await claimTx.wait();

    return claimTx;
  }
}
