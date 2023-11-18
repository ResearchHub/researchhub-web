export function localWarn(...args: any[]): void {
  console.warn(...args);
}

export function localError(...args: any[]): void {
  console.error(...args);
}

export function emptyFncWithMsg(
  message: Error | string | null | undefined | unknown
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

export function filterNull(arr: Array<any>): Array<any> {
  return arr.filter((el: any): boolean => el != null);
}

export function filterNullOrUndefinedKeys(
  obj: any,
  {
    filterEmptyString,
    filterEmptyArray,
    filterEmptyObject,
  }: {
    filterEmptyString?: boolean;
    filterEmptyArray?: boolean;
    filterEmptyObject?: boolean;
  } = {
    filterEmptyString: false,
    filterEmptyArray: false,
    filterEmptyObject: false,
  }
): any {
  return Object.keys(obj).reduce((acc: any, key: string): any => {
    if (
      isNullOrUndefined(obj[key]) ||
      (filterEmptyString && obj[key] === "") ||
      (filterEmptyArray && Array.isArray(obj[key]) && obj[key].length === 0) ||
      (filterEmptyObject &&
        typeof obj[key] === "object" &&
        Object.keys(obj[key]).length === 0)
    ) {
      return acc;
    }
    return {
      ...acc,
      [key]: obj[key],
    };
  }, {});
}

export function doesNotExist(value) {
  if (value === undefined || value === null) {
    return true;
  }
  return false;
}

export function isEmpty(value) {
  if (isNullOrUndefined(value)) {
    return true;
  } else if (Array.isArray(value) && value.length === 0) {
    return true;
  } else if (typeof value === "object") {
    if (Object.entries(value).length === 0 && value.constructor === Object) {
      return true;
    }
    return false;
  } else if (typeof value === "string") {
    return value === "";
  } else if (typeof value === "number") {
    return false;
  }
  return false;
}
