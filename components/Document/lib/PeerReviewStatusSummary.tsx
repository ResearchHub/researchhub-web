import { StyleSheet, css } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglass, faCircleCheck } from "@fortawesome/pro-regular-svg-icons";
import { faRotateExclamation } from "@fortawesome/pro-solid-svg-icons";
import AuthorAvatar from "../../AuthorAvatar";
import colors from "~/config/themes/colors";
import { GenericDocument, isPaper } from "./types";
import { faInfoCircle } from "@fortawesome/pro-solid-svg-icons";
import ALink from "~/components/ALink";

const REQUIRED_REVIEWER_COUNT = 3;
const STATUS_TEXT_MAP = {
  APPROVED: "Approved",
  PENDING: "Pending",
  CHANGES_REQUESTED: "Changes Requested"
} as const;

export const PeerReviewStatusSummary = ({ document }: { document: GenericDocument }) => {
  if (!isPaper(document)) return null;
  
  const isInReview = isPaper(document) && document.peerReviews.some(
    review => ["APPROVED", "PENDING", "CHANGES_REQUESTED"].includes(review.status)
  );

  // Calculate number of empty slots needed
  const emptyReviewerSlots = REQUIRED_REVIEWER_COUNT - document.peerReviews.length;
  const emptyReviewers = Array(emptyReviewerSlots).fill(null);

  return (
    <div className={css(styles.tooltipContent)}>
      <div className={css(styles.statusSummary)}>
        {isInReview && (
          <>
            <FontAwesomeIcon style={{ fontSize: 18 }} icon={faInfoCircle} />
            <span>
              This paper is currently being reviewed. Once 2/3 reviewers approve, it will be published in the <ALink overrideStyle={styles.journalLink} href="/researchhub-journal" target="_blank" theme="blue">ResearchHub Journal</ALink>.
            </span>
          </>
        )}
      </div>


      <div className={css(styles.tooltipTitle)}>Peer Reviewers:</div>
      <div className={css(styles.reviewersGrid)}>
        {document.peerReviews.map((review, index) => (
          <div key={index} className={css(styles.reviewerItem)}>
            <div className={css(styles.reviewerMainInfo)}>
              <AuthorAvatar
                size={24}
                author={review.user.authorProfile}
              />
              <span className={css(styles.reviewerName)}>
                {review.user.authorProfile.firstName} {review.user.authorProfile.lastName}
              </span>
              <div className={css(styles.statusWrapper)}>
                <div className={css(styles.statusIconWrapper, 
                  review.status === "APPROVED" && styles.completedIconWrapper,
                  review.status === "PENDING" && styles.pendingIconWrapper,
                  review.status === "CHANGES_REQUESTED" && styles.changesRequestedIconWrapper
                )}>
                  <FontAwesomeIcon 
                    icon={review.status === "APPROVED" 
                      ? faCircleCheck 
                      : review.status === "CHANGES_REQUESTED"
                      ? faRotateExclamation
                      : faHourglass
                    } 
                    className={css(styles.statusIcon,
                      review.status === "APPROVED" && styles.approvedIcon,
                      review.status === "PENDING" && styles.pendingIcon,
                      review.status === "CHANGES_REQUESTED" && styles.changesRequestedIcon
                    )}
                  />
                </div>
                <span className={css(styles.statusText,
                  review.status === "APPROVED" && styles.completedText,
                  review.status === "PENDING" && styles.pendingText,
                  review.status === "CHANGES_REQUESTED" && styles.changesRequestedText
                )}>
                  {STATUS_TEXT_MAP[review.status] || review.status}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add empty reviewer slots */}
        {emptyReviewers.map((_, index) => (
          <div key={`empty-${index}`} className={css(styles.reviewerItem)}>
            <div className={css(styles.reviewerMainInfo)}>
              <AuthorAvatar
                size={24}
                author={null}
              />
              <span className={css(styles.reviewerName)}>
                Reviewer to be assigned
              </span>
              <div className={css(styles.statusWrapper)}>
                <div className={css(styles.statusIconWrapper, styles.pendingIconWrapper)}>
                  <FontAwesomeIcon 
                    icon={faHourglass}
                    className={css(styles.statusIcon, styles.pendingIcon)}
                  />
                </div>
                <span className={css(styles.statusText, styles.pendingText)}>
                  {STATUS_TEXT_MAP.PENDING}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  tooltipContent: {
    padding: "8px 12px",
    background: colors.LIGHTER_GREY(1.0),
  },
  tooltipTitle: {
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 8,
    marginTop: 20,
    color: colors.BLACK(0.7),
  },
  journalLink: {
    display: "inline",
    textDecoration: "none",
  },
  statusSummary: {
    marginBottom: 8,
    color: colors.BLACK(0.7),
    fontSize: 13,
    fontWeight: 400,
    alignItems: "flex-start",
    
    display: "flex",
    gap: 8,
    "& > span": {
      display: "inline",
    },
  },
  reviewersGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  reviewerItem: {
    display: "flex",
    paddingBottom: 8,
  },
  reviewerMainInfo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  statusIconWrapper: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${colors.LIGHTER_GREY(1.0)}`,
  },
  statusIcon: {
    fontSize: 16,
    backgroundColor: colors.LIGHTER_GREY(1.0),
  },
  approvedIcon: {
    color: colors.NEW_GREEN(),
  },
  pendingIcon: {
    color: colors.ORANGE_DARK2(),
  },
  changesRequestedIcon: {
    color: colors.RED(),
  },
  statusText: {
    fontSize: 13,
    color: colors.BLACK(0.7),
  },
  completedIconWrapper: {
  },
  pendingIconWrapper: {
  },
  reviewerName: {
    fontSize: 13,
    color: colors.BLACK(0.7),
  },
  statusWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
  },
  completedText: {
    color: colors.NEW_GREEN(),
  },
  pendingText: {
    color: colors.ORANGE_DARK2(),
  },
  changesRequestedIconWrapper: {
  },
  changesRequestedText: {
    color: colors.RED(),
  },
  tbdIconWrapper: {
    // Add any specific styles for TBD state
  },
  tbdIcon: {
    color: colors.BLACK(0.3),
  },
  tbdText: {
    color: colors.BLACK(0.3),
  },
});

export default PeerReviewStatusSummary; 