import Cite from "citation-js";
require("@citation-js/plugin-bibtex");
require("@citation-js/plugin-ris");

import { filterNullOrUndefinedKeys } from "~/config/utils/nullchecks";
import { ReferenceTableRowDataType } from "../reference_table/utils/formatReferenceRowData";

export const formatBibliography = (
  refs: ReferenceTableRowDataType[],
  format: "APA" | "BibTeX" | "RIS"
): string[] => {
  const cite = new Cite();
  cite.reset();

  const parsed = refs.map((ref) => {
    const fields = ref.fields ?? {};
    const result = {
      ...fields,
      identifier: [{ type: "doi", id: fields.DOI ?? fields.doi }],
      journal: { name: fields.journal_abbreviation },
    };
    delete result.date;
    delete result.access_date;
    // we filter null/undefined/empty because if we don't they can show up
    // as empty entries in BibTeX
    return filterNullOrUndefinedKeys(result, { filterEmptyString: true });
  });

  const formatted = parsed.map((item) => {
    cite.set(item);
    if (format === "BibTeX") {
      return cite.format("bibtex", {
        format: "text",
      });
    }
    if (format === "RIS") {
      return cite.format("ris", {
        format: "text",
      });
    }
    // otherwise it's APA
    return cite.format("bibliography", {
      format: "text",
      template: "apa",
    });
  });

  return formatted;
};

export const downloadBibliography = (
  bib: string[],
  format: "APA" | "BibTeX" | "RIS"
): void => {
  // convert bibliography to blob
  let bibliographyText = "";
  if (format === "BibTeX") {
    bibliographyText = bib.map((b) => b?.trim()).join("\n\n");
  } else if (format === "RIS") {
    bibliographyText = bib.map((b) => b?.trim()).join("\n");
  } else {
    return;
  }
  const b = new Blob([bibliographyText], { type: "text/plain" });
  const url = URL.createObjectURL(b);

  // create a link for our script to click
  const a = document.createElement("a");
  a.href = url;
  if (format === "BibTeX") {
    a.download = "export.bib";
  } else if (format === "RIS") {
    a.download = "export.ris";
  } else {
    return;
  }

  // trigger the click
  document.body.appendChild(a);
  a.click();

  // cleanup
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
