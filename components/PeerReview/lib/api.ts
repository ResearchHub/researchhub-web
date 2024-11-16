import API from "~/config/api";
import { ID, parseUser, RHUser } from "~/config/types/root_types";
import { formatDateStandard } from "~/config/utils/dates";
import { parsePeerReview, PeerReview } from "./types";

export const fetchPeerReviewers = (paperId: number): Promise<PeerReview[]> => {
    const url = `${API.BASE_URL}paper/${paperId}/peer-review`;
  
    return fetch(url, API.GET_CONFIG())
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        return data.results.map(parsePeerReview);
      })
      .catch((error) => {
        console.error("Request Failed:", error);
        return [];
      });
  };