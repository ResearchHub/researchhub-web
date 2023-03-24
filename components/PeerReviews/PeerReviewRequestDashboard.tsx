import { ReactElement, useState, useEffect, useCallback } from "react";
import { css, StyleSheet } from "aphrodite";
import { fetchPeerReviewRequests } from "./config/PeerReviewRequestAPI";
import { PeerReviewRequest } from "~/config/types/peerReview";
import PeerReviewRequestCard from "./PeerReviewRequestCard";
import { captureEvent } from "~/config/utils/events";

function PeerReviewRequestDashboard() : ReactElement<"div"> {
  const [peerReviewRequests, setPeerReviewRequests] = useState<Array<PeerReviewRequest>>([])

  const handleFetchReviewRequests = useCallback(() => {
    fetchPeerReviewRequests({
      onSuccess: (peerReviewRequests: PeerReviewRequest[]): void => {
        setPeerReviewRequests(peerReviewRequests);
      },
      onError: (error: any): void => {
        captureEvent({
          error,
          msg: "Failed to fetch review requests",
          data: { },
        });
      }
    })
  }, [peerReviewRequests])

  useEffect(() => {
    handleFetchReviewRequests();
  }, [])

  return (
    <div className={css(styles.dashboardContainer)}>
      <h1 className={css(styles.header)}>Peer Review Requests</h1>
      <div className="cardsContainer">
        {peerReviewRequests.map((req: PeerReviewRequest): ReactElement<typeof PeerReviewRequestCard> => {
          return (
            <PeerReviewRequestCard
              peerReviewRequest={req}
              key={req.id}
              fetchReviewRequests={handleFetchReviewRequests}
            />
          )
        })}
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  "header": {
    fontSize: 30,
    fontWeight: 500,
  },
  "dashboardContainer": {
    padding: "0 32px",
  }
})

export default PeerReviewRequestDashboard;
