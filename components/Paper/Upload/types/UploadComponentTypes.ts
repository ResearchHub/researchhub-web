import { ID } from "../../../../config/types/root_types";

export type ComponentState = {
  authorSearchText: string;
  isFormEdited: boolean;
  isLoading: boolean;
  isURLView: boolean;
  shouldShowAuthorList: boolean;
};

export type FormErrorState = {
  year: boolean;
  month: boolean;
  hubs: boolean;
  dnd: boolean;
  author: boolean;
  tagline: boolean;
};

export type FormState = {
  abstract: any;
  author: any;
  doi: ID;
  hubs: any[];
  isFormDisabled: boolean;
  paper_title: string;
  published: {
    year: number | null | string;
    month: number | null | string;
    day: number | null | string;
  };
  raw_authors: any[];
  title: string;
  type: string;
};

export const defaultComponentState = {
  authorSearchText: "",
  isFormEdited: false,
  isLoading: false,
  isURLView: true,
  shouldShowAuthorList: false,
  showTitle: false,
};

export const defaultFormErrorState: FormErrorState = {
  year: false,
  month: false,
  hubs: false,
  dnd: false,
  author: false,
  tagline: false,
};

export const defaultFormState: FormState = {
  abstract: null,
  author: {
    self_author: false,
  },
  doi: null,
  hubs: [],
  isFormDisabled: false,
  paper_title: "",
  published: {
    year: null,
    month: null,
    day: null,
  },
  raw_authors: [],
  title: "",
  type: "",
};
