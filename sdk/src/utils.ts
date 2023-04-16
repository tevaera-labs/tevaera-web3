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
  "0x9825Ca0644BD228955311C46d9A7b181328a330e";
export const KARMA_POINT_CONTRACT_ADDRESS =
  "0x8634EE05c00CD6FA014a266C7d00E6cA1B328869";
export const CLAIM_CONTRACT_ADDRESS =
  "0x9698025A5667A3CD8F36b396A22D4Ea192705602";
export const REFORMIST_SPHINX_CONTRACT_ADDRESS =
  "0x4C028933d301Ab51F150E2C6f58bdda8cf3152AB";

export const GetZkSyncChainId = (network: Network) => {
  switch (network) {
    case Network.Goerli:
      return ZKSYNC_TST_CHAIN_ID;
    case Network.Mainnet:
      throw ZKSYNC_PRD_CHAIN_ID;

    default:
      throw new Error("invalid network");
  }
};

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

export const GetZkSyncRpcUrl = (network: Network) => {
  switch (network) {
    case Network.Goerli:
      return ZKSYNC_TST_RPC_URL;
    case Network.Mainnet:
      throw ZKSYNC_PRD_RPC_URL;

    default:
      throw new Error("invalid network");
  }
};
