import { Provider } from "zksync-web3";
import { Network } from "./types";

// zksync rpc urls
export const ZKSYNC_PRD_RPC_URL = "<not_set>";
export const ZKSYNC_TST_RPC_URL = "https://zksync2-testnet.zksync.dev";

// zksync chain ids
export const ZKSYNC_PRD_CHAIN_ID = "<not_set>";
export const ZKSYNC_TST_CHAIN_ID = 280;

// tevaera contracts
export const CITIZEN_ID_CONTRACT_ADDRESS =
  "0x2313390A3F0d5A85Ee46cB87dd9c45A8464b4a66";
export const CLAIM_CONTRACT_ADDRESS =
  "0xFf81408716f3964652052aa3bD87D804965Ae172";
export const GUARDIANS_CONTRACT_ADDRESS =
  "0x157C18EecDCc161A52bA85F5c50aC5D043fdB45E";
export const KARMA_POINT_CONTRACT_ADDRESS =
  "0x8F10F0712c9d40c8C40cB57c75aD71C4C812b7F3";

export const GetZkSyncProvider = (network: Network) => {
  switch (network) {
    case Network.Goerli:
      return new Provider(ZKSYNC_TST_RPC_URL);
    case Network.Mainnet:
      throw new Error("not implemented");

    default:
      throw new Error("invalid network");
  }
};
