import { Provider } from "zksync-web3";
import { Network } from "./types";

// zksync rpc urls
export const ZKSYNC_PRD_RPC_URL = "https://mainnet.era.zksync.io";
export const ZKSYNC_TST_RPC_URL = "https://zksync2-testnet.zksync.dev";

// zksync chain ids
export const ZKSYNC_PRD_CHAIN_ID = 324;
export const ZKSYNC_TST_CHAIN_ID = 280;

// tevaera contracts
export const GetContractAddresses = (network: Network) => {
  switch (network) {
    case Network.Goerli:
      return {
        citizenIdContractAddress: "0x52f6C2822e68FC05E565AD13F596d8dBc40166f9",
        karmaPointContractAddress: "0xD9471ac50B1015275911C9fDfD2Ba734374415b1",
        claimContractAddress: "0x3F248D326d8eF82f88865afe2cbf5277a073a880",
        reformistSphinxContractAddress:
          "0x6fAa4B4b6b0745CFe7405eE04Ca8D28DA67779A7",
      };
    case Network.Mainnet:
      return {
        citizenIdContractAddress: "0xd29Aa7bdD3cbb32557973daD995A3219D307721f",
        karmaPointContractAddress: "0x9Fc20170d613766831F164f1831F4607Ae54ff2D",
        claimContractAddress: "0x1EB7bcab5EdF75b5E02c9A72D3287E322EbaEfdB",
        reformistSphinxContractAddress:
          "0x50B2b7092bCC15fbB8ac74fE9796Cf24602897Ad",
      };

    default:
      throw new Error("invalid network");
  }
};

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
