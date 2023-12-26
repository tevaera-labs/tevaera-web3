/* import dependencies */
import { BigNumber, BigNumberish, ethers } from "ethers";
import * as zksync from "zksync-web3";

import {
  getContractAddresses,
  getPaymasterCustomOverrides,
  getRpcProvider
} from "../utils";
import { Network } from "../types";

export class Multicall {
  readonly karmapoint: ethers.Contract;
  readonly citizenid: ethers.Contract;
  readonly guardianbundler: ethers.Contract;
  readonly multicall: ethers.Contract;
  readonly karmapointAddress: string;
  readonly citizenidAddress: string;
  readonly guardianbundlerAddress: string;
  readonly network: Network;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    privateKey?: string;
    customRpcUrl?: string;
  }) {
    const { web3Provider, network, privateKey, customRpcUrl } = options;
    if (!network) throw new Error("network is reuired.");
    const {
      citizenIdContractAddress,
      guardianBundlerContractAddress,
      multicallContractAddress,
      karmaPointContractAddress
    } = getContractAddresses(network);

    if (!citizenIdContractAddress)
      throw new Error("CitizenID Contract not found!");
    if (!guardianBundlerContractAddress)
      throw new Error("GuardianBundler Contract not found!");
    if (!multicallContractAddress)
      throw new Error("Multicall Contract not found!");
    if (!karmaPointContractAddress)
      throw new Error("KarmaPoint Contract not found!");

    this.citizenidAddress = citizenIdContractAddress;
    this.guardianbundlerAddress = guardianBundlerContractAddress;
    this.karmapointAddress = karmaPointContractAddress;

    if (web3Provider) {
      this.citizenid = new ethers.Contract(
        citizenIdContractAddress,
        require("../abi/CitizenId.json").abi,
        web3Provider.getSigner() || web3Provider
      );
      this.guardianbundler = new ethers.Contract(
        guardianBundlerContractAddress,
        require("../abi/GuardianBundler.json").abi,
        web3Provider.getSigner() || web3Provider
      );
      this.multicall = new ethers.Contract(
        multicallContractAddress,
        require("../abi/Multicall.json").abi,
        web3Provider.getSigner() || web3Provider
      );
      this.karmapoint = new ethers.Contract(
        karmaPointContractAddress,
        require("../abi/KarmaPoint.json").abi,
        web3Provider.getSigner() || web3Provider
      );
    } else {
      const rpcProvider = getRpcProvider(network, customRpcUrl);

      let wallet;
      if (privateKey) wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.citizenid = new ethers.Contract(
        citizenIdContractAddress,
        require("../abi/CitizenId.json").abi,
        wallet || rpcProvider
      );
      this.guardianbundler = new ethers.Contract(
        guardianBundlerContractAddress,
        require("../abi/GuardianBundler.json").abi,
        wallet || rpcProvider
      );
      this.multicall = new ethers.Contract(
        multicallContractAddress,
        require("../abi/Multicall.json").abi,
        wallet || rpcProvider
      );
      this.karmapoint = new ethers.Contract(
        karmaPointContractAddress,
        require("../abi/KarmaPoint.json").abi,
        wallet || rpcProvider
      );
    }

    this.network = network;
  }

  async Aggregate(
    targets: string[],
    callDatas: string[],
    values: BigNumberish[],
    feeToken?: string,
    isGaslessFlow?: boolean
  ): Promise<void> {
    let totalValue = BigNumber.from("0");
    // sum up all values
    for (let index = 0; index < values.length; index += 1) {
      const value = values[index];
      totalValue = totalValue.add(value);
    }

    let overrides = {
      value: totalValue // Total value to send
    };

    // get paymaster overrides if applicable
    overrides = await getPaymasterCustomOverrides({
      network: this.network,
      overrides,
      feeToken,
      isGaslessFlow
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

  async MintTevaBundle(
    address: string,
    feeToken?: string,
    isGaslessFlow?: boolean
  ): Promise<void> {
    const kpToBuy = 10;
    const targets = [
      this.citizenidAddress,
      this.guardianbundlerAddress,
      this.karmapointAddress,
      this.karmapointAddress
    ];
    const callDatas = [
      this.citizenid.interface.encodeFunctionData("mintForAddress(address)", [
        address
      ]),
      this.guardianbundler.interface.encodeFunctionData(
        "mintForAddress(address)",
        [address]
      ),
      this.karmapoint.interface.encodeFunctionData(
        "buyForAddress(address,uint256)",
        [address, kpToBuy]
      ),
      this.karmapoint.interface.encodeFunctionData(
        "withdrawForAddress(address,uint256)",
        [address, kpToBuy]
      )
    ];
    // get kp price
    const citizenidPrice = await this.citizenid.tokenPrice();
    const guardianbundlePrice = await this.guardianbundler.bundlePrice();
    const kpPrice = await this.karmapoint.getPrice(kpToBuy);

    const values = [citizenidPrice, guardianbundlePrice, kpPrice, 0];

    let overrides = {
      value: citizenidPrice.add(guardianbundlePrice).add(kpPrice) // Total value to send
    };

    // get paymaster overrides if applicable
    overrides = await getPaymasterCustomOverrides({
      network: this.network,
      overrides,
      feeToken,
      isGaslessFlow
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
