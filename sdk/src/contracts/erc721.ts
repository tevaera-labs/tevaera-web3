/* import dependencies */
import { ContractRunner, formatUnits, getBytes, parseUnits } from "ethers";

import { ContractFactory } from "../factories/ContractFactory";
import { getRpcProvider } from "../utils";
import { Network, SupportedContract } from "../types";
import { WalletFactory } from "../factories/WalletFactory";

export class ERC721 {
  readonly contract: SupportedContract;
  readonly network: Network;

  constructor(options: {
    erc721ContractAddress: string;
    network: Network;
    contractRunner?: ContractRunner;
    privateKey?: string;
    customRpcUrl?: string;
  }) {
    const {
      contractRunner,
      customRpcUrl,
      erc721ContractAddress,
      network,
      privateKey
    } = options;
    if (!network) throw new Error("network is reuired.");
    if (!erc721ContractAddress)
      throw new Error("erc721ContractAddress is reuired.");

    if (contractRunner) {
      const contractFactory = new ContractFactory(network);
      this.contract = contractFactory.createContract(
        erc721ContractAddress,
        require("../abi/ERC721.json").abi,
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

  async getMetadataUri(tokenId: number): Promise<string> {
    const uri = await this.contract.tokenURI(tokenId);

    return uri;
  }

  async getName(): Promise<string> {
    const name = await this.contract.name();
    return name;
  }

  async getSymbol(): Promise<string> {
    const symbol = await this.contract.symbol();
    return symbol;
  }

  async getTokensByWallet(address: string): Promise<number[]> {
    const noOfTokens = await this.contract.balanceOf(address);
    const tokenIds: number[] = [];
    for (let index = 0; index < noOfTokens; index++) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, index);
      tokenIds.push(tokenId);
    }

    return tokenIds;
  }

  async getOwnerOf(tokenId: string): Promise<string> {
    const address = await this.contract.ownerOf(parseUnits(tokenId, 0));
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
        ? Number(formatUnits(royaltyAmount, 18)) // Assuming it's ETH
        : 0
    };
  }

  async isERC721(): Promise<boolean> {
    const erc721InterfaceId = getBytes("0x80ac58cd");
    const isErc721 = await this.contract.supportsInterface(erc721InterfaceId);
    return isErc721;
  }
}
