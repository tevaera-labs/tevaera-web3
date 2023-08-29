/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { getRpcProvider } from "../utils";
import { formatUnits } from "ethers/lib/utils";
import { Network } from "../types";

export class ERC721 {
  readonly contract: ethers.Contract;
  readonly network: Network;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    erc721ContractAddress: string;
    privateKey?: string;
  }) {
    const { web3Provider, network, erc721ContractAddress, privateKey } =
      options;
    if (!network) throw new Error("network is reuired.");
    if (!erc721ContractAddress)
      throw new Error("erc721ContractAddress is reuired.");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        erc721ContractAddress,
        require("../abi/ERC721.json").abi,
        web3Provider
      );
    } else {
      const rpcProvider = getRpcProvider(network);

      let wallet;
      if (privateKey) wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        erc721ContractAddress,
        require("../abi/ERC721.json").abi,
        wallet || rpcProvider
      );
    }

    this.network = network;
  }

  async getBalanceOf(address: string): Promise<number> {
    const balance = await this.contract.balanceOf(address);
    return balance;
  }

  async getName(): Promise<string> {
    const name = await this.contract.name();
    return name;
  }

  async getSymbol(): Promise<string> {
    const symbol = await this.contract.symbol();
    return symbol;
  }

  async getOwnerOf(tokenId: string): Promise<string> {
    const address = await this.contract.ownerOf(
      ethers.utils.parseUnits(tokenId, 0)
    );
    return address;
  }

  async getTotalSupply(): Promise<string> {
    const totalSupply = await this.contract.totalSupply();
    return formatUnits(totalSupply, 0);
  }

  async getContractURI(): Promise<string> {
    const contractURI = await this.contract.contractURI();
    return contractURI;
  }

  async getOwner(): Promise<string> {
    const owner = await this.contract.owner();
    return owner;
  }

  async getRoyaltyInfo(
    tokenId: string,
    salePrice: string
  ): Promise<{ receiver?: string; royaltyAmount: number }> {
    const { receiver, royaltyAmount } = await this.contract.royaltyInfo(
      tokenId,
      salePrice
    );

    return {
      receiver,
      royaltyAmount: royaltyAmount
        ? Number(ethers.utils.formatUnits(royaltyAmount, 18)) // Assuming it's ETH
        : 0
    };
  }

  async isERC721(): Promise<boolean> {
    const erc721InterfaceId = ethers.utils.arrayify("0x80ac58cd");
    const isErc721 = await this.contract.supportsInterface(erc721InterfaceId);
    return isErc721;
  }
}
