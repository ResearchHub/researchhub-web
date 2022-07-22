import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { ResearchCoinIcon } from "~/config/themes/icons";
import numeral from "numeral";
import Bounty, { BOUNTY_STATUS } from "~/config/types/bounty";
import ALink from "../ALink";

type BountyAlertParams = {
  bounty: Bounty;
};

const BountyAlert = ({ bounty }: BountyAlertParams) => {
  if (!bounty) {
    return null;
  }
  const { timeRemaining, createdBy, amount, status } = bounty;

  if (status !== BOUNTY_STATUS.OPEN) {
    return null;
  }

  return (
    <div className={css(styles.bountyAlert)}>
      <div className={css(styles.alertIcon)}></div>
      <div className={css(styles.alertDetails)}>
        <div>
          {createdBy ? (
            <ALink href={createdBy.authorProfile.url}>
              {createdBy?.authorProfile?.firstName}{" "}
              {createdBy?.authorProfile?.lastName}
            </ALink>
          ) : (
            <span>Deleted User</span>
          )}
          {` `}is offering{" "}
          <span className={css(styles.strong)}>
            {numeral(amount).format("0.[0000000000]")} RSC
            <ResearchCoinIcon
              width={16}
              height={16}
              overrideStyle={styles.rscIcon}
            />
          </span>{" "}
          for answers to this question
          <span className={css(styles.divider)}>•</span>
          <span className={css(styles.expireTime)}>
            Bounty expires in {timeRemaining}
          </span>
          <div>
            <ALink href="#comments" theme="green">
              Submit your answer.
            </ALink>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  bountyAlert: {
    background: colors.LIGHTER_GREY(),
    borderRadius: "4px",
    padding: "15px 25px",
    color: colors.MEDIUM_GREY2(),
    fontSize: 16,
    border: `1px solid ${colors.NEW_GREEN()}`,
    lineHeight: "22px",
  },
  alertDetails: {},
  strong: {
    fontWeight: 500,
    color: colors.BLACK(),
  },
  alertIcon: {},
  rscIcon: {
    verticalAlign: "text-top",
    marginLeft: 5,
  },
  divider: {
    marginLeft: 7,
    marginRight: 7,
  },
  expireTime: {},
  submitText: {},
});

export default BountyAlert;
