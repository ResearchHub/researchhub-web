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
  const feFormattedDocType = getUnifiedDocType(docType);
  if (isNullOrUndefined(feFormattedDocType) || isNullOrUndefined(documentID)) {
    nullthrows(
      feFormattedDocType,
      `Unable to resolve document type ${docType} with ID ${documentID}`
    );
  }
  return `/${feFormattedDocType}/${documentID}/${slug ?? ""}/`;
}
