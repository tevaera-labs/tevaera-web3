/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import {
  getContractAddresses,
  getPaymasterCustomOverrides,
  getRpcProvider
} from "../utils";
import { Network } from "../types";

export class TevaQuestRegistry {
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
    const { tevaQuestRegistryAddress } = getContractAddresses(network);

    if (!tevaQuestRegistryAddress) throw new Error("Contract not found!");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        tevaQuestRegistryAddress,
        require("../abi/TevaQuestRegistry.json").abi,
        web3Provider.getSigner() || web3Provider
      );
    } else {
      const rpcProvider = getRpcProvider(network, customRpcUrl);

      let wallet;
      if (privateKey) wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        tevaQuestRegistryAddress,
        require("../abi/TevaQuestRegistry.json").abi,
        wallet || rpcProvider
      );
    }

    this.network = network;
  }

  async getLastParticipation(address: string): Promise<number> {
    const lastParticipation = await this.contract.lastParticipation(address);

    return lastParticipation;
  }

  async getQuestStreak(address: string): Promise<number> {
    const questStreak = await this.contract.questStreak(address);

    return questStreak;
  }

  async register(feeToken?: string, isGaslessFlow?: boolean): Promise<unknown> {
    let overrides = {};

    // estimate gas for paymaster transaction
    let gasLimit;
    if (feeToken) {
      gasLimit = await this.contract.estimateGas.mint(overrides);
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

    const registerTxn = await this.contract.register(overrides);

    return registerTxn;
  }

  async completeQuest(
    questStreak: number,
    validTill: number,
    signature: string,
    feeToken?: string,
    isGaslessFlow?: boolean
  ): Promise<unknown> {
    let overrides = {};

    // estimate gas for paymaster transaction
    let gasLimit;
    if (feeToken) {
      gasLimit = await this.contract.estimateGas.mint(overrides);
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

    const completeQuestTxn = await this.contract.completeQuest(
      questStreak,
      validTill,
      signature,
      overrides
    );

    return completeQuestTxn;
  }
}
