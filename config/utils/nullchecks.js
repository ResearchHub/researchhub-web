export function emptyFncWithMsg(message) {
  if (message == null) {
    console.warn("emptyFncWithMsg is used. this maybe a bug");
  } else {
    console.warn(message);
  }
}

export function isUndefined(given) {
  return given === "undefined" || typeof given === "undefined" || given == null;
}

export function nullToEmptyString(given) {
  return given || "";
}

export function silentEmptyFnc() {}
