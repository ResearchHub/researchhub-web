import { ID } from "../../../../config/types/root_types";

export type ComponentState = {
  authorSearchText: string;
  isFormDisabled: boolean;
  isFormEdited: boolean;
  isLoading: boolean;
  isURLView: boolean;
  shouldShowAuthorList: boolean;
  shouldShowTitleField: boolean;
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
  raw_authors: any[];
  title: string;
  url: string | null;
};

export const defaultComponentState: ComponentState = {
  authorSearchText: "",
  isFormDisabled: false,
  isFormEdited: false,
  isLoading: false,
  isURLView: true,
  shouldShowAuthorList: false,
  shouldShowTitleField: false,
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
