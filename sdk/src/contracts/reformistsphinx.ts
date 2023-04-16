/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { REFORMIST_SPHINX_CONTRACT_ADDRESS, GetZkSyncProvider } from "../utils";
import { Network } from "../types";

export class ReformistSphinx {
  readonly contract: zksync.Contract;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network?: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;

    if (web3Provider) {
      this.contract = new zksync.Contract(
        REFORMIST_SPHINX_CONTRACT_ADDRESS,
        require("../abi/ReformistSphinx.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!network || !privateKey)
        throw new Error("network and private key are reuired.");

      const zkSyncProvider = GetZkSyncProvider(network);
      const wallet = new zksync.Wallet(privateKey, zkSyncProvider);

      this.contract = new zksync.Contract(
        REFORMIST_SPHINX_CONTRACT_ADDRESS,
        require("../abi/ReformistSphinx.json").abi,
        wallet._signerL2()
      );
    }
  }

  async GetMetadataUri(tokenId: number): Promise<string> {
    const uri = await this.contract.tokenURI(tokenId);

    return uri;
  }

  async GetReformistSphinxByWallet(
    address: string
  ): Promise<number | undefined> {
    const noOfReformistSphinx = await this.contract.balanceOf(address);
    if (noOfReformistSphinx > 0) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, 0);
      return tokenId;
    }

    return undefined;
  }

  async GetReformistSphinxesByWallet(address: string): Promise<number[]> {
    const noOfReformistSphinx = await this.contract.balanceOf(address);
    const tokenIds: number[] = [];
    for (let index = 0; index < noOfReformistSphinx; index++) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, index);
      tokenIds.push(tokenId);
    }

    return tokenIds;
  }

  async MintReformistSphinx(): Promise<unknown> {
    const mintTx = await this.contract.mint();
    await mintTx.wait();

    return mintTx;
  }
}
