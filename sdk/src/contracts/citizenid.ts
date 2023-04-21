/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { GetContractAddresses, GetZkSyncProvider } from "../utils";
import { Network } from "../types";

export class CitizenId {
  readonly contract: zksync.Contract;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;
    if (!network) throw new Error("network is reuired.");
    const { citizenIdContractAddress } = GetContractAddresses(network);

    if (web3Provider) {
      this.contract = new zksync.Contract(
        citizenIdContractAddress,
        require("../abi/CitizenId.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!privateKey) throw new Error("private key is reuired.");

      const zkSyncProvider = GetZkSyncProvider(network);
      const wallet = new zksync.Wallet(privateKey, zkSyncProvider);

      this.contract = new zksync.Contract(
        citizenIdContractAddress,
        require("../abi/CitizenId.json").abi,
        wallet._signerL2()
      );
    }
  }

  public async MintCitizenID(): Promise<unknown> {
    const price = await this.contract.tokenPrice();
    const mintTx = await this.contract.mintCitizenId({
      value: price,
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

  async GetMetadataUri(citizenId: number): Promise<string> {
    const uri = await this.contract.tokenURI(citizenId);

    return uri;
  }

  async UpdateRep(tokens: number[], reps: number[]): Promise<string> {
    const batchTx = await this.contract.updateRep(tokens, reps);

    await batchTx.wait();

    return batchTx;
  }
}
