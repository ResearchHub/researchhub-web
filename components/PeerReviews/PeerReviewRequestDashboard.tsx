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
    <div>
      <h3>Manage Peer Review Reuquests</h3>
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

})

export default PeerReviewRequestDashboard;
