import { ID } from "../../../../config/types/root_types";

export type ComponentState = {
  authorSearchText: string | null;
  isFetchingAuthors: boolean;
  isFormDisabled: boolean;
  isFormEdited: boolean;
  isURLView: boolean;
  /* NOTE: calvinhlee - because BE returns a hodge-podge of rawAuthors & "authorProfiles", we need separate handling state */
  selectedAuthors: any[];
  shouldShowAuthorList: boolean;
  shouldShowTitleField: boolean;
  suggestedAuthors: any[] | null;
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

// intentional snake_casing
export type FormState = {
  abstract: any;
  author: any;
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
  selectedAuthors: [],
  shouldShowAuthorList: false,
  shouldShowTitleField: false,
  suggestedAuthors: null,
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
