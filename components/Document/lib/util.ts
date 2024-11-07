import { GenericDocument, isPaper } from "./types";

export const isResearchHubPaper = (document: GenericDocument) => {
  return isPaper(document) && document.doi?.includes("ResearchHub");
}