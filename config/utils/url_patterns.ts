import { ID } from "../types/root_types";
import { getUnifiedDocType } from "./getUnifiedDocType";
import { isNullOrUndefined, nullthrows } from "./nullchecks";

export const UNIFIED_DOC_PAGE_URL_PATTERN =
  "/[documentType]/[documentId]/[slug]";

type FormatUnifiedDocPageUrlArgs = {
  docType: string;
  documentID: ID;
  slug?: string | null;
};

export function formatUnifiedDocPageUrl({
  docType,
  documentID,
  slug,
}: FormatUnifiedDocPageUrlArgs): string {
  const beDocType = getUnifiedDocType(docType);
  if (isNullOrUndefined(beDocType) || isNullOrUndefined(documentID)) {
    nullthrows(
      beDocType,
      `Unable to resolve document type ${docType} with ID ${documentID}`
    );
  }
  return `/${beDocType}/${documentID}/${slug ?? ""}/`;
}
