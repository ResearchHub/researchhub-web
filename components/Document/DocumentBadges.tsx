import { formatBountyAmount } from "~/config/types/bounty";
import { StyleSheet, css } from "aphrodite";
import ContentBadge from "../ContentBadge";
import {
  DocumentMetadata,
  GenericDocument,
  isPaper,
} from "./lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglass, faCircleCheck } from "@fortawesome/pro-regular-svg-icons";
import { faCircleInfo } from "@fortawesome/pro-solid-svg-icons";
import { Tooltip } from "@mui/material";
import colors from "~/config/themes/colors";
import PeerReviewStatusSummary from "./lib/PeerReviewStatusSummary";


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
    review => review.status === "PENDING" || review.status === "CHANGES_REQUESTED"
  );

  const isApproved = isPaper(document) && document.peerReviews.length > 0 && 
    document.peerReviews.every(review => review.status === "APPROVED");

  const tooltipProps = {
    placement: "bottom-start" as const,
    componentsProps: {
      tooltip: {
        sx: {
          fontSize: 14,
          width: "auto",
          color: colors.BLACK(0.7),
          bgcolor: colors.LIGHTER_GREY(1.0),
          '& .MuiTooltip-arrow': {
            display: 'none'
          },
          marginTop: '0px !important',
          position: 'relative',
          top: '10px',
          // fontSize: 13,
          fontWeight: 400,
          padding: "8px 14px",
        }
      },
      popper: {
        sx: {
          marginTop: '0px !important'
        }
      }
    }
  };
  
  return (
    <div className={css(styles.badges)}>
      {isPaper(document) && document.workType === "preprint" && (
        <Tooltip 
          {...tooltipProps}
          title={
            <span className={css(styles.tooltipContent)}>
              <FontAwesomeIcon icon={faCircleInfo} className={css(styles.tooltipIcon)} /> 
              Preprints have yet to be peer reviewed and published in a journal.
            </span>
          }
        >
          <div style={{ cursor: "pointer" }}>
            <ContentBadge
              size="medium"
              contentType="preprint"
            />
          </div>
        </Tooltip>
      )}
      {(isInReview || isApproved) && (
        <Tooltip 
          {...tooltipProps}
          title={<PeerReviewStatusSummary document={document} />}
        >
          <div>
            {isInReview && (
              <ContentBadge
                size="medium"
                contentType="status"
                label={
                  <span className={css(styles.badgeLabel)}>
                    <FontAwesomeIcon icon={faHourglass} className={css(styles.badgeIcon)} />
                    In Review
                  </span>
                }
              />
            )}
            {isApproved && (
              <ContentBadge
                size="medium"
                contentType="status"
                badgeOverride={styles.approvedBadge}
                label={
                  <span className={css(styles.badgeLabel)}>
                    <FontAwesomeIcon icon={faCircleCheck} className={css(styles.badgeIcon)} />
                    Approved
                  </span>
                }
              />
            )}
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
  tooltipContent: {
    padding: "0",
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
  badgeLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
  },
  badgeIcon: {
    fontSize: 12,
  },
  approvedBadge: {
    color: colors.NEW_GREEN(1.0),
  },
  tooltipIcon: {
    marginRight: 8,
    fontSize: 14,
  },
});

export default DocumentBadges;
