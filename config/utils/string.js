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

export function truncateText(str, limit = 90) {
  if (str && str.length >= limit) {
    return str.slice(0, limit).trim() + "...";
  }
  return str;
}

export const isString = (str) => {
  return typeof str === "string";
};

export const stripHTML = (str) => {
  return (str || "").replace(/<[^>]*>?/gm, "");
};
