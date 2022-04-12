import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import { emptyFncWithMsg } from "../../../config/utils/nullchecks";
import { ID, NullableString, ValueOf } from "../../../config/types/root_types";
import { AUTHOR_CLAIM_STATUS } from "../constants/AuthorClaimStatus";

export type Requestor = {
  name: string;
  profileImg: string;
  providedEmail: string;
  requestorAuthorID: ID;
};

export type CaseData = {
  createdDate: string;
  id: ID;
  paper: any;
  status: string;
  targetAuthorName?: NullableString;
  updatedDate: string;
};

export type ApiOnSuccess = ({
  data,
  hasMore,
  page,
}: {
  caseData: CaseData[];
  hasMore: boolean;
  page: number;
}) => void;

export type AuthorClaimCase = {
  caseData: CaseData;
  requestor: Requestor;
};

type ApiArgs = {
  caseStatus: ValueOf<typeof AUTHOR_CLAIM_STATUS>;
  onSuccess: ApiOnSuccess;
  onError?: Function;
};

export function getCases({
  caseStatus = AUTHOR_CLAIM_STATUS.OPEN,
  onSuccess,
  onError = emptyFncWithMsg,
}: ApiArgs): void {
  fetch(
    API.AUTHOR_CLAIM_MODERATORS({ case_status: caseStatus }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response: any): void => {
      const caseData = (response || []).map(
        (caseData: any): AuthorClaimCase => {
          const {
            created_date,
            id,
            provided_email,
            requestor,
            status,
            updated_date,
            paper,
            target_author_name,
          } = caseData;
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
              paper,
              targetAuthorName: target_author_name,
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
      onSuccess({formattedResponse});
    })
    .catch((e) => onError(e));
}
