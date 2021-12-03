import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import { emptyFncWithMsg } from "../../../config/utils/nullchecks";
import { ID, ValueOf } from "../../../config/types/root_types";
import { AUTHOR_CLAIM_STATUS } from "../constants/AuthorClaimStatus";

export type Requestor = {
  name: string;
  profileImg: string;
  providedEmail: string;
  requestorAuthorID: ID;
};

export type TargetAuthor = {
  description: string;
  education: any;
  headline: any;
  id: ID;
  name: string;
};

export type CaseData = {
  createdDate: string;
  id: ID;
  status: string;
  updatedDate: string;
};

export type AuthorClaimCase = {
  caseData: CaseData;
  targetAuthor: TargetAuthor;
  requestor: Requestor;
};

type ApiArgs = {
  caseStatus: ValueOf<typeof AUTHOR_CLAIM_STATUS>;
  onSuccess: Function;
  onError?: Function;
};

export function getCases({
  caseStatus = AUTHOR_CLAIM_STATUS.OPEN,
  onSuccess,
  onError = emptyFncWithMsg,
}: ApiArgs): void {
  fetch(
    API.MODERATORS_AUTHOR_CLAIM({ case_status: caseStatus }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response: any): void => {
      const formattedResponse = (response || []).map(
        (caseData: any): AuthorClaimCase => {
          const {
            created_date,
            id,
            provided_email,
            requestor,
            status,
            target_author,
            updated_date,
          } = caseData;
          const {
            description: tAuthorDescription,
            education: tAuthorEducation,
            first_name: tAuthorFirstName,
            headline: tAuthorHeadline,
            id: tAuthorID,
            last_name: tAuthorLastName,
          } = target_author || {};
          const {
            id: requestorID,
            author_profile: {
              id: requestorAuthorID,
              profile_image: requestorProfileImg,
              first_name: requestorFirstName,
              last_name: requestorLastName,
            },
          } = requestor || {};
          return {
            caseData: {
              createdDate: created_date,
              id,
              status,
              updatedDate: updated_date,
            },
            targetAuthor: {
              description: tAuthorDescription,
              education: tAuthorEducation,
              headline: tAuthorHeadline,
              id: tAuthorID,
              name: `${tAuthorFirstName} ${tAuthorLastName}`,
            },
            requestor: {
              name: `${requestorFirstName} ${requestorLastName}`,
              profileImg: requestorProfileImg,
              providedEmail: provided_email,
              requestorAuthorID,
            },
          };
        }
      );
      onSuccess(formattedResponse);
    })
    .catch((e) => onError(e));
}
