import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { PeerReviewRequest } from "./PeerReviewTypes";

type Args = {
  onError: Function;
  onSuccess: Function;
}

export function fetchPeerReviewRequests({
  onSuccess,
  onError,
}: Args) {
  fetch(
    API.PEER_REVIEW_REQUESTS(),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response: any): void => {
      const requests = (response?.results || []).map(
        (rawData: any): PeerReviewRequest => ({
          id: rawData.id,
          createdDate: rawData.created_date,
          docVersion: rawData.doc_version,
          peerReview: rawData.peer_review,
          requestedByUser: rawData.requested_by_user,
          status: rawData.status,
          unifiedDocument: rawData.unified_document,
        }))
      onSuccess(requests);
    })
    .catch((error: Error) => onError(error));
}
