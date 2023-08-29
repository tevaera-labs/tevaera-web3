import { ethers } from "ethers";
import * as zksync from "zksync-web3";

import { ERC20 } from "./contracts/erc20";
import { Network } from "./types";

// rpc urls
export const ZKSYNC_ERA_RPC_URL = "https://mainnet.era.zksync.io";
export const ZKSYNC_ERA_GOERLI_RPC_URL = "https://zksync2-testnet.zksync.dev";

export const ARBITRUM_ONE_RPC_URL = "https://arb1.arbitrum.io/rpc";
export const ARBITRUM_GOERLI_RPC_URL = "https://goerli-rollup.arbitrum.io/rpc";

export const LINEA_RPC_URL = "https://linea-mainnet.infura.io/v3";
export const LINEA_GOERLI_RPC_URL = "https://rpc.goerli.linea.build";

// tevaera contracts
export const getContractAddresses = (network: Network) => {
  switch (network) {
    case Network.ZksyncEraGoerli:
      return {
        citizenIdContractAddress: "0x52f6C2822e68FC05E565AD13F596d8dBc40166f9",
        karmaPointContractAddress: "0xD9471ac50B1015275911C9fDfD2Ba734374415b1",
        claimContractAddress: "0x3F248D326d8eF82f88865afe2cbf5277a073a880",
        reformistSphinxContractAddress:
          "0x6fAa4B4b6b0745CFe7405eE04Ca8D28DA67779A7",
        magicalPhoenixContractAddress:
          "0x9bcb9074e760392907fcadDd18dE3bB48fEdFB5F",
        nomadicYetiContractAddress:
          "0x734D7483a98f405295842F7B6360424d28D73f4D",
        influentialWerewolfContractAddress:
          "0xAa9f35254255aE06384bC73D1b5DC50F993C2C47",
        innovativeUnicornContractAddress:
          "0x3A3A2f4a03ce48B31D3c76E46ce210005cE942BD",
        simplifierKrakenContractAddress:
          "0x31A8e9C2D851D2E7d0088B1a2Cc4F625BC938Cf4",
        balancerDragonContractAddress:
          "0x2c94b544BEe4994af23Fc5e9436C1195BFA8D2dF",
        guardianBundlerContractAddress:
          "0x6dC0590dF111B68c5273B3d1351d01936321dB93",
        tevaPayMasterContractAddress:
          "0x2F9b95557646146Ec7dBa6ff784ddC79244b14DC"
      };
    case Network.ArbitrumGoerli:
      return {
        nomadicYetiContractAddress:
          "0x1f2e4C36f4a494eddF797f8127a16B1Cac03c246",
        influentialWerewolfContractAddress:
          "0xE43EC1ce702cE29f17901a3444BbFeDB82a59Cde",
        innovativeUnicornContractAddress:
          "0xc78cB995aF1169Ba76185f37779aC455e76eCF30",
        simplifierKrakenContractAddress:
          "0xE120D9A60613DAFc8f3645eFca2587245799696a",
        balancerDragonContractAddress:
          "0x6BB26ecc0Db1E91979152406311215f8B0cA2e1c"
      };
    case Network.LineaGoerli:
      return {
        nomadicYetiContractAddress:
          "0x4F256A971bB10bec6Fef854C4b5D0D3c6C154734",
        influentialWerewolfContractAddress:
          "0x7A09C1C4081acE2836a1724a3262C6d7D3e776C8",
        innovativeUnicornContractAddress:
          "0x00711d691d20168629ED5D20F484C151da9a4D24",
        simplifierKrakenContractAddress:
          "0xDaad9f1c847dEdd1B54C037Ed5F63FD392c68cd0",
        balancerDragonContractAddress:
          "0xd4f548595E6fE4F9b2B0934146A721E3cad37157"
      };
    case Network.ArbitrumOne:
      throw new Error("Not implemented!");
    case Network.Linea:
      throw new Error("Not implemented!");

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
    case Network.ArbitrumOne:
      return 110;
    case Network.ArbitrumGoerli:
      return 10143;
    case Network.Linea:
      return 183;
    case Network.LineaGoerli:
      return 10157;

    default:
      throw new Error("invalid network");
  }
};

export const getRpcProvider = (network: Network) => {
  switch (network) {
    case Network.ZksyncEra:
      return new zksync.Provider(ZKSYNC_ERA_RPC_URL);
    case Network.ZksyncEraGoerli:
      return new zksync.Provider(ZKSYNC_ERA_GOERLI_RPC_URL);
    case Network.ArbitrumOne:
      return new ethers.providers.JsonRpcProvider(ARBITRUM_ONE_RPC_URL);
    case Network.ArbitrumGoerli:
      return new ethers.providers.JsonRpcProvider(ARBITRUM_GOERLI_RPC_URL);
    case Network.Linea:
      return new ethers.providers.JsonRpcProvider(LINEA_RPC_URL);
    case Network.LineaGoerli:
      return new ethers.providers.JsonRpcProvider(LINEA_GOERLI_RPC_URL);

    default:
      throw new Error("invalid network");
  }
};

export const getRpcUrl = (network: Network) => {
  switch (network) {
    case Network.ZksyncEra:
      return ZKSYNC_ERA_GOERLI_RPC_URL;
    case Network.ZksyncEraGoerli:
      return ZKSYNC_ERA_GOERLI_RPC_URL;
    case Network.ArbitrumOne:
      return ARBITRUM_ONE_RPC_URL;
    case Network.ArbitrumGoerli:
      return ARBITRUM_GOERLI_RPC_URL;
    case Network.Linea:
      return LINEA_RPC_URL;
    case Network.LineaGoerli:
      return LINEA_GOERLI_RPC_URL;

    default:
      throw new Error("invalid network");
  }
};

export async function getPaymasterCustomOverrides(options: {
  network: Network;
  overrides?: any;
  feeToken?: string;
  isGaslessFlow?: boolean;
}): Promise<any> {
  const { overrides = {}, feeToken, isGaslessFlow, network } = options;

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
      feeToken !== zksync.utils.ETH_ADDRESS &&
      feeToken !== zksync.utils.L2_ETH_TOKEN_ADDRESS
    ) {
      console.log("[TevaPaymaster] Approval based flow");

      // add paymaster approval based params
      paymasterParams = zksync.utils.getPaymasterParams(
        tevaPayMasterContractAddress,
        {
          type: "ApprovalBased",
          token: feeToken,
          // set minimalAllowance as we defined in the paymaster contract
          minimalAllowance: ethers.BigNumber.from(1),
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
