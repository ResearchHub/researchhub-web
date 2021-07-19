import { FormState } from "../types/UploadComponentTypes";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "../../../../config/types/root_types";
import {
  isNullOrUndefined,
  nullthrows,
} from "../../../../config/utils/nullchecks";
import { formatDateToDropdownOptions, parseDate } from "../util/parseDate";
import API from "../../../../config/api";

type Args = {
  currUserAuthorID: ID;
  onError: Function;
  onSuccess: ({ parsedFormState }: { parsedFormState: FormState }) => void;
  paperID: ID | ID[] | undefined;
};

export async function getExistingPaperForEdit({
  currUserAuthorID,
  onError,
  onSuccess,
  paperID,
}: Args): Promise<void> {
  if (isNullOrUndefined(paperID)) {
    nullthrows(paperID, "paperID must be present to edit a paper");
  }
  const paperId = Array.isArray(paperID) ? paperID[0] : paperID;
  fetch(API.PAPER({ paperId }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res: any): void => {
      const {
        abstract,
        authors,
        doi,
        hubs,
        paper_publish_date,
        paper_title,
        paper_type,
        publication_type: _publicationType,
        tagline: _tagline,
        title,
      } = res;
      const parsedFormState: FormState = {
        authors: !isNullOrUndefined(authors) ? authors : [],
        doi,
        title,
        paper_title,
        abstract,
        paper_type,
        // NOTE: hubs here is same as "selectedHubs" in component level
        hubs: hubs.map((hub: any) => {
          const { id, name } = hub;
          return {
            id: id,
            label: name,
            name,
            value: id,
          };
        }),
        /*  Refer to NOTE(100) - calvinhlee */
        published: !isNullOrUndefined(paper_publish_date)
          ? formatDateToDropdownOptions(
              parseDate(paper_publish_date.split("-"))
            )
          : { year: null, month: null, day: null },
        author: {
          self_author: !isNullOrUndefined(currUserAuthorID)
            ? authors.some((author: any) => author.id === currUserAuthorID)
            : false,
        },
      };
      onSuccess({ parsedFormState });
    })
    .catch((e: Error): void => onError(e));
}
