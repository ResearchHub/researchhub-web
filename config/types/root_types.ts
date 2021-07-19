export type ID = string | number | null | undefined;
export type KeyOf<ObjectType> = keyof ObjectType;
export type ValueOf<ObjectType> = ObjectType[keyof ObjectType];
