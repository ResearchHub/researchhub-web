import { filterNull } from "~/config/utils/nullchecks";
import { ReferenceTableRowDataType } from "../context/ReferencesTabContext";

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
    case "ARTWORK":
      return formatArtwork(datum);
    case "MANUSCRIPT":
      return formatManuscript(datum);
    default:
      throw new Error(
        `formatReferenceRowData: unable to find appropriate citation_type - ${citation_type}`
      );
  }
}

function formatArtwork(datum: any): ReferenceTableRowDataType {
  const {
    citation_type,
    fields: {
      access_date,
      creators: { artist },
      date,
      title,
    },
    id,
  } = datum ?? { fields: {}, creators: {} };
  const lastAuthor = artist[artist.length - 1];
  return {
    id,
    citation_type,
    title,
    authors: formatAuthors(artist),
    last_author: `${lastAuthor?.first_name ?? ""} ${
      lastAuthor?.last_name ?? ""
    }`,
    hubs: "",
    published_date: date ?? access_date,
    published_year: date.split("-")[2] ?? access_date.split("-")[2] ?? "",
  };
}

function formatManuscript(datum: any): ReferenceTableRowDataType {
  const {
    citation_type,
    fields: {
      access_date,
      creators: { author },
      date,
      title,
    },
    id,
  } = datum ?? { fields: {}, creators: {} };
  const lastAuthor = author[author.length - 1];
  return {
    id,
    citation_type,
    title,
    authors: formatAuthors(author),
    last_author: `${lastAuthor?.first_name ?? ""} ${
      lastAuthor?.last_name ?? ""
    }`,
    hubs: "",
    published_date: date ?? access_date,
    published_year: date.split("-")[2] ?? access_date.split("-")[2] ?? "",
  };
}

export function formatReferenceRowData(
  data: any[]
): ReferenceTableRowDataType[] {
  // NOTE: each returned-object is logically ordered. Displayed in ReferenceItemTab
  return filterNull(data.map((datum: any) => referenceFormatSwitchMap(datum)));
}
