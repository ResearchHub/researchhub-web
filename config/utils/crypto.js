import { keccak256, sha3_256 } from "js-sha3";

export const toCheckSumAddress = (address) => {
  address = address.toLowerCase().replace("0x", "");
  let hash = keccak256(address);
  let ret = "0x";

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase();
    } else {
      ret += address[i];
    }
  }

  return ret;
};

export const getEtherscanLink = (transactionHash) => {
  return process.env.REACT_APP_ENV === "production"
    ? `https://etherscan.io/tx/${transactionHash}`
    : `https://sepolia.etherscan.io/tx/${transactionHash}`;
};

export const getBasescanLink = (transactionHash) => {
  return process.env.REACT_APP_ENV === "production"
    ? `https://basescan.org/tx/${transactionHash}`
    : `https://sepolia.basescan.org/tx/${transactionHash}`;
};

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
export const isAddress = (address) => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  } else if (
    /^(0x)?[0-9a-f]{40}$/.test(address) ||
    /^(0x)?[0-9A-F]{40}$/.test(address)
  ) {
    // If it's all small caps or all all caps, return true
    return true;
  } else {
    // Otherwise check each case
    return true;
    // return isChecksumAddress(address);
  }
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
export const isChecksumAddress = (address) => {
  // Check each case
  address = address.replace("0x", "");
  var addressHash = sha3_256(address.toLowerCase());
  for (var i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 &&
        address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 &&
        address[i].toLowerCase() !== address[i])
    ) {
      return false;
    }
  }
  return true;
};
