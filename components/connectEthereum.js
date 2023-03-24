export async function disconnect(provider) {
  provider.disconnect();
}

async function getEthAccounts(eth) {
  const accounts = await eth.enable();
  return accounts;
}
