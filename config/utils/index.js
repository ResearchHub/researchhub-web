export * from "./routing";

export function doesNotExist(value) {
  if (value === undefined || value === null) {
    return true;
  }
  return false;
}
