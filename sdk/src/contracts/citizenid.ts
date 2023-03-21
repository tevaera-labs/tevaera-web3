/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { CITIZEN_ID_CONTRACT_ADDRESS, GetZkSyncProvider } from "../utils";
import { Network } from "../types";

export class CitizenId {
  readonly contract: zksync.Contract;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network?: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;

    if (web3Provider) {
      this.contract = new zksync.Contract(
        CITIZEN_ID_CONTRACT_ADDRESS,
        require("../abi/CitizenId.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!network || !privateKey)
        throw new Error("network and private key are reuired.");

      const zkSyncProvider = GetZkSyncProvider(network);
      const wallet = new zksync.Wallet(privateKey, zkSyncProvider);

      this.contract = new zksync.Contract(
        CITIZEN_ID_CONTRACT_ADDRESS,
        require("../abi/CitizenId.json").abi,
        wallet._signerL2()
      );
    }
  }

  public async MintCitizenID(): Promise<unknown> {
    const price = await this.contract.tokenPrice();
    const mintTx = await this.contract.mintCitizenId({
      value: parseInt(price),
    });
    await mintTx.wait();

    return mintTx;
  }

  async GetCitizenID(address: string): Promise<number> {
    const tokenId = await this.contract.tokenOfOwnerByIndex(address, 0);

    return tokenId;
  }

  async GetCitizenIDPrice(): Promise<number> {
    const price = await this.contract.tokenPrice();

    return price;
  }
}
