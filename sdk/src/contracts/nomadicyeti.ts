/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { NOMADIC_YETI_CONTRACT_ADDRESS, GetZkSyncProvider } from "../utils";
import { Network } from "../types";

export class NomadicYeti {
  readonly contract: zksync.Contract;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network?: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;

    if (web3Provider) {
      this.contract = new zksync.Contract(
        NOMADIC_YETI_CONTRACT_ADDRESS,
        require("../abi/NomadicYeti.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!network || !privateKey)
        throw new Error("network and private key are reuired.");

      const zkSyncProvider = GetZkSyncProvider(network);
      const wallet = new zksync.Wallet(privateKey, zkSyncProvider);

      this.contract = new zksync.Contract(
        NOMADIC_YETI_CONTRACT_ADDRESS,
        require("../abi/NomadicYeti.json").abi,
        wallet._signerL2()
      );
    }
  }

  async GetMetadataUri(tokenId: number): Promise<number> {
    const uri = await this.contract.tokenURI(tokenId);

    return uri;
  }

  async GetNomadicYetiByWallet(address: string): Promise<number | undefined> {
    const noOfNomadicYeti = await this.contract.balanceOf(address);
    if (noOfNomadicYeti > 0) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, 0);
      return tokenId;
    }

    return undefined;
  }

  async GetNomadicYetisByWallet(address: string): Promise<number[]> {
    const noOfNomadicYeti = await this.contract.balanceOf(address);
    const tokenIds: number[] = [];
    for (let index = 0; index < noOfNomadicYeti; index++) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, index);
      tokenIds.push(tokenId);
    }

    return tokenIds;
  }

  async MintNomadicYeti(): Promise<unknown> {
    const price = await this.contract.YETI_PRICE();
    const mintTx = await this.contract.mint({
      value: price,
    });
    await mintTx.wait();

    return mintTx;
  }
}
