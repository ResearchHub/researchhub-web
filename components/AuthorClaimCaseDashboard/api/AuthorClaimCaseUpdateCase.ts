import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import { emptyFncWithMsg } from "../../../config/utils/nullchecks";
import { ID, ValueOf } from "../../../config/types/root_types";
import { AUTHOR_CLAIM_STATUS } from "../constants/AuthorClaimStatus";

type ApiArgs = {
  payload: {
    caseID: ID;
    updateStatus: ValueOf<typeof AUTHOR_CLAIM_STATUS>;
    shouldNotifyUser: Boolean;
  };
  onSuccess: Function;
  onError?: Function;
};

export function updateCaseStatus({
  payload: { caseID, updateStatus, shouldNotifyUser },
  onSuccess,
  onError = emptyFncWithMsg,
}: ApiArgs): void {
  fetch(
    API.AUTHOR_CLAIM_MODERATORS({}),
    API.POST_CONFIG({ case_id: caseID, update_status: updateStatus, notify_user: shouldNotifyUser })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((_response): void => onSuccess())
    .catch((e) => onError(e));
}
