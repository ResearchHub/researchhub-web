import { createContext } from "react";
import { DocumentMetadata, DocumentType } from "./types";

export type DocumentPreferences = {
  comments: "mine" | "all" | "none";
};

type DocumentContext = {
  metadata: DocumentMetadata | undefined;
  documentType: DocumentType | undefined;
  tabName?: string | undefined;
  updateMetadata: Function;
  editDocument?: Function;
  updateDocument: Function;
  preferences: DocumentPreferences;
  setPreference: Function;
};

export const DocumentContext = createContext<DocumentContext>({
  metadata: undefined,
  documentType: undefined,
  tabName: undefined,
  updateMetadata: () => null,
  editDocument: () => null,
  updateDocument: () => null,
  setPreference: ({ key, value }) => null,
  preferences: {
    comments: "all",
  },
});
