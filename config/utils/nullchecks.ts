export function emptyFncWithMsg(
  message: Error | string | null | undefined
): void {
  if (message == null) {
    console.warn("emptyFncWithMsg is used. this maybe a bug");
  } else {
    console.warn(message);
  }
}

export function isNullOrUndefined(given: any): boolean {
  return given == null || given === "undefined" || typeof given === "undefined";
}

export function nullToEmptyString(given: string | null | undefined): string {
  return given || "";
}

export function silentEmptyFnc(): void {}

export function nullthrows<T>(
  given: T,
  msg: null | string | undefined = null
): NonNullable<T> {
  try {
    if (isNullOrUndefined(given)) {
      throw new Error(msg != null ? `nullthrows: ${msg}` : "nullthrows");
    }
  } catch (error) {
    emptyFncWithMsg(error);
  }
  return given!;
}
