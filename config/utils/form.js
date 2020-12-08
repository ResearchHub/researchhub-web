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

export { onKeyDownNumInput, onPasteNumInput, sanitizeNumber };
