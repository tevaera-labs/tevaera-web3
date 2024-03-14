import * as zksync from "zksync-ethers";
import * as ethers from "ethers";

import { Network, SUPPORTED_CHAIN_ID, Token } from "./types";

// native token
export const NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

// Fee buffer for paymaster to be on the safer side in case gas prices slightly spike.
export const PRICE_BUFFER_BPS = "1500"; // 15%

// rpc urls
export const ZKSYNC_ERA_RPC_URL = "https://mainnet.era.zksync.io";
export const ZKSYNC_ERA_GOERLI_RPC_URL = "https://zksync2-testnet.zksync.dev";
export const ZKSYNC_ERA_SEPOLIA_RPC_URL = "https://sepolia.era.zksync.dev";

export const ARBITRUM_ONE_RPC_URL = "https://arb1.arbitrum.io/rpc";
export const ARBITRUM_GOERLI_RPC_URL = "https://goerli-rollup.arbitrum.io/rpc";
export const ARBITRUM_SEPOLIA_RPC_URL =
  "https://sepolia-rollup.arbitrum.io/rpc";

export const LINEA_RPC_URL = "https://rpc.linea.build";
export const LINEA_GOERLI_RPC_URL = "https://rpc.goerli.linea.build";

export const BASE_RPC_URL = "https://mainnet.base.org";
export const BASE_GOERLI_RPC_URL = "https://goerli.base.org";
export const BASE_SEPOLIA_RPC_URL = "https://sepolia.base.org";

export const SCROLL_RPC_URL = "https://rpc.scroll.io";
export const SCROLL_SEPOLIA_RPC_URL = "	https://sepolia-rpc.scroll.io";

export const TOKENS: Record<SUPPORTED_CHAIN_ID, Token[]> = {
  [Network.ZksyncEra]: [
    {
      address: "0x5aea5775959fbc2557cc8789bc1bf90a239d9a91",
      name: "Wrapped ETH",
      symbol: "WETH",
      decimals: 18
    },
    {
      address: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
      name: "USDC",
      symbol: "USDC",
      decimals: 6
    },
    {
      address: "0xBBeB516fb02a01611cBBE0453Fe3c580D7281011",
      name: "Wrapped BTC",
      symbol: "WBTC",
      decimals: 8
    }
  ],
  [Network.ZksyncEraGoerli]: [
    {
      address: "0x20b28B1e4665FFf290650586ad76E977EAb90c5D",
      name: "Wrapped ETH",
      symbol: "WETH",
      decimals: 18
    },
    {
      address: "0x0faF6df7054946141266420b43783387A78d82A9",
      name: "USDC",
      symbol: "USDC",
      decimals: 6
    },
    {
      address: "0x0BfcE1D53451B4a8175DD94e6e029F7d8a701e9c",
      name: "Wrapped BTC",
      symbol: "WBTC",
      decimals: 8
    }
  ],
  [Network.ZksyncEraSepolia]: [
    {
      address: "0x75a08aCC65ff9A98dCa04548c789F0F245985c52",
      name: "Wrapped ETH",
      symbol: "WETH",
      decimals: 18
    }
  ]
};

export function getToken(network: Network): Token[] {
  return TOKENS[network as SUPPORTED_CHAIN_ID];
}

export function getTokenBySymbol(
  network: Network,
  symbol: string
): Token | undefined {
  const tokens = TOKENS[network as SUPPORTED_CHAIN_ID];

  return tokens.find((x) => x.symbol === symbol);
}

export function getTokenByAddress(
  network: Network,
  address: string
): Token | undefined {
  const tokens = TOKENS[network as SUPPORTED_CHAIN_ID];

  return tokens.find((x) => x.address === address);
}

