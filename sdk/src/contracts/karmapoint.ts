/* import dependencies */
import { ethers } from "ethers";
import * as zksync from "zksync-web3";

import {
  getContractAddresses,
  getPaymasterCustomOverrides,
  getRpcProvider
} from "../utils";
import { formatUnits } from "ethers/lib/utils";
import { Network } from "../types";

export class KarmaPoint {
  readonly contract: ethers.Contract;
  readonly network: Network;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    privateKey?: string;
    customRpcUrl?: string;
  }) {
    const { web3Provider, network, privateKey, customRpcUrl } = options;
    if (!network) throw new Error("network is reuired.");
    const { karmaPointContractAddress } = getContractAddresses(network);

    if (!karmaPointContractAddress) throw new Error("Contract not found!");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        karmaPointContractAddress,
        require("../abi/KarmaPoint.json").abi,
        web3Provider.getSigner() || web3Provider
      );
    } else {
      const rpcProvider = getRpcProvider(network, customRpcUrl);

      let wallet;
      if (privateKey) wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        karmaPointContractAddress,
        require("../abi/KarmaPoint.json").abi,
        wallet || rpcProvider
      );
    }

    this.network = network;
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

  async buyKarmaPoints(
    kpAmount: number,
    feeToken?: string,
    isGaslessFlow?: boolean
  ): Promise<unknown> {
    let overrides = {
      value: ethers.utils.parseUnits(await this.getKpPrice(kpAmount), 18)
    };

    // estimate gas for paymaster transaction
    let gasLimit;
    if (feeToken) {
      gasLimit = await this.contract.estimateGas.buy(kpAmount, overrides);
    }

    // update paymaster params with the updated fee
    overrides = await getPaymasterCustomOverrides({
      network: this.network,
      overrides,
      feeToken,
      isGaslessFlow,
      contract: this.contract,
      gasLimit
    });

    const tx = await this.contract.buy(kpAmount, overrides);

    return tx;
  }

  async withdrawKarmaPoints(
    kpAmount: number,
    feeToken?: string,
    isGaslessFlow?: boolean
  ): Promise<unknown> {
    // get paymaster overrides if applicable
    let overrides = {};

    // estimate gas for paymaster transaction
    let gasLimit;
    if (feeToken) {
      gasLimit = await this.contract.estimateGas.withdraw(kpAmount, overrides);
    }

    // update paymaster params with the updated fee
    overrides = await getPaymasterCustomOverrides({
      network: this.network,
      overrides,
      feeToken,
      isGaslessFlow,
      contract: this.contract,
      gasLimit
    });

    const tx = await this.contract.withdraw(kpAmount, overrides);

    return tx;
  }
}
