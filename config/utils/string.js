export function capitalize(str) {
  return str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
}

export function toTitleCase(str) {
  if (typeof str === "string") {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
  return str;
}

export function removeLineBreaksInStr(str) {
  return str.replace(/\r?\n |\r/g, "");
}

export function truncateText(str) {
  if (str && str.length >= 90) {
    return str.slice(0, 90).trim() + "...";
  }
  return str;
}
