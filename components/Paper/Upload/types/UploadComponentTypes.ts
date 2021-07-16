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

export type FormPublishedDate = {
  year: number | null | string;
  month: number | null | string;
  day: number | null | string;
};

// Intentional snake_casing to be used as a BE payload
export type FormState = {
  abstract: any;
  author: any;
  authors?: any[]; // only used for update. Often referred to as selectedAuthors in FE
  doi: ID;
  hubs: any[];
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
