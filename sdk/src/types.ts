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
  ZksyncEraGoerli = 280,
  ArbitrumGoerli = 421613,
  LineaGoerli = 59140,
  BaseGoerli = 84531,
  ScrollSepolia = 534351
}

export type SUPPORTED_CHAIN_ID = Network.ZksyncEra | Network.ZksyncEraGoerli;

export interface Token {
  // native tokens all have 18 decimals
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}
