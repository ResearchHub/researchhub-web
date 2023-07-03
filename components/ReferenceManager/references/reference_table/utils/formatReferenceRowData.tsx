import { filterNull } from "~/config/utils/nullchecks";
import { ID, NullableString } from "~/config/types/root_types";
import { ProjectValue } from "../../reference_organizer/context/ReferenceProjectsUpsertContext";

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
};

function formatAuthors(
  authors: { first_name: string; last_name: string }[]
): string {
  return authors
    .map(
      (artistEl) => `${artistEl.first_name ?? ""} ${artistEl.last_name ?? ""}`
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
    fields: { access_date, creators, date, title },
    id,
  } = datum ?? { fields: {}, creators: {} };
  const lastAuthor = creators[creators.length - 1];
  return {
    added_date: created_date.split("T")[0],
    id,
    citation_type,
    title,
    authors: formatAuthors(creators),
    last_author: `${lastAuthor?.first_name ?? ""} ${
      lastAuthor?.last_name ?? ""
    }`,
    hubs: "",
    published_date: date ?? access_date,
    raw_data: datum,
  };
}

function formatManuscript(datum: any): ReferenceTableRowDataType {
  const {
    created_date,
    citation_type,
    fields: { access_date, creators, date, title },
    id,
  } = datum ?? { fields: {}, creators: {} };
  const lastAuthor = creators[creators.length - 1];
  return {
    added_date: created_date.split("T")[0],
    id,
    citation_type,
    title,
    authors: formatAuthors(creators),
    last_author: `${lastAuthor?.first_name ?? ""} ${
      lastAuthor?.last_name ?? ""
    }`,
    hubs: "",
    published_date: date ?? access_date,
    raw_data: datum,
  };
}

function formatLoading(datum): ReferenceTableRowDataType {
  return {
    added_date: "load",
    id: datum.id,
    citation_type: "load",
    title: "load",
    authors: "load",
    last_author: "load",
    hubs: "load",
    published_date: "load",
  };
}

export function formatReferenceRowData(
  data: any[],
  projects: any[],
  parent: ProjectValue
): ReferenceTableRowDataType[] {
  // NOTE: each returned-object is logically ordered. Displayed in ReferenceItemTab

  console.log(data);

  const formatted = [
    parent,
    ...(projects ?? []),
    ...data.map((datum: any) => referenceFormatSwitchMap(datum)),
  ];

  return filterNull(formatted);
}
