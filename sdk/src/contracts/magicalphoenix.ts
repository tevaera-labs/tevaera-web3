/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { MAGICAL_PHOENIX_CONTRACT_ADDRESS, GetZkSyncProvider } from "../utils";
import { Network } from "../types";

export class MagicalPhoenix {
  readonly contract: zksync.Contract;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network?: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;

    if (web3Provider) {
      this.contract = new zksync.Contract(
        MAGICAL_PHOENIX_CONTRACT_ADDRESS,
        require("../abi/MagicalPhoenix.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!network || !privateKey)
        throw new Error("network and private key are reuired.");

      const zkSyncProvider = GetZkSyncProvider(network);
      const wallet = new zksync.Wallet(privateKey, zkSyncProvider);

      this.contract = new zksync.Contract(
        MAGICAL_PHOENIX_CONTRACT_ADDRESS,
        require("../abi/MagicalPhoenix.json").abi,
        wallet._signerL2()
      );
    }
  }

  async GetMagicalPhoenixByWallet(
    address: string
  ): Promise<number | undefined> {
    const noOfMagicalPhoenix = await this.contract.balanceOf(address);
    if (noOfMagicalPhoenix > 0) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, 0);
      return tokenId;
    }

    return undefined;
  }

  async MintMagicalPhoenix(): Promise<unknown> {
    const price = await this.contract.PHOENIX_PRICE;
    const mintTx = await this.contract.mint({ value: price });
    await mintTx.wait();

    return mintTx;
  }
}
