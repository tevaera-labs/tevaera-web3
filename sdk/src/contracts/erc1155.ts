/* import dependencies */
import { ContractRunner, getBytes } from "ethers";

import { ContractFactory } from "../factories/ContractFactory";
import { getRpcProvider } from "../utils";
import { Network, SupportedContract } from "../types";
import { WalletFactory } from "../factories/WalletFactory";

export class ERC1155 {
  readonly contract: SupportedContract;
  readonly network: Network;

  constructor(options: {
    erc1155ContractAddress: string;
    network: Network;
    contractRunner?: ContractRunner;
    privateKey?: string;
    customRpcUrl?: string;
  }) {
    const {
      contractRunner,
      customRpcUrl,
      erc1155ContractAddress,
      network,
      privateKey
    } = options;
    if (!network) throw new Error("network is reuired.");
    if (!erc1155ContractAddress)
      throw new Error("erc1155ContractAddress is reuired.");

    if (contractRunner) {
      const contractFactory = new ContractFactory(network);
      this.contract = contractFactory.createContract(
        erc1155ContractAddress,
        require("../abi/ERC1155.json").abi,
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
        erc1155ContractAddress,
        require("../abi/ERC1155.json").abi,
        wallet || rpcProvider
      );
    }

    this.network = network;
  }

  async getContractURI(): Promise<string> {
    const contractURI = await this.contract.contractURI();
    return contractURI;
  }

  async getOwner(): Promise<string> {
    const owner = await this.contract.owner();
    return owner;
  }

  async isERC1155(): Promise<boolean> {
    const erc1155InterfaceId = getBytes("0xd9b67a26");
    const isErc1155 = await this.contract.supportsInterface(erc1155InterfaceId);
    return isErc1155;
  }
}
