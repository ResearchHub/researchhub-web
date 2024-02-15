import React, { ReactElement, useMemo } from "react";
import { Fundraise } from "./lib/types";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { timeTo } from "~/config/utils/dates";
import CommentAvatars from "../Comment/CommentAvatars";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleX } from "@fortawesome/pro-solid-svg-icons";
import { faClock } from "@fortawesome/pro-regular-svg-icons";
import FundraiseContributorsModal from "./ContributorsModal";
import Button from "../Form/Button";
import FundraiseContributeModal from "./ContributeModal";
import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import ContentBadge from "../ContentBadge";
import { formatBountyAmount } from "~/config/types/bounty";
import { breakpoints } from "~/config/themes/screen";

export type FundraiseCardProps = {
  fundraise: Fundraise;

  showSupportButton?: boolean;
  onUpdateFundraise?: (fundraise: Fundraise) => void;
};

const FundraiseCard = ({
  fundraise: f,
  showSupportButton = true,
  onUpdateFundraise = () => {},
}: FundraiseCardProps): ReactElement => {
  const barFillAmount = useMemo(() => {
    if (f.status === "COMPLETED") return 100;
    else return Math.min((f.amountRaised.rsc / f.goalAmount.rsc) * 100, 100);
  }, [f.amountRaised.rsc, f.goalAmount.rsc, f.status]);

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.header)}>
        <div className={css(styles.amountRaised)}>
          <ResearchCoinIcon
            overrideStyle={styles.rscIcon}
            color={
              f.status === "COMPLETED"
                ? colors.NEW_GREEN()
                : colors.ORANGE_LIGHT2()
            }
            version={4}
            width={18}
            height={18}
          />
          <div
            className={css(
              styles.amountRaisedText,
              f.status === "COMPLETED" && styles.amountRaisedTextFulfilled
            )}
          >
            {formatBountyAmount({
              amount: f.amountRaised.rsc,
              withPrecision: false,
            })}{" "}
            RSC
          </div>
          <div className={css(styles.goalText)}>
            raised of{" "}
            <ContentBadge
              contentType="closedBounty"
              bountyAmount={f.goalAmount.rsc}
              size={`small`}
              label={
                <div style={{ display: "flex", whiteSpace: "pre" }}>
                  <div style={{ flex: 1 }}>
                    {formatBountyAmount({
                      amount: f.goalAmount.rsc,
                      withPrecision: false,
                    })}{" "}
                    RSC
                  </div>
                </div>
              }
            />{" "}
            goal
          </div>
        </div>
        {f.status === "OPEN" && (
          <div className={css(styles.timeLeft)}>
            <FontAwesomeIcon
              style={{ fontSize: 14, marginRight: 5 }}
              icon={faClock}
            />
            {timeTo(f.endDate)} to go
          </div>
        )}
        {f.status === "COMPLETED" && (
          <div className={css(styles.fundraiseCompletedDetail)}>
            <FontAwesomeIcon
              style={{ fontSize: 14, marginRight: 5 }}
              icon={faCircleCheck}
            />
            Fundraise Completed
          </div>
        )}
        {f.status === "CLOSED" && (
          <div className={css(styles.fundraiseClosedDetail)}>
            <FontAwesomeIcon
              style={{ fontSize: 14, marginRight: 5 }}
              icon={faCircleX}
            />
            Fundraise Closed
          </div>
        )}
      </div>
      <div className={css(styles.barContainer)}>
        <div
          style={{
            width: `${barFillAmount}%`,
          }}
          className={css(
            styles.bar,
            f.status === "COMPLETED" && styles.barFulfilled,
            f.status === "CLOSED" && styles.barCancelled
          )}
        />
      </div>
      <div className={css(styles.footer)} onClick={(e) => e.stopPropagation()}>
        <FundraiseContributorsModal
          fundraiseId={f.id}
          totalContributors={f.contributors.total}
          triggerComponent={
            <div className={css(styles.supporters)}>
              <CommentAvatars
                people={f.contributors.top}
                spacing={f.contributors.total > 0 ? -20 : 0}
                withTooltip={false}
                showTotal={true}
                totalPeople={f.contributors.total}
                totalNoun="Supporter"
              />
            </div>
          }
        />
        {showSupportButton && f.status === "OPEN" && (
          <FundraiseContributeModal
            triggerComponent={
              <PermissionNotificationWrapper
                modalMessage="support this fundraise"
                loginRequired={true}
                hideRipples={true}
              >
                <Button
                  size="small"
                  type="primary"
                  customButtonStyle={styles.customButtonStyle}
                >
                  Support
                </Button>
              </PermissionNotificationWrapper>
            }
            fundraise={f}
            onUpdateFundraise={onUpdateFundraise}
          />
        )}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: "calc(100% - 32px)",
    borderRadius: 8,
    backgroundColor: colors.LIGHT_GRAY_BACKGROUND(),
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      gap: 12,
      marginBottom: 12,
    },
  },

  amountRaised: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
  },
  rscIcon: {
    marginRight: 6,
    transform: "translateY(2.5px)",
  },
  amountRaisedText: {
    fontSize: 18,
    fontWeight: 500,
    color: colors.ORANGE_LIGHT2(),
    whiteSpace: "nowrap",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 16,
    },
  },
  amountRaisedTextFulfilled: {
    color: colors.NEW_GREEN(),
  },
  goalText: {
    fontSize: 16,
    fontWeight: 400,
    color: colors.MEDIUM_GREY(),
    marginLeft: 5,
    display: "flex",
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    whiteSpace: "nowrap",
  },
  timeLeft: {
    fontSize: 14,
    fontWeight: 400,
    color: colors.MEDIUM_GREY2(),
    whiteSpace: "nowrap",
  },
  fundraiseCompletedDetail: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.NEW_GREEN(),
    whiteSpace: "nowrap",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  fundraiseClosedDetail: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.MEDIUM_GREY2(0.8),
    whiteSpace: "nowrap",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  barContainer: {
    width: "100%",
    borderRadius: 4,
    height: 8,
    backgroundColor: colors.LIGHT_GREY(),
  },
  bar: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: colors.ORANGE_LIGHT2(),
  },
  barFulfilled: {
    backgroundColor: colors.NEW_GREEN(),
  },
  barCancelled: {
    backgroundColor: colors.GREY(),
  },

  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  supporters: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    color: colors.MEDIUM_GREY2(),
    ":hover": {
      cursor: "pointer",
    },
  },
  customButtonStyle: {
    color: colors.WHITE(),
    border: "none",
    minWidth: 100,
    backgroundColor: colors.ORANGE_LIGHT2(),
    ":hover": {
      backgroundColor: colors.ORANGE_LIGHT2(0.8),
    },
  },
});

export default FundraiseCard;
