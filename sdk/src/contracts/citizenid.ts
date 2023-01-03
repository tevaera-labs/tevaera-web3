/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { CITIZEN_ID_CONTRACT_ADDRESS } from "../utils";

export class CitizenId {
  readonly web3Provider: zksync.Web3Provider | ethers.providers.Web3Provider;
  readonly contract: zksync.Contract;

  constructor(
    web3Provider: zksync.Web3Provider | ethers.providers.Web3Provider
  ) {
    this.web3Provider = web3Provider;
    this.contract = new zksync.Contract(
      CITIZEN_ID_CONTRACT_ADDRESS,
      require("../abi/CitizenId.json").abi,
      this.web3Provider.getSigner()
    );
  }

  public async MintCitizenID(): Promise<unknown> {
    const mintTx = await this.contract.mintCitizenId();
    await mintTx.wait();

    return mintTx;
  }

  async GetCitizenID(address: string): Promise<number> {
    const tokenId = await this.contract.tokenOfOwnerByIndex(address, 0);

    return tokenId;
  }
}
