# JavaScript SDK for tevaera-web3

An npm package to intract with smart contracts created by Tevaera Labs on ethereum network. It can be used in browser applications.

## Getting started

`npm install @tevaeralabs/tevaera-web3`

After installing the app, you can then import and use the SDK:

### Create instance of the contract using web3 provider

```javascript
import { CitizenId } from "@tevaeralabs/tevaera-web3";

// get the web3 provider
const provider = new zksync.Web3Provider(window.ethereum);

// create the instance of citizen id contract
const citizenIdContract = new CitizenId({ web3Provider: provider });
```

### Create instance of the contract using wallet private key

```javascript
import { CitizenId } from "@tevaeralabs/tevaera-web3";
import { types } from "@tevaeralabs/tevaera-web3";

// create the instance of citizen id contract
const citizenIdContract = new CitizenId({
  network: types.Network.Sepolia,
  privateKey: "<wallet_private_key>",
});
```

### Complete example

```javascript
import { CitizenId, KarmaPoint } from "@tevaeralabs/tevaera-web3";

// get the web3 provider
const provider = new zksync.Web3Provider(window.ethereum);

//// get citizen id by wallet
// create the instance of citizen id contract
const citizenIdContract = new CitizenId({ web3Provider: provider });

// get token id (nft id) by wallet address
const tokenId = citizenIdContract.GetCitizenID("<wallet_address>");

//// get karma point balance by wallet
// create the instance of karma point contract
const karmaPointContract = new KarmaPoint({ web3Provider: provider });

// get karma point balance by wallet address
const kpBalance = karmaPointContract.GetKpBalance("<wallet_address>");
// get karma point price by kp amount
const kpBalance = karmaPointContract.GetKpPrice("<no_of_kp>");
// buy karma point
const kpBalance = karmaPointContract.BuyKarmaPoints("<no_of_kp>");
// withdraw karma point
const kpBalance = karmaPointContract.WithdrawKarmaPoints("<no_of_kp>");
```

## Using the Tevaera Web3 SDK

The Tevaera Web3 SDK currently supports four different namespaces, including:

- CitizenId: All citizen methods
- Claim: All claim methods
- Guardians: All guardian methods
- KarmaPoint: All karma point methods

Below is the list of methods supported by all classes:

- CitizenId

  - GetCitizenID
  - MintCitizenID

- KarmaPoint

  - BuyKarmaPoints
  - GetBoughtKarmaPoints
  - GetKpBalance
  - GetKpBuyCap
  - GetKpBuyingCap
  - GetKpPrice
  - WithdrawKarmaPoints

- Claim

  - Claim

- ReformistSphinx

  - GetReformistSphinxByWallet
  - MintReformistSphinx
