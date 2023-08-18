/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { GetContractAddresses, GetRpcProvider } from "../utils";
import { Network } from "../types";

export class CitizenId {
  readonly contract: ethers.Contract;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;
    if (!network) throw new Error("network is reuired.");
    const { citizenIdContractAddress } = GetContractAddresses(network);

    if (!citizenIdContractAddress) throw new Error("Contract not found!");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        citizenIdContractAddress,
        require("../abi/CitizenId.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!privateKey) throw new Error("private key is reuired.");

      const rpcProvider = GetRpcProvider(network);
      const wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        citizenIdContractAddress,
        require("../abi/CitizenId.json").abi,
        wallet
      );
    }
  }

  public async MintCitizenID(): Promise<unknown> {
    const price = await this.contract.tokenPrice();
    const mintTx = await this.contract.mintCitizenId({
      value: price
    });
    await mintTx.wait();

    return mintTx;
  }

  async GetCitizenID(address: string): Promise<number> {
    const noOfCitizenId = await this.contract.balanceOf(address);
    if (noOfCitizenId > 0) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, 0);

      return tokenId;
    }

    return 0;
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
