// keep this in a separate file to avoid circular imports

export type WizardBodyTypes =
  | "async_updated"
  | "doi_upload"
  | "pdf_upload"
  | "posted_paper_update"
  | "standby"
  | "url_or_doi_upload";

export type PaperSubmissionStatus =
  | "COMPLETE"
  | "FAILED_DOI"
  | "FAILED_DUPLICATE"
  | "PROCESSING_MANUBOT"
  | "PROCESSING"
  | null;
