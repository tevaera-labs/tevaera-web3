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
  "0xbc1080d0244D9f937ab7932E9ddf9099d0C0EE78";
export const KARMA_POINT_CONTRACT_ADDRESS =
  "0x75CBc93876Bae9D1A4675EBd3147ec3e721da585";
export const CLAIM_CONTRACT_ADDRESS =
  "0xfF1c3D9BbC7203B4C72247a7d606F89404D8324a";
export const REFORMIST_SPHINX_CONTRACT_ADDRESS =
  "0xB8Ac06Cd6C874C52D8013FC175d83e9Ac9Aa1063";
export const MAGICAL_PHOENIX_CONTRACT_ADDRESS =
  "0x8f2f53830A9edBadB808616073B5503b65875Ba4";
export const NOMADIC_YETI_CONTRACT_ADDRESS =
  "0xEf83f6DA317b771eCb5ae9B4147A21A69b7D6b4E";

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
