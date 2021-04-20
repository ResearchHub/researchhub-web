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

export function nullthrows<T>(
  given: T,
  msg: null | string | undefined = null
): NonNullable<T> {
  if (given == null || given == undefined || typeof given === "undefined") {
    throw new Error(msg != null ? `nullthrows: ${msg}` : "nullthrows");
  }
  return given!;
}
