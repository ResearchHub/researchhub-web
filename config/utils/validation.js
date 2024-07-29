import { keccak256, sha3_256 } from "js-sha3";
import { getNestedValue } from "./misc";
import { getCurrentUserReputation } from "./reputation";

export const isValidEmail = (email) => {
  // https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const isCommonEmailExt = (email) => {
  const commonEmailExtensions = [
    "@gmail.com",
    "@yahoo.com",
    "@hotmail.com",
    "@aol.com",
    "@outlook.com",
    "@live.com",
    "@msn.com",
    "@icloud.com",
    "@mail.com",
    "@yandex.com",
    "@protonmail.com",
    "@zoho.com",
    "@gmx.com",
    "@fastmail.com",
    "@inbox.com",
    "@hushmail.com",
    "@tutanota.com",
    "@rediffmail.com",
    "@lycos.com",
    "@excite.com",
    "@lavabit.com",
    "@web.de",
    "@naver.com",
    "@qq.com",
    "@sina.com",
    "@163.com",
    "@baidu.com",
    "@cox.net",
    "@optonline.net",
    "@comcast.net",
    "@btinternet.com",
    "@virginmedia.com",
    "@orange.fr",
    "@gmx.de",
    "@webmail.co.za",
    "@mail.ru",
    "@rambler.ru",
    "@yandex.ru",
    "@hotmail.co.uk",
    "@hotmail.fr",
    "@yahoo.co.jp",
    "@yahoo.co.in",
    "@yahoo.co.uk",
    "@seznam.cz",
    "@me.com",
    "@sbcglobal.net",
    "@earthlink.net",
  ];

  // Extract the domain from the email
  const domain = email.substring(email.lastIndexOf("@"));

  // Check if the domain is in the list of common email extensions
  return commonEmailExtensions.some((ext) => domain.indexOf(ext) > -1);
};

export function currentUserHasMinimumReputation(stateObject, minimum) {
  let reputation = getCurrentUserReputation(stateObject);
  return reputation >= minimum;
}

export const checkVoteTypeChanged = (prev, next) => {
  const prevVoteType = getNestedValue(prev, ["userVote", "voteType"]);
  const nextVoteType = getNestedValue(next, ["userVote", "voteType"]);
  if (prevVoteType !== nextVoteType) {
    return nextVoteType;
  }
};

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

export function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}
