import { Provider } from "zksync-web3";
import { Network } from "./types";

// zksync rpc urls
export const ZKSYNC_PRD_RPC_URL = "https://zksync2-mainnet.zksync.io";
export const ZKSYNC_TST_RPC_URL = "https://zksync2-testnet.zksync.dev";

// zksync chain ids
export const ZKSYNC_PRD_CHAIN_ID = 324;
export const ZKSYNC_TST_CHAIN_ID = 280;

// tevaera contracts
export const CITIZEN_ID_CONTRACT_ADDRESS =
  "0x68172f20b3ec8305C4474BCBa1f9b7Bff461dFA8";
export const KARMA_POINT_CONTRACT_ADDRESS =
  "0xBee8e2e60c46E0db2Fe8cD222A8517C19fC59240";
export const CLAIM_CONTRACT_ADDRESS =
  "0xFf81408716f3964652052aa3bD87D804965Ae172";
export const REFORMIST_SPHINX_CONTRACT_ADDRESS =
  "0xa245eCC627599c7FA42c27dD760263eF24116D09";
export const MAGICAL_PHOENIX_CONTRACT_ADDRESS =
  "0x6e690A628fb5c1ccC81B4E9094965211ee9e9100";
export const NOMADIC_YETI_CONTRACT_ADDRESS =
  "0x2Bc5ed7BE4bb3B41e207a772b45cA45152F861b0";

export const GetZkSyncProvider = (network: Network) => {
  switch (network) {
    case Network.Goerli:
      return new Provider(ZKSYNC_TST_RPC_URL);
    case Network.Mainnet:
      throw new Provider(ZKSYNC_PRD_RPC_URL);

    default:
      throw new Error("invalid network");
  }
};
