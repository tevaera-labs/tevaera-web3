/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { GUARDIANS_CONTRACT_ADDRESS, GetZkSyncProvider } from "../utils";
import { Network } from "../types";

export class Guardians {
  readonly contract: zksync.Contract;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network?: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;

    if (web3Provider) {
      this.contract = new zksync.Contract(
        GUARDIANS_CONTRACT_ADDRESS,
        require("../abi/Guardians.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!network || !privateKey)
        throw new Error("network and private key are reuired.");

      const zkSyncProvider = GetZkSyncProvider(network);
      const wallet = new zksync.Wallet(privateKey, zkSyncProvider);

      this.contract = new zksync.Contract(
        GUARDIANS_CONTRACT_ADDRESS,
        require("../abi/Guardians.json").abi,
        wallet._signerL2()
      );
    }
  }

  async GetGuardianByIndex(index: number): Promise<unknown[]> {
    const guardian = await this.contract._guardianCollection(index);

    return guardian;
  }

  async GetGuardianIndexByTokenId(tokenId: number): Promise<number> {
    const index = await this.contract._tokenIdToGuardianIndex(tokenId);

    return index;
  }

  async GetGuardiansByWallet(address: string): Promise<number[]> {
    const noOfGuardians = await this.contract.balanceOf(address);
    const guardians: number[] = [];
    if (noOfGuardians > 0) {
      for (let index = 0; index < noOfGuardians; index++) {
        const tokenId = await this.contract.tokenOfOwnerByIndex(address, index);
        const guardianIndex = await this.GetGuardianIndexByTokenId(tokenId);
        guardians.push(guardianIndex);
      }
    }

    return guardians;
  }

  async MintGuardian(guardianIndex: number): Promise<unknown> {
    const guardian = await this.GetGuardianByIndex(guardianIndex);
    const [, , , , , price, ,] = guardian;
    console.log(price);
    const mintTx = await this.contract.mint(guardianIndex, { value: price });
    await mintTx.wait();

    return mintTx;
  }
}
