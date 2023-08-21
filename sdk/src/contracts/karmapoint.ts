/* import dependencies */
import { ethers } from "ethers";
import * as zksync from "zksync-web3";

import { getContractAddresses, getRpcProvider } from "../utils";
import { formatUnits } from "ethers/lib/utils";
import { Network } from "../types";

export class KarmaPoint {
  readonly contract: ethers.Contract;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;
    if (!network) throw new Error("network is reuired.");
    const { karmaPointContractAddress } = getContractAddresses(network);

    if (!karmaPointContractAddress) throw new Error("Contract not found!");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        karmaPointContractAddress,
        require("../abi/KarmaPoint.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!privateKey) throw new Error("private key is reuired.");

      const rpcProvider = getRpcProvider(network);
      const wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        karmaPointContractAddress,
        require("../abi/KarmaPoint.json").abi,
        wallet
      );
    }
  }

  async getKpBalance(address: string): Promise<number> {
    const balance = await this.contract.balanceOf(address);
    return balance;
  }

  async getKpBuyCap(): Promise<number> {
    const capping = await this.contract.buyCap();
    return capping;
  }

  async getKpPrice(kpAmount: number): Promise<string> {
    const price = await this.contract.getPrice(kpAmount);
    const formattedPrice = formatUnits(price, 18);

    return formattedPrice;
  }

  async getKpBuyingCap(): Promise<number> {
    return this.contract.buyCap();
  }

  async getBoughtKarmaPoints(wallet: string): Promise<number> {
    return this.contract.boughtKP(wallet);
  }

  async buyKarmaPoints(kpAmount: number): Promise<unknown> {
    const tx = await this.contract.buy(kpAmount, {
      value: ethers.utils.parseUnits(await this.getKpPrice(kpAmount), 18)
    });
    await tx.wait();

    return tx;
  }

  async withdrawKarmaPoints(kpAmount: number): Promise<unknown> {
    const tx = await this.contract.withdraw(kpAmount);
    await tx.wait();

    return tx;
  }
}
