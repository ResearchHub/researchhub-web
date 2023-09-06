import { filterNull } from "~/config/utils/nullchecks";
import { ID, NullableString } from "~/config/types/root_types";
import {
  datePartsToDateString
} from "../../utils/formatCSLDate";
import { ProjectValue } from "../../reference_organizer/context/ReferenceProjectsUpsertContext";
import dayjs from "dayjs";
import { genClientId } from "~/config/utils/id";

export type ReferenceTableRowDataType = {
  // NOTE: Logical ordering for display reason
  // TODO: calvinhlee update this once BE is setup
  added_date: string;
  id: ID;
  citation_type: NullableString;
  title: NullableString;
  authors: NullableString;
  hubs: NullableString;
  last_author: NullableString;
  published_date: NullableString;
  raw_data?: any;
  actions?: any;
  attachment?: string;
  is_loading?: boolean;
};

function formatAuthors(
  authors: { given: string; family: string }[]
): string {
  return authors
    .map(
      (artistEl) => `${artistEl.given ?? ""} ${artistEl.family ?? ""}`
    )
    .join(", ");
}

function referenceFormatSwitchMap(datum: any): ReferenceTableRowDataType {
  const { citation_type } = datum ?? {};
  switch (citation_type) {
    case "LOADING":
      return formatLoading(datum);
    case "ARTWORK":
      return formatArtwork(datum);
    case "MANUSCRIPT":
    default:
      return formatManuscript(datum);
    // throw new Error(
    //   `formatReferenceRowData: unable to find appropriate citation_type - ${citation_type}`
    // );
  }
}

function formatArtwork(datum: any): ReferenceTableRowDataType {
  const {
    created_date,
    citation_type,
    fields: { access_date, author, issued, title },
    id,
  } = datum ?? { fields: {}, author: {} };
  const lastAuthor = author[author.length - 1];
  const publishedDate = dayjs(datePartsToDateString(issued)).format("YYYY-DD-MM");

  return {
    added_date: created_date.split("T")[0],
    id,
    citation_type,
    title,
    authors: formatAuthors(author),
    last_author: `${lastAuthor?.given ?? ""} ${
      lastAuthor?.family ?? ""
    }`,
    hubs: "",
    published_date: publishedDate === "Invalid Date" ? null : publishedDate,
    raw_data: datum,
  };
}

function formatManuscript(datum: any): ReferenceTableRowDataType {
  const {
    created_date,
    citation_type,
    fields: { access_date, author, issued, title },
    id,
  } = datum ?? { fields: {}, author: {} };
  const lastAuthor = author[author.length - 1];
  const publishedDate = dayjs(datePartsToDateString(issued)).format("YYYY-DD-MM");

  return {
    added_date: created_date.split("T")[0],
    id,
    citation_type,
    title,
    authors: formatAuthors(author),
    last_author: `${lastAuthor?.given ?? ""} ${
      lastAuthor?.family ?? ""
    }`,
    hubs: "",
    published_date: publishedDate === "Invalid Date" ? null : publishedDate,
    raw_data: datum,
    actions: null,
  };
}

export function formatLoading(datum): ReferenceTableRowDataType {
  return {
    added_date: "load",
    id: datum.id || genClientId(),
    citation_type: "load",
    title: "load",
    authors: "load",
    last_author: "load",
    hubs: "load",
    published_date: "load",
    actions: "load",
    is_loading: true,
  };
}

export function formatReferenceRowData(
  data: any[],
  projects: any[],
  parent: ProjectValue
): ReferenceTableRowDataType[] {
  // NOTE: each returned-object is logically ordered. Displayed in ReferenceItemTab

  const formatted = [
    parent,
    ...(projects ?? []),
    ...data.map((datum: any) => referenceFormatSwitchMap(datum)),
  ];

  return filterNull(formatted);
}
