/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { KARMA_POINT_CONTRACT_ADDRESS } from "../utils";
import { formatUnits } from "ethers/lib/utils";

export class KarmaPoint {
  readonly web3Provider: zksync.Web3Provider | ethers.providers.Web3Provider;
  readonly contract: zksync.Contract;

  constructor(
    web3Provider: zksync.Web3Provider | ethers.providers.Web3Provider
  ) {
    this.web3Provider = web3Provider;
    this.contract = new zksync.Contract(
      KARMA_POINT_CONTRACT_ADDRESS,
      require("../abi/KarmaPoint.json").abi,
      this.web3Provider.getSigner()
    );
  }

  async GetKpBalance(address: string): Promise<number> {
    const balance = await this.contract.balanceOf(address);
    return balance;
  }

  async GetKpBuyCap(): Promise<number> {
    const capping = await this.contract._buyCap();
    return capping;
  }

  async GetKpPrice(kpAmount: number): Promise<string> {
    const price = await this.contract.getPrice(kpAmount);
    const formattedPrice = formatUnits(price, 18);

    return formattedPrice;
  }

  async GetKpBuyingCap(): Promise<number> {
    return this.contract._buyCap();
  }

  async GetBoughtKarmaPoints(wallet: string): Promise<number> {
    return this.contract._boughtKP(wallet);
  }

  async BuyKarmaPoints(kpAmount: number): Promise<unknown> {
    const tx = await this.contract.buyViaETH(kpAmount, {
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
