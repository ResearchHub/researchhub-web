import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import { StyleSheet, css } from "aphrodite";
import ContentBadge from "../ContentBadge";
import {
  DocumentMetadata,
  GenericDocument,
  isPaper,
  isPost,
} from "./lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglass, faCircleCheck } from "@fortawesome/pro-regular-svg-icons";
import { Tooltip } from "@mui/material";
import AuthorAvatar from "../AuthorAvatar";
import colors from "~/config/themes/colors";

type Props = {
  document: GenericDocument;
  metadata: DocumentMetadata | undefined;
};

const DocumentBadges = ({ document, metadata }: Props) => {
  const openBountyAmount = (metadata?.bounties || []).reduce(
    (total, bounty) => bounty.amount + total,
    0
  );
  const tippedAmount = (metadata?.purchases || []).reduce(
    (total, tip) => tip.amount + total,
    0
  );

  const isInReview = isPaper(document) && document.peerReviews.some(
    review => review.status === "PENDING"
  );

  const ReviewersTooltip = () => (
    <div className={css(styles.tooltipContent)}>
      <div className={css(styles.tooltipTitle)}>Assigned Reviewers:</div>
      <div className={css(styles.reviewersGrid)}>
        {isPaper(document) && document.peerReviews.map((review, index) => (
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
                  review.status === "PENDING" && styles.pendingIconWrapper
                )}>
                  <FontAwesomeIcon 
                    icon={review.status === "APPROVED" ? faCircleCheck : faHourglass} 
                    className={css(styles.statusIcon)}
                  />
                </div>
                <span className={css(styles.statusText,
                  review.status === "APPROVED" && styles.completedText,
                  review.status === "PENDING" && styles.pendingText
                )}>
                  {review.status.charAt(0) + review.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={css(styles.badges)}>
      {isInReview && (
        <Tooltip 
          title={<ReviewersTooltip />}
          placement="bottom-start"
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: colors.LIGHTER_GREY(1.0),
                '& .MuiTooltip-arrow': {
                  display: 'none'
                },
                marginTop: '0px !important',
                position: 'relative',
                top: '10px'
              }
            },
            popper: {
              sx: {
                marginTop: '0px !important'
              }
            }
          }}
        >
          <div>
            <ContentBadge
              size="medium"
              contentType="status"
              label={
                <span className={css(styles.inReviewLabel)}>
                  <FontAwesomeIcon icon={faHourglass} className={css(styles.hourglassIcon)} />
                  In Review
                </span>
              }
            />
          </div>
        </Tooltip>
      )}
      {openBountyAmount > 0 && (
        <ContentBadge
          size="medium"
          contentType={"bounty"}
          bountyAmount={openBountyAmount}
          label={`${formatBountyAmount({
            amount: openBountyAmount,
          })} Grant`}
        />
      )}
      {tippedAmount > 0 && (
        <ContentBadge
          tooltip="ResearchCoin awarded to authors of this paper"
          size="medium"
          contentType={"award"}
          bountyAmount={tippedAmount}
          label={`${formatBountyAmount({ amount: tippedAmount })} Tipped`}
        />
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  badges: {
    display: "flex",
    columnGap: "8px",
  },
  inReviewLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  hourglassIcon: {
    fontSize: 12,
  },
  tooltipContent: {
    padding: "8px 12px",
    background: colors.LIGHTER_GREY(1.0),
    width: 200,
  },
  tooltipTitle: {
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 8,
    color: colors.BLACK(0.7),
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
  avatarContainer: {
    position: "relative",
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
    fontSize: 8,
    color: "white",
  },
  statusText: {
    fontSize: 13,
    color: colors.BLACK(0.7),
  },
  completedIconWrapper: {
    backgroundColor: colors.NEW_GREEN(),
  },
  pendingIconWrapper: {
    backgroundColor: colors.ORANGE_DARK2(),
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
  statusParens: {
    color: colors.BLACK(0.5),
  },
  completedText: {
    color: colors.NEW_GREEN(),
  },
  pendingText: {
    color: colors.ORANGE_DARK2(),
  },
});

export default DocumentBadges;
