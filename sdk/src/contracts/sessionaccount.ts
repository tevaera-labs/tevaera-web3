/* import dependencies */
import * as zksync from "zksync-web3";
import { ethers } from "ethers";

import { getContractAddresses, getRpcProvider } from "../utils";
import { Network } from "../types";

export class SessionAccount {
  readonly network: Network;
  readonly sessionAccountFactory: ethers.Contract;
  readonly signerOrWallet: any;

  constructor(options: {
    web3Provider?: zksync.Web3Provider | ethers.providers.Web3Provider;
    network: Network;
    privateKey?: string;
  }) {
    const { web3Provider, network, privateKey } = options;
    if (!network) throw new Error("network is reuired.");

    const { sessionAccountFactoryAddress } = getContractAddresses(network);
    if (!sessionAccountFactoryAddress)
      throw new Error("Session account factory not found!");

    if (web3Provider) {
      this.sessionAccountFactory = new ethers.Contract(
        sessionAccountFactoryAddress,
        require("../abi/SessionAccountFactory.json").abi,
        web3Provider.getSigner() || web3Provider
      );

      this.signerOrWallet = web3Provider.getSigner() || web3Provider;
    } else {
      const rpcProvider = getRpcProvider(network);

      let wallet;
      if (privateKey) wallet = new ethers.Wallet(privateKey, rpcProvider);

      this.sessionAccountFactory = new ethers.Contract(
        sessionAccountFactoryAddress,
        require("../abi/SessionAccountFactory.json").abi,
        wallet || rpcProvider
      );

      this.signerOrWallet = wallet || rpcProvider;
    }

    this.network = network;
  }

  async createSession(
    sessionAccount: string,
    trustedAddresses: string[],
    duration?: number
  ): Promise<unknown> {
    const secondsUntilEndTime = duration || 7200; // default to 2 hours

    // create an instance of session account
    const account = new ethers.Contract(
      sessionAccount,
      require("../abi/SessionAccount.json").abi,
      this.signerOrWallet
    );

    // get trusted teva signer
    const { tevaTrustedSignerAddress } = getContractAddresses(this.network);

    const tx = await account.createSession(
      tevaTrustedSignerAddress,
      secondsUntilEndTime,
      trustedAddresses
    );

    return tx;
  }

  async createSessionAccount(): Promise<string> {
    const ownerAddress = this.sessionAccountFactory.signer.getAddress();
    // generate random salt to make sure unique address is returned
    const randomBytesLength = 32; // for a 256-bit value, change this to your desired length
    const randomBytes = ethers.utils.randomBytes(randomBytesLength);
    const randomDeploymentSalt = ethers.utils.hexlify(randomBytes);

    // deploy the session account
    const tx = await this.sessionAccountFactory.deployAccount(
      randomDeploymentSalt,
      this.sessionAccountFactory.signer.getAddress()
    );
    await tx.wait();

    // generate session account addressF
    const abiCoder = new ethers.utils.AbiCoder();
    const sessionAccountAddress = zksync.utils.create2Address(
      this.sessionAccountFactory.address,
      await this.sessionAccountFactory.aaBytecodeHash(),
      randomDeploymentSalt,
      abiCoder.encode(["address"], [ownerAddress])
    );

    // return the session account address
    return sessionAccountAddress;
  }
}
