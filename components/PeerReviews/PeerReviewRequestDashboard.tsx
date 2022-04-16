import { ReactElement, useState, useEffect } from "react";
import { css, StyleSheet } from "aphrodite";
import { fetchPeerReviewRequests } from "./config/PeerReviewRequestAPI";
import { PeerReviewRequest } from "./config/PeerReviewTypes";
import PeerReviewRequestCard from "./PeerReviewRequestCard";

function PeerReviewRequestDashboard() : ReactElement<"div"> {

  const [peerReviewRequests, setPeerReviewRequests] = useState<Array<PeerReviewRequest>>([])

  useEffect(() => {
    fetchPeerReviewRequests({
      onSuccess: (peerReviewRequests: PeerReviewRequest[]): void => {
        setPeerReviewRequests(peerReviewRequests);
      },
      onError: (error: any): void => {
        console.log(error);
      }
    })
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
