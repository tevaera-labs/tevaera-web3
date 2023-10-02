import { ethers } from "ethers";
import * as zksync from "zksync-web3";

import { Network } from "./types";

// rpc urls
export const ZKSYNC_ERA_RPC_URL = "https://mainnet.era.zksync.io";
export const ZKSYNC_ERA_GOERLI_RPC_URL = "https://zksync2-testnet.zksync.dev";

export const ARBITRUM_ONE_RPC_URL = "https://arb1.arbitrum.io/rpc";
export const ARBITRUM_GOERLI_RPC_URL = "https://goerli-rollup.arbitrum.io/rpc";

export const LINEA_RPC_URL = "https://rpc.linea.build";
export const LINEA_GOERLI_RPC_URL = "https://rpc.goerli.linea.build";

// tevaera contracts
export const getContractAddresses = (network: Network) => {
  switch (network) {
    case Network.ZksyncEra:
      return {
        citizenIdContractAddress: "0xd29Aa7bdD3cbb32557973daD995A3219D307721f",
        karmaPointContractAddress: "0x9Fc20170d613766831F164f1831F4607Ae54ff2D",
        claimContractAddress: "0x1EB7bcab5EdF75b5E02c9A72D3287E322EbaEfdB",
        reformistSphinxContractAddress:
          "0x50B2b7092bCC15fbB8ac74fE9796Cf24602897Ad",
        magicalPhoenixContractAddress:
          "0x0969529a8ea41b47009eb2a590fe71d7942e4f5a",
        nomadicYetiContractAddress:
          "0x955AE6B7005eFA49F23cCFcb385cdcf542C06276",
        influentialWerewolfContractAddress:
          "0x5060f2F97E7053D1147583B71d190E1A420C42fd",
        innovativeUnicornContractAddress:
          "0xcAF741840240E6aB1a010D13368C2d15774487D3",
        simplifierKrakenContractAddress:
          "0x44DB5de936f2254fB2988e419D01E9A83DbbAbd2",
        balancerDragonContractAddress:
          "0x17D9B864AF82c6B83fa6330D65BFE61f3e944Fff",
        guardianBundlerContractAddress:
          "0x5dE117628B5062F56f37d8fB6603524C7189D892",
        tevaPayMasterContractAddress:
          "0x66ea743B004992f97a2e9fc187A607077f21781C",
        multicallContractAddress: "0xA81898C1BC737bfce6955aad572e7658f1be521e",
        sessionAccountFactoryAddress:
          "0x4a3F7085f275089e51399DC6685B7855Ce97C1Be",
        tevaTrustedSignerAddress: "0x1b9eBb8F3c335dA62235Fe783cF5663979Eb7B04"
      };
    case Network.ZksyncEraGoerli:
      return {
        citizenIdContractAddress: "0x178f6217C51B797cA9aB04FC2cE68775C032678e",
        karmaPointContractAddress: "0x611B67222df44A28B5438ff39FE8b4bE25bE6Ad2",
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
          "0x5b9F16cFAF2a3F021ff6B9aD6794FCC3fDB4FeEe",
        multicallContractAddress: "0xDC3FBA29a533c484069d12E4e6061A7C9f41d841",
        sessionAccountFactoryAddress:
          "0xC91Fad1D213675aa470E1Cc87F2BE9b629044e61",
        tevaTrustedSignerAddress: "0x9910FB35F401eFa865852b53285e678E21753e5e"
      };
    case Network.ArbitrumOne:
      return {
        nomadicYetiContractAddress:
          "0x8cFD35c04F44D33501d2590ab4FCB45009a1297B",
        influentialWerewolfContractAddress:
          "0x8F657B0902eDD9Fb10e7CdDaa8cFB4228942C788",
        innovativeUnicornContractAddress:
          "0x60E880FAa2987f7426aD51E097c08D3266801f52",
        simplifierKrakenContractAddress:
          "0xC9F831D329515903CE78e03c6bB7eFB29d645596",
        balancerDragonContractAddress:
          "0x6e4bbF3f5e2B33f14FcF40d838e8a0391A32fdD4"
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
    case Network.Linea:
      return {
        nomadicYetiContractAddress:
          "0x8cFD35c04F44D33501d2590ab4FCB45009a1297B",
        influentialWerewolfContractAddress:
          "0x8F657B0902eDD9Fb10e7CdDaa8cFB4228942C788",
        innovativeUnicornContractAddress:
          "0x60E880FAa2987f7426aD51E097c08D3266801f52",
        simplifierKrakenContractAddress:
          "0xC9F831D329515903CE78e03c6bB7eFB29d645596",
        balancerDragonContractAddress:
          "0x6e4bbF3f5e2B33f14FcF40d838e8a0391A32fdD4"
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
