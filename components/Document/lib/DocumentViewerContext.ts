import { createContext } from "react";
import { ContentInstance, GenericDocument } from "./types";
import { CommentPrivacyFilter } from "~/components/Comment/lib/types";

export type VisibilityPreferenceForViewingComments =
  | CommentPrivacyFilter
  | "OFF";
export type Page = {
  pageNumber: number;
};
export enum ViewerContext {
  REF_MANAGER = "REF_MANAGER",
  GENERIC = "GENERIC",
  DOCUMENT_PAGE = "DOCUMENT_PAGE",
}

type DocumentViewerContextType = {
  citationInstance?: ContentInstance;
  documentInstance?: ContentInstance;
  document?: GenericDocument | null | undefined;
  setVisibilityPreferenceForViewingComments: (
    filter: VisibilityPreferenceForViewingComments
  ) => void;
  visibilityPreferenceForViewingComments: VisibilityPreferenceForViewingComments;
  setVisibilityPreferenceForNewComment: (filter: CommentPrivacyFilter) => void;
  visibilityPreferenceForNewComment: CommentPrivacyFilter;
  onPageRender: (page: any) => void;
  lastPageRendered: Page;
  setNumAnnotations: (num: number) => void;
  numAnnotations: number;
  viewerContext: ViewerContext;
};

const DocumentViewerContext = createContext<DocumentViewerContextType>({
  setVisibilityPreferenceForViewingComments: () =>
    console.error("setVisibilityPreferenceForViewingComments not implemented"),
  setVisibilityPreferenceForNewComment: () =>
    console.error("setVisibilityPreferenceForNewComment not implemented"),
  onPageRender: () => console.error("onPageRender not implemented"),
  visibilityPreferenceForViewingComments: "PUBLIC",
  visibilityPreferenceForNewComment: "PUBLIC",
  lastPageRendered: { pageNumber: 0 },
  numAnnotations: 0,
  viewerContext: ViewerContext.GENERIC,
  setNumAnnotations: () => console.error("setNumAnnotations not implemented"),
});

export default DocumentViewerContext;
