import { createContext } from "react";
import { DocumentMetadata, DocumentType } from "./types";

type DocumentContext = {
  metadata: DocumentMetadata | undefined;
  documentType: DocumentType | undefined;
  tabName: string | undefined;
};

export const DocumentContext = createContext<DocumentContext>({
  metadata: undefined,
  documentType: undefined,
  tabName: undefined,
});
