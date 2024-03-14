import * as zksync from "zksync-ethers";
import * as ethers from "ethers";

// supported chains
export type SUPPORTED_CHAIN_ID =
  | Network.ZksyncEra
  | Network.ZksyncEraGoerli
  | Network.ZksyncEraSepolia;

// provider types
export type EthersProvider = ethers.BrowserProvider | ethers.JsonRpcProvider;
export type ZkSyncProvider = zksync.BrowserProvider | zksync.Provider;
export type SupportedProvider = EthersProvider | ZkSyncProvider;
export type SupportedRpcProvider = ethers.JsonRpcProvider | zksync.Provider;

// contract types
export type SupportedContract = zksync.Contract | ethers.Contract;

// wallet types
export type SupportedWallet = zksync.Wallet | ethers.Wallet;

// Ethereum networks
export enum Network {
  // mainnets
  Ethereum = 1,
  ZksyncEra = 324,
  ArbitrumOne = 42161,
  Linea = 59144,
  Base = 8453,
  Scroll = 534352,
  // testnets
  Goerli = 5,
  Sepolia = 11155111,
  ZksyncEraGoerli = 280,
  ZksyncEraSepolia = 300,
  ArbitrumGoerli = 421613,
  ArbitrumSepolia = 421614,
  LineaGoerli = 59140,
  BaseGoerli = 84531,
  BaseSepolia = 84532,
  ScrollSepolia = 534351
}

export interface Token {
  // native tokens all have 18 decimals
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}
