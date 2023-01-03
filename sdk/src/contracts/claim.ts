/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { CLAIM_CONTRACT_ADDRESS } from "../utils";

export class Claim {
  readonly web3Provider: zksync.Web3Provider | ethers.providers.Web3Provider;
  readonly contract: zksync.Contract;

  constructor(
    web3Provider: zksync.Web3Provider | ethers.providers.Web3Provider
  ) {
    this.web3Provider = web3Provider;
    this.contract = new zksync.Contract(
      CLAIM_CONTRACT_ADDRESS,
      require("../abi/Claim.json").abi,
      this.web3Provider.getSigner()
    );
  }

  async Claim(): Promise<unknown> {
    const claimTx = await this.contract.claim();
    await claimTx.wait();

    return claimTx;
  }
}
