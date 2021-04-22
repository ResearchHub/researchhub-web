export type ID = string | number | null;
export type KeyOf<Object> = keyof Object;
export type ValueOf<T> = T[keyof T];
