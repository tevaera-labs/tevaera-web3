/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { getContractAddresses, getRpcProvider } from "../utils";
import { Network } from "../types";

export class Claim {
  readonly contract: ethers.Contract;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;
    if (!network) throw new Error("network is reuired.");
    const { claimContractAddress } = getContractAddresses(network);

    if (!claimContractAddress) throw new Error("Contract not found!");

    if (web3Provider) {
      this.contract = new ethers.Contract(
        claimContractAddress,
        require("../abi/Claim.json").abi,
        web3Provider.getSigner()
      );
    } else {
      if (!privateKey) throw new Error("private key is reuired.");

      const rpcProvider = getRpcProvider(network);
      const wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.contract = new ethers.Contract(
        claimContractAddress,
        require("../abi/Claim.json").abi,
        wallet
      );
    }
  }

  async claim(citizenIdPrice: number): Promise<unknown> {
    const claimTx = await this.contract.claim({
      value: citizenIdPrice
    });
    await claimTx.wait();

    return claimTx;
  }
}
