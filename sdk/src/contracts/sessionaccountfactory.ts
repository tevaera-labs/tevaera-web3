/* import dependencies */
import * as zksync from "zksync-ethers";
import { AbiCoder, ContractRunner, Signer, hexlify } from "ethers";
import { randomBytes } from "crypto";

import { getContractAddresses, getRpcProvider } from "../utils";
import { Network } from "../types";

export class SessionAccountFactory {
  readonly network: Network;
  readonly sessionAccountFactory: zksync.Contract;
  readonly contractRunner?: ContractRunner;

  constructor(options: {
    network: Network;
    contractRunner?: ContractRunner;
    privateKey?: string;
    customRpcUrl?: string;
  }) {
    const { contractRunner, network, privateKey, customRpcUrl } = options;
    if (!network) throw new Error("network is reuired.");

    const { sessionAccountFactoryAddress } = getContractAddresses(network);
    if (!sessionAccountFactoryAddress)
      throw new Error("Session account factory not found!");

    if (contractRunner) {
      this.sessionAccountFactory = new zksync.Contract(
        sessionAccountFactoryAddress,
        require("../abi/SessionAccountFactory.json").abi,
        contractRunner
      );

      this.contractRunner = contractRunner;
    } else {
      const rpcProvider = getRpcProvider(network, customRpcUrl);

      let wallet;
      if (privateKey)
        wallet = new zksync.Wallet(privateKey, rpcProvider as zksync.Provider);

      this.sessionAccountFactory = new zksync.Contract(
        sessionAccountFactoryAddress,
        require("../abi/SessionAccountFactory.json").abi,
        wallet || rpcProvider
      );

      this.contractRunner = wallet || rpcProvider;
    }

    this.network = network;
  }

  async createSession(
    sessionAccount: string,
    duration?: number
  ): Promise<unknown> {
    const secondsUntilEndTime = duration || 7200; // default to 2 hours

    // create an instance of session account
    const account = new zksync.Contract(
      sessionAccount,
      require("../abi/SessionAccount.json").abi,
      this.contractRunner
    );

    // get trusted teva signer
    const { tevaTrustedSignerAddress } = getContractAddresses(this.network);

    const tx = await account.createSession(
      tevaTrustedSignerAddress,
      secondsUntilEndTime
    );

    return tx;
  }

  async createSessionAccount(): Promise<string> {
    const ownerAddress = await (this.contractRunner as Signer).getAddress();
    // generate random salt to make sure unique address is returned
    const randomBytesLength = 32; // for a 256-bit value, change this to your desired length
    const randomByte = randomBytes(randomBytesLength);
    const randomDeploymentSalt = hexlify(randomByte);

    // deploy the session account
    const tx = await this.sessionAccountFactory.deployAccount(
      randomDeploymentSalt,
      ownerAddress
    );
    await tx.wait();

    // generate session account addressF
    const abiCoder = new AbiCoder();
    const sessionAccountAddress = zksync.utils.create2Address(
      await this.sessionAccountFactory.getAddress(),
      await this.sessionAccountFactory.aaBytecodeHash(),
      randomDeploymentSalt,
      abiCoder.encode(["address"], [ownerAddress])
    );

    // return the session account address
    return sessionAccountAddress;
  }

  async deleteSession(sessionAccount: string): Promise<unknown> {
    // create an instance of session account
    const account = new zksync.Contract(
      sessionAccount,
      require("../abi/SessionAccount.json").abi,
      this.contractRunner
    );

    // get trusted teva signer
    const { tevaTrustedSignerAddress } = getContractAddresses(this.network);

    const tx = await account.deleteSession(tevaTrustedSignerAddress);

    return tx;
  }

  async getActiveSession(sessionAccount: string): Promise<unknown> {
    // create an instance of session account
    const account = new zksync.Contract(
      sessionAccount,
      require("../abi/SessionAccount.json").abi,
      this.contractRunner
    );

    // get trusted teva signer
    const { tevaTrustedSignerAddress } = getContractAddresses(this.network);

    const session = await account.sessions(tevaTrustedSignerAddress);
    const { expirationTime } = session || {};

    const currentTimestampInSeconds = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds

    if (expirationTime > currentTimestampInSeconds) {
      return expirationTime;
    } else {
      return undefined;
    }
  }

  async getSessionAccount(sessionAccount: string): Promise<unknown> {
    // create an instance of session account
    const account = new zksync.Contract(
      sessionAccount,
      require("../abi/SessionAccount.json").abi,
      this.contractRunner
    );

    return account;
  }
}
