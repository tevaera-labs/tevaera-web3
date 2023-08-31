/* import dependencies */
import * as zksync from "zksync-web3";
import { BigNumberish, ethers } from "ethers";

import { getPaymasterCustomOverrides, getRpcProvider } from "../utils";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { Network } from "../types";

export class ERC20 {
  readonly contract: ethers.Contract;
  readonly network: Network;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    erc20ContractAddress: string;
    privateKey?: string;
  }) {
    const { web3Provider, network, erc20ContractAddress, privateKey } = options;
    if (!network) throw new Error("network is reuired.");
    if (!erc20ContractAddress)
      throw new Error("erc20ContractAddress is reuired.");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        erc20ContractAddress,
        require("../abi/ERC20.json").abi,
        web3Provider.getSigner() || web3Provider
      );
    } else {
      const rpcProvider = getRpcProvider(network);

      let wallet;
      if (privateKey) wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        erc20ContractAddress,
        require("../abi/ERC20.json").abi,
        wallet || rpcProvider
      );
    }

    this.network = network;
  }

  async getBalanceOf(address: string): Promise<string> {
    const balance = await this.contract.balanceOf(address);
    return formatUnits(balance, await this.getDecimals());
  }

  async getDecimals(): Promise<BigNumberish | undefined> {
    const decimals = await this.contract.decimals();
    return decimals;
  }

  async getName(): Promise<string> {
    const name = await this.contract.name();
    return name;
  }

  async getSymbol(): Promise<string> {
    const symbol = await this.contract.symbol();
    return symbol;
  }

  async getTotalSupply(): Promise<string> {
    const totalSupply = await this.contract.totalSupply();
    return formatUnits(totalSupply, 0);
  }

  async getAllowance(owner: string, spender: string): Promise<string> {
    const allowance = await this.contract.allowance(owner, spender);
    return formatUnits(allowance, await this.getDecimals());
  }

  async setAllowance(
    spender: string,
    value: string,
    feeToken?: string,
    isGaslessFlow?: boolean
  ): Promise<unknown> {
    // get paymaster overrides if applicable
    const overrides = await getPaymasterCustomOverrides({
      network: this.network,
      overrides: {},
      feeToken,
      isGaslessFlow
    });

    return this.contract.approve(
      spender,
      parseUnits(value, await this.getDecimals()),
      overrides
    );
  }
}
