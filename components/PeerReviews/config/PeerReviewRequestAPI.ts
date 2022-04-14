import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { PeerReviewRequest, parsePeerReviewRequest } from "./PeerReviewTypes";

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
        (rawData: any): PeerReviewRequest => {
          return parsePeerReviewRequest(rawData);
        })
      onSuccess(requests);
    })
    .catch((error: Error) => onError(error));
}
