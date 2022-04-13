import { ReactElement } from "react";
import { PeerReviewRequest } from "./config/PeerReviewTypes";
import { css, StyleSheet } from "aphrodite";
import ALink from "~/components/ALink";

type Props = {
    peerReviewRequest: PeerReviewRequest;
};

function PeerReviewRequestCard({
    peerReviewRequest
}: Props): ReactElement {
    return (
        <div className={css(styles.PeerReviewRequestCard)}>
            <ALink href="/" as="/">meow</ALink>
            {peerReviewRequest.id}
        </div>
    )
}

const styles = StyleSheet.create({
    PeerReviewRequestCard: {

    }
})

export default PeerReviewRequestCard;
