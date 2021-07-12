import { ID } from "../../../../config/types/root_types";

export type FormState = {
  abstract: any;
  author: any;
  doi: ID;
  hubs: any[];
  paper_title: string;
  published: {
    year: number | string;
    month: number | string;
    day: number | string;
  };
  raw_authors: any[];
  title: string;
  type: string;
};

export type ErrorState = {
  year: boolean;
  month: boolean;
  hubs: boolean;
  dnd: boolean;
  author: boolean;
  tagline: boolean;
};