// tevaera contracts
export const getContractAddresses = (network: Network) => {
  switch (network) {
    case Network.ZksyncEra:
      return {
        tevaPayMasterContractAddress:
          "0x66ea743B004992f97a2e9fc187A607077f21781C",
        multicallContractAddress: "0xA81898C1BC737bfce6955aad572e7658f1be521e",
        sessionAccountFactoryAddress:
          "0xe78616f6CF87ffc3F33741BB731016A897f0cA88",
        tevaTrustedSignerAddress: "0x1b9eBb8F3c335dA62235Fe783cF5663979Eb7B04"
      };
    case Network.ZksyncEraGoerli:
      return {
        tevaPayMasterContractAddress:
          "0x5b9F16cFAF2a3F021ff6B9aD6794FCC3fDB4FeEe",
        multicallContractAddress: "0xDC3FBA29a533c484069d12E4e6061A7C9f41d841",
        sessionAccountFactoryAddress:
          "0x6C8e495f245feA71b8d15f6A6d217Bd930D5BA37",
        tevaTrustedSignerAddress: "0x9910FB35F401eFa865852b53285e678E21753e5e"
      };
    case Network.ZksyncEraSepolia:
      return {
        tevaPayMasterContractAddress:
          "0x9df772A3Ad838280BADd70652fcC0eFD60A14297",
        multicallContractAddress: "0x68172f20b3ec8305C4474BCBa1f9b7Bff461dFA8",
        sessionAccountFactoryAddress:
          "0xBee8e2e60c46E0db2Fe8cD222A8517C19fC59240",
        tevaTrustedSignerAddress: "0x9910FB35F401eFa865852b53285e678E21753e5e"
      };

    default:
      throw new Error("invalid network");
  }
};

export const getChainId = (network: Network) => {
  const key = Network[network];
  const value = Network[key as keyof typeof Network];
  return value;
};

export const getLzChainId = (network: Network) => {
  switch (network) {
    case Network.ZksyncEra:
      return 165;
    case Network.ZksyncEraGoerli:
      return 10165;
    case Network.ZksyncEraSepolia:
      return 10248;
    case Network.ArbitrumOne:
      return 110;
    case Network.ArbitrumGoerli:
      return 10143;
    case Network.ArbitrumSepolia:
      return 10231;
    case Network.Linea:
      return 183;
    case Network.LineaGoerli:
      return 10157;
    case Network.Base:
      return 184;
    case Network.BaseGoerli:
      return 10160;
    case Network.BaseSepolia:
      return 10245;
    case Network.Scroll:
      return 214;
    case Network.ScrollSepolia:
      return 10214;

    default:
      throw new Error("invalid network");
  }
};

export const getRpcProvider = (network: Network, customRpcUrl?: string) => {
  const rpcUrl = customRpcUrl || getRpcUrl(network);

  switch (network) {
    case Network.ZksyncEra:
    case Network.ZksyncEraGoerli:
    case Network.ZksyncEraSepolia:
      return new zksync.Provider(rpcUrl);
    case Network.ArbitrumOne:
    case Network.ArbitrumGoerli:
    case Network.ArbitrumSepolia:
    case Network.Linea:
    case Network.LineaGoerli:
    case Network.Base:
    case Network.BaseGoerli:
    case Network.BaseSepolia:
    case Network.Scroll:
    case Network.ScrollSepolia:
      return new ethers.JsonRpcProvider(rpcUrl);

    default:
      throw new Error("invalid network");
  }
};

export const getRpcUrl = (network: Network) => {
  switch (network) {
    case Network.ZksyncEra:
      return ZKSYNC_ERA_RPC_URL;
    case Network.ZksyncEraGoerli:
      return ZKSYNC_ERA_GOERLI_RPC_URL;
    case Network.ZksyncEraSepolia:
      return ZKSYNC_ERA_SEPOLIA_RPC_URL;
    case Network.ArbitrumOne:
      return ARBITRUM_ONE_RPC_URL;
    case Network.ArbitrumGoerli:
      return ARBITRUM_GOERLI_RPC_URL;
    case Network.ArbitrumSepolia:
      return ARBITRUM_SEPOLIA_RPC_URL;
    case Network.Linea:
      return LINEA_RPC_URL;
    case Network.LineaGoerli:
      return LINEA_GOERLI_RPC_URL;
    case Network.Base:
      return BASE_RPC_URL;
    case Network.BaseGoerli:
      return BASE_GOERLI_RPC_URL;
    case Network.BaseSepolia:
      return BASE_SEPOLIA_RPC_URL;
    case Network.Scroll:
      return SCROLL_RPC_URL;
    case Network.ScrollSepolia:
      return SCROLL_SEPOLIA_RPC_URL;

    default:
      throw new Error("invalid network");
  }
};

