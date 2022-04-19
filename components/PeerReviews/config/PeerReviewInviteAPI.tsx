import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { PeerReviewRequest, parsePeerReviewRequest } from "~/config/types/peerReview";
import { captureEvent } from "~/config/utils/events";

type Args = {
  peerReviewRequest: PeerReviewRequest,
  email: string,
  onError: Function;
  onSuccess: Function;
}

export function inviteReviewer({
  peerReviewRequest,
  email,
  onSuccess,
  onError,
}: Args) {
  fetch(
    API.PEER_REVIEW_INVITE_REVIEWER(),
    API.POST_CONFIG({
      peer_review_request: peerReviewRequest.id,
      recipient_email: email,
    })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response: any): void => {
      onSuccess(response);
    })
    .catch((error: Error): void => {
      captureEvent({
        error,
        msg: "Failed to invite",
        data: { peerReviewRequest, email },
      });
      onError(error)
    });
}
