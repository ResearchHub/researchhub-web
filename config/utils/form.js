import numeral from "numeral";

const onKeyDownNumInput = (e) => {
  if (e && e.key === ".") {
    e.preventDefault();
  }
};

const sanitizeNumber = (number) => {
  return number.replace(/[^0-9]*/g, "");
};

const onPasteNumInput = (e) => {
  const pasteData = e.clipboardData.getData("text");

  if (pasteData) {
    return pasteData.replace(/[^0-9]*/g, "");
  }
};

const formatScore = (score = 0) => {
  return numeral(score).format("0a");
};

const formatBalance = (balance = 0) => {
  return numeral(balance).format("0,0");
};

const formatBalanceWithDecimals = (balance = 0) => {
  return numeral(balance).format("0,0.00");
};

export {
  onKeyDownNumInput,
  onPasteNumInput,
  sanitizeNumber,
  formatScore,
  formatBalance,
  formatBalanceWithDecimals,
};
