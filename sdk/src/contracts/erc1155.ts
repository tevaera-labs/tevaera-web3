/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { getRpcProvider } from "../utils";
import { Network } from "../types";

export class ERC1155 {
  readonly contract: ethers.Contract;
  readonly network: Network;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    erc1155ContractAddress: string;
    privateKey?: string;
    customRpcUrl?: string;
  }) {
    const { web3Provider, network, erc1155ContractAddress, privateKey, customRpcUrl } =
      options;
    if (!network) throw new Error("network is reuired.");
    if (!erc1155ContractAddress)
      throw new Error("erc1155ContractAddress is reuired.");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        erc1155ContractAddress,
        require("../abi/ERC1155.json").abi,
        web3Provider
      );
    } else {
      const rpcProvider = getRpcProvider(network, customRpcUrl);

      let wallet;
      if (privateKey) wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
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
    const erc1155InterfaceId = ethers.utils.arrayify("0xd9b67a26");
    const isErc1155 = await this.contract.supportsInterface(erc1155InterfaceId);
    return isErc1155;
  }
}
