import { ReactElement } from "react";
import { PeerReviewRequest } from "./config/PeerReviewTypes";

type Props = {
    peerReviewRequest: PeerReviewRequest;
};

function PeerReviewRequestCard({
    peerReviewRequest
}: Props): ReactElement {
    return (
        <div>{peerReviewRequest.id}</div>
    )
}

export default PeerReviewRequestCard;
