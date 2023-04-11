import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";
import Bounty from "~/config/types/bounty";
import BountyModal from "./BountyModal";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import IconButton from "../Icons/IconButton";
import { ID, parseUser } from "~/config/types/root_types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux";
import { ModalActions } from "~/redux/modals";
import { isEmpty } from "~/config/utils/nullchecks";

type Args = {
  withPreview: boolean;
  onBountyAdd: Function;
  relatedItemId: ID,
  relatedItemContentType: string,
  children: any,
  originalBounty: Bounty,
}

function CreateBountyBtn({
  withPreview = false,
  onBountyAdd,
  relatedItemId,
  relatedItemContentType,
  originalBounty,
  children
}: Args): ReactElement {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = useSelector((state: RootState) => state.auth);
  const isLoggedIn = auth.authChecked && auth.isLoggedIn;

  return (
    <div
      className={css(styles.createBountyBtn)}
      onClick={() => {
        if (!isLoggedIn) {
          dispatch(ModalActions.openLoginModal(true, "Please Sign in to continue."))
        }
      }}>
      {/* @ts-ignore */}
      <BountyModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        handleBountyAdded={(bounty) => {
          onBountyAdd(bounty);
        }}
        relatedItemId={relatedItemId}
        relatedItemContentType={relatedItemContentType}
        withPreview={withPreview}
        originalBounty={originalBounty}
      />
      {children ? (
        <div onClick={() => {
          isLoggedIn && setIsModalOpen(true);
        }}>{children}</div>
      ) : (
        <IconButton
          onClick={() => {
            isLoggedIn && setIsModalOpen(true);
          }}
        >
          <div>
            <span className={css(styles.bountyTextContainer)}>
              <span
                data-tip={""}
                data-for="bountyTooltip"
                className={css(styles.addBountyLabel)}
              >
                <div className={css(styles.addBounty)}>
                  <span className={css(styles.bountyIcon)}>
                    {/* @ts-ignore */}
                    <ResearchCoinIcon width={24} height={22} version={3} />
                  </span>
                  Add Bounty
                </div>
              </span>
            </span>
          </div>
        </IconButton>
      )}
    </div>
  );
}


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
    columnGap: "3px"
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
    color: colors.ORANGE_DARK2(),
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
    background: "unset",
    padding: "unset",
    fontFamily: "Roboto",
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    columnGap: "5px",
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
