import { ID } from "../../../../config/types/root_types";

export type ComponentState = {
  authorSearchText: string | null;
  isFetchingAuthors: boolean;
  isFormDisabled: boolean;
  isFormEdited: boolean;
  isURLView: boolean;
  shouldShowAuthorList: boolean;
  shouldShowTitleField: boolean;
  suggestedAuthors: any[];
};

export type FormErrorState = {
  year: boolean;
  month: boolean;
  hubs: boolean;
  dnd: boolean;
  author: boolean;
  tagline: boolean;
};

export type ModifiedDateType = {
  label: string;
  value: string;
};

/*  NOTE: calvinhlee - Making fields multi-purpose based on FE context makes code potentially very buggy. Coding practices like this must stop disregarding js-typing. */
export type FormPublishedDate = {
  year: number | null | string | ModifiedDateType;
  month: number | null | string | ModifiedDateType;
  day: number | null | string | ModifiedDateType;
};

// Intentional snake_casing to be used as a BE payload
export type FormState = {
  abstract: any;
  author: any;
  authors?: any[]; // only used for update. Often referred to as selectedAuthors in FE
  doi: ID;
  file?: any; // most likely only used for create
  hubs: any[];
  hypothesis_id?: ID;
  paper_title: string;
  paper_type: string;
  published: FormPublishedDate;
  raw_authors?: any[]; // only used for create
  title: string;
  url?: string | null; // only used for create
};

export const defaultComponentState: ComponentState = {
  authorSearchText: null,
  isFetchingAuthors: false,
  isFormDisabled: false,
  isFormEdited: false,
  isURLView: true,
  shouldShowAuthorList: false,
  shouldShowTitleField: false,
  suggestedAuthors: [],
};

export const defaultFormErrorState: FormErrorState = {
  year: false,
  month: false,
  hubs: false,
  dnd: false,
  author: false,
  tagline: false,
};

// intentional snake_casing
export const defaultFormState: FormState = {
  abstract: null,
  author: {
    self_author: false,
  },
  authors: [],
  doi: null,
  hubs: [],
  hypothesis_id: null,
  paper_title: "",
  paper_type: "REGULAR",
  published: {
    year: null,
    month: null,
    day: null,
  },
  raw_authors: [],
  title: "",
  url: null,
};
