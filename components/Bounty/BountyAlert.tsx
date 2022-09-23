import { css, StyleSheet } from "aphrodite";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import ALink from "../ALink";
import Bounty, { BOUNTY_STATUS } from "~/config/types/bounty";
import colors from "~/config/themes/colors";
import numeral from "numeral";
import ResearchHubPopover from "../ResearchHubPopover";
import { useState } from "react";
import BountyModal from "./BountyModal";

type BountyAlertParams = {
  bounty: Bounty;
  allBounties: [Bounty];
  bountyType: string;
  bountyText?: string;
  onBountyAdd?: Function;
  isOriginalPoster?: boolean;
  post?: any; // TODO: make a post type
  currentUser?: any; //TODO: make an any type
};

const BountyAlert = ({
  bounty,
  allBounties,
  bountyType,
  onBountyAdd,
  isOriginalPoster,
  bountyText,
  post,
  currentUser,
}: BountyAlertParams) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  let timeRemaining, createdBy, status;
  allBounties.sort((a, b) => {
    return a.id - b.id;
  });

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
    const firstBounty =
      bountyType === "question" ? allBounties[0] : new Bounty(allBounties[0]);
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

  const userHasBounty =
    allBounties &&
    allBounties.length &&
    allBounties.some((bounty) => bounty?.createdBy?.id === currentUser?.id);

  const showPlural = bountyType !== "question" && allBounties.length > 1;
  const showContributeBounty =
    !isOriginalPoster && !userHasBounty && bountyType === "question";

  return (
    <div className={css(styles.bountyAlert)}>
      <BountyModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        handleBountyAdded={(bounty) => {
          onBountyAdd(bounty);
        }}
        isOriginalPoster={isOriginalPoster}
        addBtnLabel={isOriginalPoster ? "Add Bounty" : "Contribute Bounty"}
        withPreview={false}
        bountyText={bountyText}
        postId={post?.id}
        unifiedDocId={post?.unifiedDocument?.id}
        postSlug={post?.unifiedDocument?.document?.slug}
      />
      <div className={css(styles.alertIcon)}></div>
      <div className={css(styles.alertDetails)}>
        <div>
          {showPlural ? (
            <span>A group of users</span>
          ) : createdBy ? (
            <ALink href={createdBy.authorProfile.url}>
              {createdBy?.authorProfile?.firstName}{" "}
              {createdBy?.authorProfile?.lastName}
            </ALink>
          ) : (
            <span>Deleted User</span>
          )}
          {bountyType === "question" && allBounties.length > 1 && (
            <span>
              {" "}
              <ResearchHubPopover
                isOpen={popoverOpen}
                popoverContent={
                  <div className={css(styles.popover)}>
                    {allBounties.map((bounty, index) => {
                      if (
                        bounty.createdBy?.authorProfile.id ===
                        createdBy.authorProfile.id
                      ) {
                        return null;
                      }

                      const curProfile = bounty.createdBy?.authorProfile;
                      return (
                        <ALink href={curProfile?.url}>
                          {curProfile?.firstName} {curProfile?.lastName}
                          {index < allBounties.length - 1 && ", "}
                        </ALink>
                      );
                    })}
                  </div>
                }
                positions={["bottom", "top"]}
                onClickOutside={(_event) => setPopoverOpen(false)}
                targetContent={
                  <span
                    onClick={() => {
                      setPopoverOpen(!popoverOpen);
                    }}
                    className={css(styles.groupLanguage)}
                  >
                    and others
                  </span>
                }
              />
            </span>
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
          for answers {showPlural ? "to their questions" : "to this question"}
          <span className={css(styles.divider)}>•</span>
          <span className={css(styles.expireTime)}>
            {showPlural ? "Bounties expire" : "Bounty expires"} in{" "}
            {timeRemaining}
          </span>
          <div>
            <ALink href="#comments" theme="green">
              Submit your answer{showContributeBounty ? "" : "."}
            </ALink>{" "}
            {showContributeBounty ? (
              <>
                or{" "}
                <span
                  className={css(styles.contribute)}
                  onClick={() => setIsModalOpen(true)}
                >
                  contribute to the bounty.
                </span>
              </>
            ) : null}
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
  contribute: {
    color: colors.NEW_GREEN(),
    fontWeight: 500,
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
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
  popover: {
    background: "#fff",
    padding: 16,
    borderRadius: 4,
    marginTop: 8,
    boxShadow: "0 5px 10px 0 #ddd",
  },
  groupLanguage: {
    // color: colors.NEW_BLUE(),
    // color: colors.BLACK(),
    fontWeight: 500,
    textDecoration: "underline",
    cursor: "pointer",
  },
  expireTime: {},
  submitText: {},
});

export default BountyAlert;
