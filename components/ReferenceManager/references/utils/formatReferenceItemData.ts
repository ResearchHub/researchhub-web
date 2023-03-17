import { filterNull } from "~/config/utils/nullchecks";
import { ReferenceItemDataType } from "../context/ReferencesTabContext";

function referenceFormatSwitchMap(datum: any): ReferenceItemDataType | null {
  const { citation_type, fields, id } = datum ?? {};
  switch (citation_type) {
    case "ARTWORK":
      const {
        access_date,
        title,
        creators: { artist },
        date,
      } = fields;
      const lastAuthor = artist[artist.length - 1];
      return {
        id,
        title,
        authors: artist
          .map(
            (artistEl) =>
              `${artistEl.first_name ?? ""} ${artistEl.last_name ?? ""}`
          )
          .join(", "),
        last_author: `${lastAuthor?.first_name ?? ""} ${
          lastAuthor?.last_name ?? ""
        }`,
        hubs: "",
        published_date: date ?? access_date,
        published_year: date.split("-")[2] ?? access_date.split("-")[2] ?? "",
      };
    default:
      throw new Error(
        `formatReferenceItemData: unable to find appropriate citation_type - ${citation_type}`
      );
      return null;
  }
}

export function formatReferenceItemData(data: any): ReferenceItemDataType[] {
  return filterNull(data.map((datum) => referenceFormatSwitchMap(datum)));
}
