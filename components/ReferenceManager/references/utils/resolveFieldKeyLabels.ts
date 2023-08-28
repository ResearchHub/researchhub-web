import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import { snakeCaseToNormalCase } from "~/config/utils/string";

const labelMap = {
  author: "Authors",
  "call-number": "Call number",
  "chapter-number": "Chapter Number",
  "collection-number": "Series number",
  "collection-title": "Series title",
  "container-title": "Publication title",
  date: "Publication Date (MM-DD-YYYY)",
  doi: "DOI",
  DOI: "DOI",
  journalAbbreviation: "Journal abbreviation",
  "number-of-pages": "Number of pages",
  "number-of-volumes": "Number of volumes",
  "publisher-place": "Place",
  "title-short": "Short title",
  url: "URL",
};

export const resolveFieldKeyLabels = (str: string): string => {
  const label = labelMap[str];
  return !isEmpty(label)
    ? nullthrows(label)
    : nullthrows(snakeCaseToNormalCase(str));
};

export const sortSchemaFieldKeys = (fieldKeys: string[]): string[] => {
  const keySet = new Set(fieldKeys);
  const subResult: string[] = [];
  // logical ordering
  keySet.has("title") && subResult.push("title");
  keySet.has("DOI") && subResult.push("DOI");
  keySet.has("author") && subResult.push("author");
  keySet.has("publication_title") && subResult.push("publication_title");
  keySet.delete("author");
  keySet.delete("title");
  keySet.delete("publication_title");
  keySet.delete("DOI");
  keySet.delete("doi");

  return [...subResult, ...Array.from(keySet)];
};
