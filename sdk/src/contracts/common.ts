import { ethers } from "ethers";
import * as zksync from "zksync-web3";

import { ERC20 } from "./erc20";
import { GetContractAddresses } from "../utils";
import { Network } from "../types";

// get customdata for paymaster flow
export async function getPaymasterCustomOverrides(options: {
  web3Provider: zksync.Web3Provider | ethers.providers.Web3Provider;
  network: Network;
  overrides?: any;
  feeToken?: string;
  isGaslessFlow?: boolean;
}): Promise<any> {
  const {
    web3Provider,
    overrides = {},
    feeToken,
    isGaslessFlow,
    network
  } = options;

  // Let the paymaster flow; don't break anything. Instead, allow the user to pay in ETH and continue.
  try {
    // get teva paymaster address
    const { tevaPayMasterContractAddress } = GetContractAddresses(network);
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
      // create erc20 contract instance
      const erc20 = new ERC20({
        web3Provider,
        network,
        erc20ContractAddress: feeToken
      });
      // get erc20 currency metadata
      const erc20Decimals = await erc20.GetDecimals();
      const erc20Name = await erc20.GetName();
      const isBtc = erc20Name.toLowerCase().indexOf("btc") > -1;

      // get value equivalent to $5
      const value = isBtc
        ? ethers.utils.parseUnits("0.0002", erc20Decimals) // 0.0002 btc ~ 5 USD
        : ethers.utils.parseUnits("5", erc20Decimals); // 5 dai/usdc/usdt ~ 5 USD
      const owner = await web3Provider.getSigner().getAddress();
      const spender = tevaPayMasterContractAddress;

      // check min allowance
      const allowance = await erc20.GetAllowance(owner, spender);
      const numAllowance = ethers.utils.parseUnits(allowance, erc20Decimals);
      if (numAllowance.lt(value)) {
        // approve overrides the previous allowance, set it to the minimum required for this tx
        await erc20.SetAllowance(spender, allowance);
      }

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
