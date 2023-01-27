import { css, StyleSheet } from "aphrodite";
import ALink from "../ALink";
import Bounty, { BOUNTY_STATUS } from "~/config/types/bounty";
import colors, { bountyColors } from "~/config/themes/colors";
import numeral from "numeral";
import ResearchHubPopover from "../ResearchHubPopover";
import { useState } from "react";
import BountyModal from "./BountyModal";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import { useRouter } from "next/router";
import AuthorFacePile from "../shared/AuthorFacePile";
import { breakpoints } from "~/config/themes/screen";
import ShareDropdown from "../ShareDropdown";
import buildTwitterUrl from "./utils/buildTwitterUrl";
import InviteButton from "~/components/Referral/InviteButton";
import icons from "~/config/themes/icons";
import CoinStackIcon from "../Icons/CoinStackIcon";
import { UnifiedDocument } from "~/config/types/root_types";
import AwardBountyModal from "./AwardBountyModal";
import { connect } from "react-redux";

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
  unifiedDocument: UnifiedDocument;
  threads: [any];
  documentType: string;
  setHasBounties: (boolean) => void;
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
  setHasBounties,
  onBountyRemove,
  unifiedDocument,
  threads,
  documentType,
  auth,
}: BountyAlertParams) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAwardBountyModalOpen, setIsAwardBountyModalOpen] = useState(false);
  const router = useRouter();

  let timeRemaining, createdBy, status;
  allBounties.sort((a, b) => {
    return a.id - b.id;
  });

  let amount = 0;
  let awardAmount = amount;

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
      if (router.pathname.includes("/paper/") && auth.isLoggedIn) {
        if (
          bounty?.created_by?.author_profile?.id ===
          auth?.user?.author_profile?.id
        ) {
          awardAmount = parseFloat(bounty.amount);
        }
      }
      amount += bounty.status === "OPEN" ? parseFloat(bounty.amount) : 0;
    });
    status = firstBounty.status;

    if (firstBounty.timeRemainingInDays < 0) {
      return null;
    }
  }

  if (!bounty && !allBounties.length) {
    return null;
  }

  const userBounty =
    allBounties &&
    allBounties.length &&
    allBounties.find((bounty) => {
      // These various conditions are meant to cover various types a bounty can take.
      // Sometimes bounty is "any" and other times it is a proper "Bounty" object.
      // This should be rewritten to ensure bounties referenced here are always proper Bounty objects.
      if (!currentUser) {
        return null;
      } else if (
        bounty?.created_by &&
        bounty?.created_by?.author_profile?.id ===
          currentUser.author_profile?.id
      ) {
        return bounty;
      } else if (bounty?.createdBy && bounty.createdBy.id === currentUser.id) {
        return bounty;
      }
    });

  const showPlural = bountyType !== "question" && allBounties.length > 1;
  const showContributeBounty =
    !isOriginalPoster && !userBounty && bountyType === "question";

  const _handleShareClick = (selectedOpt: any) => {
    if (selectedOpt.value === "twitter") {
      const twitterUrl = buildTwitterUrl({
        isBountyCreator: Boolean(userBounty),
        bountyText: bountyType === "question" ? post.title : bountyText,
        bountyAmount: amount,
        hubs: post?.hubs,
      });
      return window.open(twitterUrl, "_blank");
    } else if (selectedOpt.value === "linkedin") {
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`;
      return window.open(url, "_blank");
    }
  };

  const answerThreads = threads?.filter((thread) => {
    return router.pathname.includes("paper")
      ? thread
      : thread?.data?.discussion_post_type === "ANSWER";
  });

  answerThreads?.sort((thread1, thread2) => {
    return thread2.data.score - thread1.data.score;
  });

  return (
    <div className={css(styles.bountyAlert)}>
      <BountyModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        handleBountyAdded={(bounty) => {
          onBountyAdd(bounty);
        }}
        isOriginalPoster={Boolean(isOriginalPoster)}
        addBtnLabel={isOriginalPoster ? "Add Bounty" : "Contribute to Bounty"}
        withPreview={false}
        bountyText={bountyText}
        postId={post?.id}
        unifiedDocId={post?.unifiedDocument?.id}
        postSlug={post?.unifiedDocument?.document?.slug}
      />
      <AwardBountyModal
        isOpen={isAwardBountyModalOpen}
        threads={answerThreads}
        bountyAmount={awardAmount}
        setHasBounties={setHasBounties}
        allBounties={allBounties}
        documentType={documentType}
        closeModal={() => setIsAwardBountyModalOpen(false)}
      />
      <div className={css(styles.wrapper)}>
        <div className={css(styles.avatars)}>
          <AuthorFacePile
            overrideStyle={styles.facePileOverride}
            margin={-10}
            horizontal={true}
            authorProfiles={allBounties.map(
              (b) => b.createdBy?.authorProfile || b.created_by?.author_profile
            )}
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
            <span>Anonymous</span>
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
        {userBounty ? (
          <div
            className={css(styles.action, styles.closeBounty)}
            onClick={() => {
              setIsAwardBountyModalOpen(true);
            }}
          >
            <img
              className={css(styles.actionIcon)}
              src="/static/icons/award-rsc-bounty.png"
            ></img>
            Award Bounty
          </div>
        ) : (
          <>
            <div
              className={css(styles.action)}
              onClick={() => {
                const scrollToEl = document.querySelector("#comments");
                window.scrollTo({
                  // @ts-ignore
                  top: scrollToEl.offsetTop,
                  behavior: "smooth",
                });
              }}
            >
              <span className={css(styles.actionIcon)}>
                {icons.commentDots}
              </span>
              Answer
            </div>
            {showContributeBounty && (
              <div
                className={css(styles.action)}
                onClick={() => setIsModalOpen(true)}
              >
                <span className={css(styles.actionIcon)}>
                  <CoinStackIcon />
                </span>
                Contribute
              </div>
            )}
          </>
        )}
        <div className={css(styles.action, styles.shareAction)}>
          <ShareDropdown handleClick={_handleShareClick}>
            <span className={css(styles.actionIcon)}>{icons.shareRegular}</span>
            Share
          </ShareDropdown>
        </div>
        <div className={css(styles.action, styles.inviteAction)}>
          <InviteButton context="bounty" unifiedDocument={unifiedDocument}>
            <span>
              <span className={css(styles.actionIcon, styles.inviteIcon)}>
                <ResearchCoinIcon
                  width={16}
                  height={16}
                  overrideStyle={styles.rscIcon}
                />
              </span>
              {"Invite and Earn"}
            </span>
          </InviteButton>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  actions: {
    display: "flex",
    alignItems: "flex-start",
    columnGap: "20px",
    // justifyContent: "center",
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
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    ":hover": {
      opacity: 0.8,
    },
  },
  shareAction: {},
  actionIcon: {
    marginRight: 5,
    fontSize: 16,
    height: 20,
  },
  inviteIcon: {
    verticalAlign: "text-top",
  },
  inviteAction: {
    background: bountyColors.BADGE_BACKGROUND,
    color: bountyColors.BADGE_TEXT,
    padding: `7px 8px 4px 4px`,
    display: "flex",
    alignItems: "center",
    borderRadius: "4px",
    marginTop: -6,
    ":hover": {
      color: bountyColors.BADGE_TEXT,
    },
  },
  contribute: {
    alignItems: "center",
    display: "flex",
    color: colors.NEW_BLUE(),
    border: `1px solid ${colors.NEW_BLUE()}`,
    fontWeight: 500,
    background: "unset",
    marginRight: 10,
    // paddingLeft: 0,
  },
  closeBounty: {
    color: colors.NEW_BLUE(),
  },
  bountyAlert: {
    userSelect: "none",
    boxShadow:
      "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
    // background: "rgba(242, 251, 243, 0.3)",
    borderRadius: "4px",
    padding: "12px 20px",
    color: colors.MEDIUM_GREY2(),
    fontSize: 16,
    // border: `1px solid ${colors.NEW_GREEN()}`,
    border: `1px solid ${colors.GREY_LINE()}`,
    lineHeight: "22px",
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    paddingBottom: 10,
    marginBottom: 15,
    borderBottom: `1px solid ${colors.GREY_LINE()}`,
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

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(BountyAlert);
