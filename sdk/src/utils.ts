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

export const BASE_RPC_URL = "https://mainnet.base.org";
export const BASE_GOERLI_RPC_URL = "https://goerli.base.org";

export const SCROLL_RPC_URL = "https://rpc.scroll.io";
export const SCROLL_SEPOLIA_RPC_URL = "	https://sepolia-rpc.scroll.io";

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
          "0xe78616f6CF87ffc3F33741BB731016A897f0cA88",
        tevaTrustedSignerAddress: "0x1b9eBb8F3c335dA62235Fe783cF5663979Eb7B04"
      };
    case Network.ZksyncEraGoerli:
      return {
        citizenIdContractAddress: "0x178f6217C51B797cA9aB04FC2cE68775C032678e",
        karmaPointContractAddress: "0x611B67222df44A28B5438ff39FE8b4bE25bE6Ad2",
        claimContractAddress: "0x3F248D326d8eF82f88865afe2cbf5277a073a880",
        reformistSphinxContractAddress:
          "0x77371Ab0e5695B2203c4072807637290241e4dB7",
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
          "0x6C8e495f245feA71b8d15f6A6d217Bd930D5BA37",
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
          "0x2a7ffFAC2D1f42a9dde8Da3D93e6f5Dc60F21f8C",
        influentialWerewolfContractAddress:
          "0xE6f256d2C346B4a1420304EC34E93905d6C4c064",
        innovativeUnicornContractAddress:
          "0x8b07eFc6b2b052FAc1A1dCbf70be03a460bCc975",
        simplifierKrakenContractAddress:
          "0x927Ff9D72237B5aAc8123EFFc4D071104C9ab88B",
        balancerDragonContractAddress:
          "0xBF00f9510C6224f9C097F352DBa61076f9b6251f"
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
          "0xe074Da15A835eF5c6A51691A88386d2e03098e55",
        influentialWerewolfContractAddress:
          "0xc290215fD158B5d52679DA370c18703Eb37903C3",
        innovativeUnicornContractAddress:
          "0xb71e408766294dEAd1ffD905290931cD09bF24f0",
        simplifierKrakenContractAddress:
          "0x9a9E5013E8ba662E62d4D85c6401aEa7a17D676E",
        balancerDragonContractAddress:
          "0xfA05884C675f1d79302F62071EbEA32158744908"
      };
    case Network.Base:
      return {
        nomadicYetiContractAddress:
          "0x8cFD35c04F44D33501d2590ab4FCB45009a1297B",
        influentialWerewolfContractAddress:
          "0x60E880FAa2987f7426aD51E097c08D3266801f52",
        innovativeUnicornContractAddress:
          "0x8F657B0902eDD9Fb10e7CdDaa8cFB4228942C788",
        simplifierKrakenContractAddress:
          "0xC9F831D329515903CE78e03c6bB7eFB29d645596",
        balancerDragonContractAddress:
          "0x6e4bbF3f5e2B33f14FcF40d838e8a0391A32fdD4"
      };
    case Network.BaseGoerli:
      return {
        nomadicYetiContractAddress:
          "0x06C2d045cf7327Ee9462D7bCF6e19C444C30e8B1",
        influentialWerewolfContractAddress:
          "0xebD6f3CF2a13139780Ee55B22bCf8F99559F64ea",
        innovativeUnicornContractAddress:
          "0x2d837B1892CE7a61af6DE4d58899762CdF4417Eb",
        simplifierKrakenContractAddress:
          "0xf396D14A28A9Bb614B8e7C17D87a8165Bb481712",
        balancerDragonContractAddress:
          "0x06738a1919429FD542C52C7BE821Da93811221EB"
      };
    case Network.Scroll:
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
    case Network.ScrollSepolia:
      return {
        nomadicYetiContractAddress:
          "0x1b5bAeC0B39A946c61BeF6Ce59bd7A3B16a6984f",
        influentialWerewolfContractAddress:
          "0x4F256A971bB10bec6Fef854C4b5D0D3c6C154734",
        innovativeUnicornContractAddress:
          "0xDe5E097d679543f97f972c168f30b910ee2a965a",
        simplifierKrakenContractAddress:
          "0xDaad9f1c847dEdd1B54C037Ed5F63FD392c68cd0",
        balancerDragonContractAddress:
          "0x1620e83cB3EB06113db06A5583249a388925c01C"
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
    case Network.Base:
      return 184;
    case Network.BaseGoerli:
      return 10160;
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
      return new zksync.Provider(rpcUrl);
    case Network.ArbitrumOne:
    case Network.ArbitrumGoerli:
    case Network.Linea:
    case Network.LineaGoerli:
    case Network.Base:
    case Network.BaseGoerli:
    case Network.Scroll:
    case Network.ScrollSepolia:
      return new ethers.providers.JsonRpcProvider(rpcUrl);

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
    case Network.ArbitrumOne:
      return ARBITRUM_ONE_RPC_URL;
    case Network.ArbitrumGoerli:
      return ARBITRUM_GOERLI_RPC_URL;
    case Network.Linea:
      return LINEA_RPC_URL;
    case Network.LineaGoerli:
      return LINEA_GOERLI_RPC_URL;
    case Network.Base:
      return BASE_RPC_URL;
    case Network.BaseGoerli:
      return BASE_GOERLI_RPC_URL;
    case Network.Scroll:
      return SCROLL_RPC_URL;
    case Network.ScrollSepolia:
      return SCROLL_SEPOLIA_RPC_URL;

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
