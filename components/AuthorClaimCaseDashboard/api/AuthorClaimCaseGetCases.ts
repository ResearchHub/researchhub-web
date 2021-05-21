import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import { emptyFncWithMsg } from "../../../config/utils/nullchecks";
import { ID, ValueOf } from "../../../config/types/root_types";
import { AUTHOR_CLAIM_STATUS } from "../constants/AuthorClaimStatus";

export type Requestor = {
  email: string;
  providedEmail: string;
  id: ID;
  profileImg: string;
  name: string;
};

export type TargetAuthor = {
  id: ID;
  name: string;
};

export type Case = {
  created_date: string;
  id: ID;
  status: string;
  updated_date: string;
};

export type AuthorClaimCase = {
  case: Case;
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
    .then((response: any): void => onSuccess())
    .catch((e) => onError(e));
}
