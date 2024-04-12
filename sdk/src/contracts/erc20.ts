/* import dependencies */
import { ContractRunner, formatUnits, parseUnits } from "ethers";

import { ContractFactory } from "../factories/ContractFactory";
import { getPaymasterCustomOverrides, getRpcProvider } from "../utils";
import { Network, SupportedContract, Token } from "../types";
import { WalletFactory } from "../factories/WalletFactory";

export class ERC20 {
  readonly contract: SupportedContract;
  readonly network: Network;

  constructor(options: {
    network: Network;
    erc20ContractAddress: string;
    contractRunner?: ContractRunner;
    privateKey?: string;
    customRpcUrl?: string;
  }) {
    const {
      contractRunner,
      customRpcUrl,
      erc20ContractAddress,
      network,
      privateKey
    } = options;
    if (!network) throw new Error("network is reuired.");
    if (!erc20ContractAddress)
      throw new Error("erc20ContractAddress is reuired.");

    if (contractRunner) {
      const contractFactory = new ContractFactory(network);
      this.contract = contractFactory.createContract(
        erc20ContractAddress,
        require("../abi/ERC20.json").abi,
        contractRunner
      );
    } else {
      const rpcProvider = getRpcProvider(network, customRpcUrl);

      let wallet;
      if (privateKey) {
        const walletFactory = new WalletFactory(rpcProvider);
        wallet = walletFactory.createWallet(privateKey);
      }

      const contractFactory = new ContractFactory(network);
      this.contract = contractFactory.createContract(
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

  async getDecimals(): Promise<bigint | undefined> {
    const decimals = await this.contract.decimals();
    return BigInt(decimals);
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
    feeToken?: Token,
    isGaslessFlow?: boolean
  ): Promise<unknown> {
    // get paymaster overrides if applicable
    let overrides = {};

    // estimate gas for paymaster transaction
    let gasLimit;
    if (feeToken) {
      gasLimit = await this.contract.approve.estimateGas(
        spender,
        parseUnits(value, await this.getDecimals()),
        overrides
      );
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

    return this.contract.approve(
      spender,
      parseUnits(value, await this.getDecimals()),
      overrides
    );
  }
}
