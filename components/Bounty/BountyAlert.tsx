import { css, StyleSheet } from "aphrodite";
import { ResearchCoinIcon } from "~/config/themes/icons";
import ALink from "../ALink";
import Bounty, { BOUNTY_STATUS } from "~/config/types/bounty";
import colors from "~/config/themes/colors";
import numeral from "numeral";

type BountyAlertParams = {
  bounty: Bounty;
  allBounties: [Bounty];
};

const BountyAlert = ({ bounty, allBounties }: BountyAlertParams) => {
  let timeRemaining, createdBy, status;
  let amount = 0;
  if (bounty) {
    timeRemaining = bounty.timeRemaining;
    createdBy = bounty.createdBy;
    amount = bounty.amount;
    status = bounty.status;

    if (status !== BOUNTY_STATUS.OPEN && !allBounties.length) {
      return null;
    }
  } else if (allBounties.length) {
    const firstBounty = new Bounty(allBounties[0]);
    timeRemaining = firstBounty.timeRemaining;
    createdBy = firstBounty.createdBy;
    allBounties.forEach((bounty) => {
      amount += parseFloat(bounty.amount);
    });
    status = firstBounty.status;
  }

  if (!bounty && !allBounties.length) {
    return null;
  }

  const bountyQuestions = allBounties.length;

  return (
    <div className={css(styles.bountyAlert)}>
      <div className={css(styles.alertIcon)}></div>
      <div className={css(styles.alertDetails)}>
        <div>
          {allBounties.length > 1 ? (
            <span>A group of users</span>
          ) : createdBy ? (
            <ALink href={createdBy.authorProfile.url}>
              {createdBy?.authorProfile?.firstName}{" "}
              {createdBy?.authorProfile?.lastName}
            </ALink>
          ) : (
            <span>Deleted User</span>
          )}
          {` `}
          {allBounties.length > 1 ? "are" : "is"} offering{" "}
          <span className={css(styles.strong)}>
            {numeral(amount).format("0,0.[0000000000]")} RSC
            <ResearchCoinIcon
              width={16}
              height={16}
              overrideStyle={styles.rscIcon}
            />
          </span>{" "}
          for answers{" "}
          {allBounties.length > 1 ? "to their questions" : "to this question"}
          <span className={css(styles.divider)}>•</span>
          <span className={css(styles.expireTime)}>
            {allBounties.length > 1 ? "Bounties expire" : "Bounty expires"} in{" "}
            {timeRemaining}
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
