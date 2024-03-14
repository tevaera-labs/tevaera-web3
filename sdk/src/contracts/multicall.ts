/* import dependencies */
import { ContractFactory } from "../factories/ContractFactory";
import {
  getContractAddresses,
  getPaymasterCustomOverrides,
  getRpcProvider
} from "../utils";
import { Network, SupportedContract } from "../types";
import { WalletFactory } from "../factories/WalletFactory";
import { ContractRunner } from "ethers";

export class Multicall {
  readonly multicall: SupportedContract;
  readonly network: Network;

  constructor(options: {
    network: Network;
    contractRunner?: ContractRunner;
    privateKey?: string;
    customRpcUrl?: string;
  }) {
    const { contractRunner, network, privateKey, customRpcUrl } = options;
    if (!network) throw new Error("network is reuired.");
    const { multicallContractAddress } = getContractAddresses(network);

    if (!multicallContractAddress)
      throw new Error("Multicall Contract not found!");

    if (contractRunner) {
      const contractFactory = new ContractFactory(network);
      this.multicall = contractFactory.createContract(
        multicallContractAddress,
        require("../abi/Multicall.json").abi,
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
      this.multicall = contractFactory.createContract(
        multicallContractAddress,
        require("../abi/Multicall.json").abi,
        wallet || rpcProvider
      );
    }

    this.network = network;
  }

  async Aggregate(
    targets: string[],
    callDatas: string[],
    values: bigint[],
    feeToken?: string,
    isGaslessFlow?: boolean
  ): Promise<void> {
    let totalValue = BigInt("0");
    // sum up all values
    for (let index = 0; index < values.length; index += 1) {
      const value = values[index];
      totalValue = totalValue + value;
    }

    let overrides = {
      value: totalValue // Total value to send
    };

    // estimate gas for paymaster transaction
    let gasLimit;
    if (feeToken) {
      gasLimit = await this.multicall.aggregatePayable.estimateGas(
        targets,
        callDatas,
        values,
        overrides
      );
    }

    // update paymaster params with the updated fee
    overrides = await getPaymasterCustomOverrides({
      network: this.network,
      overrides,
      feeToken,
      isGaslessFlow,
      contract: this.multicall,
      gasLimit
    });

    // muticall
    const tx = await this.multicall.aggregatePayable(
      targets,
      callDatas,
      values,
      overrides
    );

    return tx;
  }
}
