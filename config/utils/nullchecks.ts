export function emptyFncWithMsg(
  message: Error | string | null | undefined
): void {
  if (message == null) {
    console.warn("emptyFncWithMsg is used. this maybe a bug");
  } else {
    console.warn(message);
  }
}

export function isUndefined(given: any): boolean {
  return given === "undefined" || typeof given === "undefined" || given == null;
}

export function nullToEmptyString(given: string | null | undefined): string {
  return given || "";
}

export function silentEmptyFnc(): void {}

export function nullthrows<T>(
  given: T,
  msg: null | string | undefined = null
): NonNullable<T> {
  if (given == null || given == undefined || typeof given === "undefined") {
    throw new Error(msg != null ? `nullthrows: ${msg}` : "nullthrows");
  }
  return given!;
}
