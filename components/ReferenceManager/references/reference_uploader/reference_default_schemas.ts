export type ReferenceSchemaValueSet = {
  attachment: File | null;
  schema: any;
  required: string[];
};

export const DEFAULT_REF_SCHEMA_SET: ReferenceSchemaValueSet = {
  attachment: null,
  schema: {},
  required: [],
};
