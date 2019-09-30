export * from "./dates";
export * from "./routing";

export function getNestedValue(root, nodes, defaultValue = null) {
  const initialValue = root;

  if (doesNotExist(initialValue)) {
    return defaultValue;
  }

  const value = nodes.slice(0).reduce((acc, curr, i, arr) => {
    if (doesNotExist(acc[curr])) {
      arr.splice(1);
      return defaultValue;
    }
    return acc[curr];
  }, initialValue);

  return value;
}

export function doesNotExist(value) {
  if (value === undefined || value === null) {
    return true;
  }
  return false;
}

export function isEmpty(value) {
  if (typeof value === "object") {
    if (Object.entries(value).length === 0 && value.constructor === Object) {
      return true;
    }
    return false;
  } else if (typeof value === "string") {
    return value === "";
  } else if (typeof value === "number") {
    return false;
  }
}
