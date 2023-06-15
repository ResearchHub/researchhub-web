import { createContext } from "react";
import { DocumentMetadata, DocumentType } from "./types";

type DocumentContext = {
  metadata: DocumentMetadata | undefined;
  documentType: DocumentType | undefined;
  tabName?: string | undefined;
  updateMetadata: Function;
  editDocument?: Function;
  updateDocument: Function;
};

export const DocumentContext = createContext<DocumentContext>({
  metadata: undefined,
  documentType: undefined,
  tabName: undefined,
  updateMetadata: () => null,
  editDocument: () => null,
  updateDocument: () => null,
});
