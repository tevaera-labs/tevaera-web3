/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { GetContractAddresses, GetZkSyncProvider } from "../utils";
import { formatUnits } from "ethers/lib/utils";
import { Network } from "../types";

export class KarmaPoint {
  readonly contract: zksync.Contract;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;
    if (!network) throw new Error("network is reuired.");
    const { karmaPointContractAddress } = GetContractAddresses(network);

    if (web3Provider) {
      this.contract = new zksync.Contract(
        karmaPointContractAddress,
        require("../abi/KarmaPoint.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!privateKey) throw new Error("private key is reuired.");

      const zkSyncProvider = GetZkSyncProvider(network);
      const wallet = new zksync.Wallet(privateKey, zkSyncProvider);

      this.contract = new zksync.Contract(
        karmaPointContractAddress,
        require("../abi/KarmaPoint.json").abi,
        wallet._signerL2()
      );
    }
  }

  async GetKpBalance(address: string): Promise<number> {
    const balance = await this.contract.balanceOf(address);
    return balance;
  }

  async GetKpBuyCap(): Promise<number> {
    const capping = await this.contract.buyCap();
    return capping;
  }

  async GetKpPrice(kpAmount: number): Promise<string> {
    const price = await this.contract.getPrice(kpAmount);
    const formattedPrice = formatUnits(price, 18);

    return formattedPrice;
  }

  async GetKpBuyingCap(): Promise<number> {
    return this.contract.buyCap();
  }

  async GetBoughtKarmaPoints(wallet: string): Promise<number> {
    return this.contract.boughtKP(wallet);
  }

  async BuyKarmaPoints(kpAmount: number): Promise<unknown> {
    const tx = await this.contract.buy(kpAmount, {
      value: ethers.utils.parseUnits(await this.GetKpPrice(kpAmount), 18),
    });
    await tx.wait();

    return tx;
  }

  async WithdrawKarmaPoints(kpAmount: number): Promise<unknown> {
    const tx = await this.contract.withdraw(kpAmount);
    await tx.wait();

    return tx;
  }
}
