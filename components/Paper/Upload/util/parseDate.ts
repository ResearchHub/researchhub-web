import { FormPublishedDate } from "../types/UploadComponentTypes";

export const parseDate = (dateParts: string[]): FormPublishedDate => {
  // NOTE: calvinhlee - below is a weird assumption. Migrating from prev logic
  return {
    year: dateParts[0],
    month: dateParts.length > 1 ? dateParts[1] : "01",
    day: dateParts.length > 2 ? dateParts[2] : "01",
  };
};
