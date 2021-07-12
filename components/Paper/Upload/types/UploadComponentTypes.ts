import { ID } from "../../../../config/types/root_types";

export type ComponentState = {
  authorSearchText: string;
  isFormDisabled: boolean;
  isFormEdited: boolean;
  isLoading: boolean;
  isURLView: boolean;
  shouldShowAuthorList: boolean;
  shouldShowTitle: boolean;
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
  paperTitle: string;
  published: {
    year: number | null | string;
    month: number | null | string;
    day: number | null | string;
  };
  rawAuthors: any[];
  title: string;
  type: string;
};

export const defaultComponentState: ComponentState = {
  authorSearchText: "",
  isFormDisabled: false,
  isFormEdited: false,
  isLoading: false,
  isURLView: true,
  shouldShowAuthorList: false,
  shouldShowTitle: false,
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
  paperTitle: "",
  published: {
    year: null,
    month: null,
    day: null,
  },
  rawAuthors: [],
  title: "",
  type: "",
};
