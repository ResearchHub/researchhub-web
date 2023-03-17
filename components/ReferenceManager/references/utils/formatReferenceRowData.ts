import { filterNull } from "~/config/utils/nullchecks";
import { ReferenceItemDataType } from "../context/ReferencesTabContext";

function formatAuthors(
  authors: { first_name: string; last_name: string }[]
): string {
  return authors
    .map(
      (artistEl) => `${artistEl.first_name ?? ""} ${artistEl.last_name ?? ""}`
    )
    .join(", ");
}

function referenceFormatSwitchMap(datum: any): ReferenceItemDataType | null {
  const { citation_type, fields, id } = datum ?? {};
  const { title, date, access_date } = fields;
  let lastAuthor;
  switch (citation_type) {
    case "ARTWORK":
      const {
        creators: { artist },
      } = fields;
      lastAuthor = artist[artist.length - 1];
      return {
        // logical ordering - displayed in ReferenceItemTab
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
    case "MANUSCRIPT":
      const {
        creators: { author },
      } = fields;
      lastAuthor = author[author.length - 1];

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
    default:
      throw new Error(
        `formatReferenceRowData: unable to find appropriate citation_type - ${citation_type}`
      );
      return null;
  }
}

export function formatReferenceRowData(data: any): ReferenceItemDataType[] {
  return filterNull(data.map((datum) => referenceFormatSwitchMap(datum)));
}
