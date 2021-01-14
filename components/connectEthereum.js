import { ethers } from "ethers";
// import WalletLink from "walletlink";

import { WEB3_INFURA_PROJECT_ID } from "../config/constants";

const APP_NAME = "ResearchHub";
const APP_LOGO_URL = "";
const ETH_JSONRPC_URL = `https://mainnet.infura.io/v3/${WEB3_INFURA_PROJECT_ID}`;
const RINKEBY_ETH_JSONRPC_URL = `https://rinkeby.infura.io/v3/${WEB3_INFURA_PROJECT_ID}`;
const CHAIN_ID = 1;
const RINKEBY_CHAIN_ID = 4;

export async function useMetaMask() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(0);
    const accounts = await getEthAccounts(window.ethereum);
    const account = accounts[0];
    return { connected: true, provider, signer, account };
  }
  return { connected: false, provider: null, signer: null, account: "" };
}

// export async function useWalletLink(testnet = false) {
//   const walletLink = new WalletLink({
//     appName: APP_NAME,
//     appLogoUrl: APP_LOGO_URL,
//     darkMode: false,
//   });

//   let jsonRpcUrl = RINKEBY_ETH_JSONRPC_URL;
//   let networkVersion = RINKEBY_CHAIN_ID;
//   if (!testnet) {
//     jsonRpcUrl = ETH_JSONRPC_URL;
//     networkVersion = CHAIN_ID;
//   }

//   const ethInstance = walletLink.makeWeb3Provider(jsonRpcUrl, networkVersion);
//   const provider = new ethers.providers.Web3Provider(ethInstance);
//   const accounts = await ethInstance.send("eth_requestAccounts");
//   const account = accounts[0];
//   const signer = provider.getSigner(0);

//   return {
//     connected: true,
//     provider,
//     signer,
//     account,
//     walletLink,
//     ethInstance,
//   };
// }

export async function disconnect(provider) {
  provider.disconnect();
}

async function getEthAccounts(eth) {
  const accounts = await eth.enable();
  return accounts;
}
