import { css, StyleSheet } from "aphrodite";
import ALink from "../ALink";
import Bounty, { BOUNTY_STATUS } from "~/config/types/bounty";
import colors from "~/config/themes/colors";
import numeral from "numeral";
import ResearchHubPopover from "../ResearchHubPopover";
import { useState } from "react";
import BountyModal from "./BountyModal";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import { useRouter } from "next/router";
import icons from "~/config/themes/icons";
import AuthorFacePile from "../shared/AuthorFacePile";
import { breakpoints } from "~/config/themes/screen";

type BountyAlertParams = {
  bounty: Bounty;
  allBounties: [Bounty];
  bountyType: string;
  bountyText?: string;
  onBountyAdd?: Function;
  isOriginalPoster?: boolean;
  post?: any; // TODO: make a post type
  currentUser?: any; //TODO: make an any type
  onBountyRemove?: Function;
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
  onBountyRemove
}: BountyAlertParams) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

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

  const userBounty =
    allBounties &&
    allBounties.length &&
    allBounties.find((bounty) => bounty?.createdBy?.id === currentUser?.id);

  const showPlural = bountyType !== "question" && allBounties.length > 1;
  const showContributeBounty =
    !isOriginalPoster && !userBounty && bountyType === "question";

  const _buildTwitterUrl = ({ bountyText, amount }) => {

    let baseTwitterUrl = "https://twitter.com/intent/tweet?utm_campaign=twitter_bounty"
    if (!(bountyText && amount))  {
      return baseTwitterUrl;
    }

    const twitterPreText = `Open bounty on Research Hub for ${amount} RSC:`;

    const link = process.browser
      ? window.location.protocol + "//" + process.env.HOST + router.asPath
      : "";

    const twitterBountyPreview = `\n\n"${bountyText.slice(
      0,
      249 - twitterPreText.length - link.length
    )}"\n\n${link}?utm_campaign=twitter_bounty`;

    return `${baseTwitterUrl}&text=${encodeURI(
      twitterPreText + twitterBountyPreview
    )}`;
  };

  const twitterUrl = _buildTwitterUrl({
    bountyText,
    amount,
  });

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
      <div className={css(styles.wrapper)}>
        <div className={css(styles.avatars)}>
          <AuthorFacePile
            overrideStyle={styles.facePileOverride}
            margin={-10}
            horizontal={true}
            authorProfiles={allBounties.map((b) => b.createdBy?.authorProfile || b.created_by?.author_profile)}
          />
        </div>
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
        </div>
      </div>
      <div className={css(styles.actions)}>
        <a
          href={twitterUrl}
          data-size="large"
          target="_blank"
          className={css(styles.share)}
        >
          {icons.twitter}
        </a>
        {userBounty ? (
          <div
            className={css(styles.action, styles.closeBounty)}
            onClick={() => {
              Bounty.closeBountyAPI({ bounty: userBounty }).then((bounties) => {
                onBountyRemove && onBountyRemove(userBounty.id)
              });
            }}            
          >
            Close your bouty
          </div>
        ) : (
          <>
            {showContributeBounty && (
              <div
                className={css(styles.action, styles.contribute)}
                onClick={() => setIsModalOpen(true)}
              >
                Contribute
              </div>
            )}
            <div className={css(styles.action)}>Answer</div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  actions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginTop: 15,
    },
  },
  avatars: {
    display: "flex",
    marginRight: 20,
  },
  facePileOverride: {
    flexWrap: "unset",
  },
  action: {
    background: colors.NEW_BLUE(),
    cursor: "pointer",
    borderRadius: "4px",
    padding: "0 25px",
    color: "white",
    display: "flex",
    alignItems: "center",
    height: 40,
    border: `1px solid ${colors.NEW_BLUE()}`,
    whiteSpace: "nowrap",
    ":hover": {
      opacity: 0.8,
    },
  },
  contribute: {
    color: colors.NEW_BLUE(),
    fontWeight: 500,
    border: "unset",
    background: "unset",
    paddingLeft: 0,
  },
  share: {
    color: colors.NEW_BLUE(),
    fontSize: 20,
    marginRight: 15,
    marginLeft: 15,
  },
  closeBounty: {
    background: "white",
    color: colors.NEW_BLUE(),
    border: `1px solid ${colors.NEW_BLUE()}`,
  },
  bountyAlert: {
    background: "rgba(242, 251, 243, 0.3)",
    borderRadius: "4px",
    padding: "15px 25px",
    color: colors.MEDIUM_GREY2(),
    fontSize: 16,
    border: `1px solid ${colors.NEW_GREEN()}`,
    lineHeight: "22px",
    display: "flex",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
    },
  },
  wrapper: {
    display: "flex",
  },
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