export async function calculateFee(options: {
  network: Network;
  fee: bigint;
  feeToken: string;
  customRpcUrl?: string;
}): Promise<ethers.BigNumberish> {
  const { customRpcUrl, fee, feeToken, network } = options;

  console.log("[Teva Paymaster] Gas fee in ETH: %s", fee.toString());

  // Let the paymaster flow; don't break anything. Instead, allow the user to pay in ETH and continue.
  try {
    // get teva paymaster address
    const { tevaPayMasterContractAddress } = getContractAddresses(network);
    const rpcProvider = getRpcProvider(network, customRpcUrl);
    const paymaster = new zksync.Contract(
      tevaPayMasterContractAddress as string,
      require("./abi/TevaPaymaster.json").abi,
      rpcProvider
    );

    const token = getTokenByAddress(network, feeToken);
    if (!token) {
      throw new Error(
        `Fee token (${feeToken}) is not supported for the paymaster.`
      );
    }

    const { decimals } = token;
    const tokenPricesInUSD = await paymaster.tokenPricesInUSD(feeToken);

    if (Number(tokenPricesInUSD) === 0) {
      throw new Error(
        `Fee token (${feeToken}) is not supported for the paymaster.`
      );
    }

    const ethPriceInUSD = await paymaster.tokenPricesInUSD(
      NATIVE_TOKEN_ADDRESS
    );

    const additionalDecimals = 18 - decimals;
    const exponent = BigInt(10) ** BigInt(additionalDecimals);
    const priceInToken =
      ((fee * BigInt(ethPriceInUSD)) / BigInt(tokenPricesInUSD)) * exponent;
    const buffer = (priceInToken * BigInt(PRICE_BUFFER_BPS)) / BigInt("10000");

    return priceInToken + buffer;
  } catch (error) {
    console.error(
      "Error occured while calculating the fee with fee token: " + feeToken
    );

    throw error;
  }
}

export async function getPaymasterCustomOverrides(options: {
  network: Network;
  overrides?: any;
  feeToken?: string;
  isGaslessFlow?: boolean;
  contract?: zksync.Contract;
  gasLimit?: bigint;
}): Promise<any> {
  const { contract, feeToken, gasLimit, isGaslessFlow, network } = options;
  let { overrides = {} } = options;

  // Let the paymaster flow; don't break anything. Instead, allow the user to pay in ETH and continue.
  try {
    // get teva paymaster address
    const { tevaPayMasterContractAddress } = getContractAddresses(network);
    if (!tevaPayMasterContractAddress) {
      throw new Error("Teva Paymaster is not configured!");
    }

    // get paymaster params based on the paymaster flow
    let paymasterParams: zksync.types.PaymasterParams;
    // if feeToken is provided, it's approval-based paymaster flow
    if (
      feeToken &&
      ![
        NATIVE_TOKEN_ADDRESS,
        zksync.utils.ETH_ADDRESS,
        zksync.utils.L2_ETH_TOKEN_ADDRESS
      ].includes(feeToken)
    ) {
      console.log("[TevaPaymaster] Approval based flow");

      let fee;
      // add gas limit if provided explicitly
      if (contract && gasLimit) {
        const provider = await getRpcProvider(network);
        const gasPrice = await (provider as zksync.Provider).getGasPrice();
        // calculate fee in given token
        fee = await calculateFee({
          network,
          fee: BigInt(gasPrice) * gasLimit,
          feeToken
        });

        overrides.gasLimit = gasLimit;
      }

      // add paymaster approval based params
      paymasterParams = zksync.utils.getPaymasterParams(
        tevaPayMasterContractAddress,
        {
          type: "ApprovalBased",
          token: feeToken,
          // set minimalAllowance as we defined in the paymaster contract
          minimalAllowance: BigInt(1),
          // empty bytes as testnet paymaster does not use innerInput
          innerInput: new Uint8Array()
        }
      );
    } else if (isGaslessFlow) {
      console.log("[TevaPaymaster] General flow");
      // it's a general paymaster flow
      paymasterParams = zksync.utils.getPaymasterParams(
        tevaPayMasterContractAddress,
        {
          type: "General",
          innerInput: new Uint8Array()
        }
      );
    } else {
      return overrides;
    }

    const customData = {
      paymasterParams,
      gasPerPubdata: zksync.utils.DEFAULT_GAS_PER_PUBDATA_LIMIT
    };

    return {
      ...overrides,
      customData
    };
  } catch (error) {
    console.error(
      "Error occured in Teva Paymaster: " + JSON.stringify({ error })
    );

    return overrides;
  }
}
