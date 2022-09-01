import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState, useEffect } from "react";
import { ResearchCoinIcon } from "~/config/themes/icons";
import { useAlert } from "react-alert";
import Bounty from "~/config/types/bounty";
import BountyModal from "./BountyModal";
import colors from "~/config/themes/colors";
import NewFeatureTooltip from "../Tooltips/NewFeatureTooltip";
import numeral from "numeral";
import ReactTooltip from "react-tooltip";
import { breakpoints } from "~/config/themes/screen";

function CreateBountyBtn({
  withPreview = false,
  onBountyAdd,
  bountyText,
  post,
  bounty,
  bounties,
  onBountyCancelled,
  isOriginalPoster,
  currentUser,
}): ReactElement {
  const alert = useAlert();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userHasBounty =
    bounties &&
    bounties.some((bounty) => bounty.createdBy.id === currentUser.id);

  const userBounty =
    bounties &&
    bounties.find((bounty) => bounty.createdBy.id === currentUser.id);

  const closeBounty = () => {
    alert.show({
      text: <div>Are you sure you want to close your bounty?</div>,
      buttonText: "Yes",
      onClick: () => {
        Bounty.closeBountyAPI({ bounty }).then(() => {
          onBountyCancelled && onBountyCancelled();
        });
      },
    });
  };

  return (
    <div className={css(styles.createBountyBtn)}>
      <ReactTooltip
        id="bountyTooltip"
        effect="solid"
        place="top"
        className={css(bountyTooltip.tooltipContainer)}
        delayShow={500}
      >
        <div className={css(bountyTooltip.bodyContainer)}>
          <div className={css(bountyTooltip.title)}>
            Add ResearchCoin Bounty
          </div>
          <div className={css(bountyTooltip.desc)}>
            <div>• Offer ResearchCoin to the best solution</div>
            <div>• Improves chances of quality submissions</div>
          </div>
        </div>
      </ReactTooltip>
      <BountyModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        handleBountyAdded={(bounty) => {
          onBountyAdd(bounty);
        }}
        withPreview={withPreview}
        bountyText={bountyText}
        postId={post?.id}
        unifiedDocId={post?.unifiedDocument?.id}
        postSlug={post?.unifiedDocument?.document?.slug}
      />
      <div
        className={css(styles.addBounty)}
        onClick={() => (userHasBounty ? closeBounty() : setIsModalOpen(true))}
      >
        <NewFeatureTooltip featureName={`bounty`} color={"orange"} />
        <div>
          <span className={css(styles.bountyTextContainer)}>
            {!userHasBounty && (
              <span className={css(styles.bountyIcon)}>
                {/* @ts-ignore */}
                <ResearchCoinIcon width={22} height={22} version={3} />
              </span>
            )}
            <span
              data-tip={""}
              data-for="bountyTooltip"
              className={css(styles.addBountyLabel)}
            >
              {userHasBounty ? (
                `Close your ${numeral(userBounty.amount).format(
                  "0,0.[0000000000]"
                )} RSC Bounty`
              ) : !isOriginalPoster && bounties && bounties.length ? (
                <span>
                  Contribute{" "}
                  <span className={css(styles.desktop)}>ResearchCoin </span>
                  <span className={css(styles.mobile)}>RSC </span> to the Bounty
                </span>
              ) : (
                <span>
                  Add <span className={css(styles.desktop)}>ResearchCoin </span>
                  <span className={css(styles.mobile)}>RSC </span>
                  Bounty
                </span>
              )}
            </span>
          </span>
        </div>
      </div>
      {/* )} */}
    </div>
  );
}

const popover = StyleSheet.create({
  container: {
    position: "absolute",
    display: "none",
    zIndex: 1,
    background: "white",
    padding: "15px 0 10px 0",
    border: `1px solid ${colors.GREY()}`,
    borderRadius: 4,
    marginTop: 5,
    width: 100,
    boxShadow:
      "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
  },
  open: {
    display: "block",
  },
});

const bountyTooltip = StyleSheet.create({
  tooltipContainer: {
    textAlign: "left",
    maxWidth: 300,
    padding: 15,
  },
  bodyContainer: {},
  title: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    lineHeight: "20px",
  },
});

const styles = StyleSheet.create({
  removeBounty: {
    color: colors.DARKER_GREY(),
    fontSize: 18,
    marginLeft: 10,
    ":hover": {
      color: colors.RED(),
      cursor: "pointer",
    },
  },
  createBountyBtn: {
    position: "relative",
  },
  check: {
    color: colors.NEW_GREEN(),
    marginRight: 5,
    fontSize: 18,
  },
  bountyTextContainer: {
    display: "flex",
    alignItems: "center",
    marginRight: 5,
  },
  desktop: {
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      display: "none",
    },
  },
  mobile: {
    [`@media only screen and (min-width: ${breakpoints.tablet.str})`]: {
      display: "none",
    },
  },
  addBounty: {
    // color: colors.ORANGE_DARK(),
    color: colors.ORANGE_DARK2(),
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    // borderBottom: `1px solid ${colors.ORANGE_DARK2()}`,
    // borderRadius: 4,
    // padding: "7px 16px",
    // paddingLeft: 0,
    ":hover": {
      // color: colors.ORANGE()
    },
    boxSizing: "border-box",
    // height: 42,
  },
  addBountyLabel: {
    // fontWeight: 500,
  },
  coinIcon: {
    height: 18,
    marginRight: 8,
  },
  bountyIcon: {
    fontSize: 14,
  },
  bountyPreview: {
    fontSize: 16,
  },
  bountyAmount: {
    background: colors.LIGHTER_GREY(),
    display: "flex",
    alignItems: "center",
    borderRadius: 4,
    padding: "3px 12px",
    boxSizing: "border-box",
    height: 34,
  },
  bountyAmountText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 500,
  },
});

export default CreateBountyBtn;
