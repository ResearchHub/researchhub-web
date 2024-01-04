import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMedium,
  faDiscord,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { AuthActions } from "~/redux/auth";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { getLeftSidebarItemAttrs } from "./RootLeftSidebar";
import { ModalActions } from "~/redux/modals";
import { NullableString } from "~/config/types/root_types";
import { ReactElement, SyntheticEvent, useMemo, useState } from "react";
import { useRouter } from "next/router";
import ALink from "~/components/ALink";
import colors from "~/config/themes/colors";

import RHLogo from "../RHLogo";
import RootLeftSidebarSliderItem, {
  Props as RootLeftSidebarSliderItemProps,
} from "./sidebar_items/RootLeftSidebarSliderItem";
import NewPostButton from "~/components/NewPostButton";
import Login from "~/components/Login/Login";
import Button from "~/components/Form/Button";
import VerifiedBadge from "~/components/Verification/VerifiedBadge";
import VerificationModal from "~/components/Verification/VerificationModal";
import NewPostModal from "~/components/Modals/NewPostModal";

type Props = {
  isLoggedIn: boolean;
  openLoginModal: any /* redux */;
  signout: any /* redux */;
  walletLink: NullableString /* redux */;
};

function RootLeftSidebarSlider({
  isLoggedIn,
  openLoginModal,
  signout,
  walletLink,
}: Props): ReactElement {
  const currentUser = getCurrentUser();
  const router = useRouter();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const leftSidebarItemAttrs = useMemo(
    (): RootLeftSidebarSliderItemProps[] =>
      getLeftSidebarItemAttrs({
        currentUser,
        isMinimized: false,
        router,
        openLoginModal,
      }),
    [currentUser?.id, router.pathname]
  );

  const sliderMainItems = leftSidebarItemAttrs.map(
    (
      attrs: RootLeftSidebarSliderItemProps,
      ind: number
    ): ReactElement<typeof RootLeftSidebarSliderItem> => (
      <>
        {attrs.label === "Lab Notebook" && (
          <div className={css(styles.subheader)}>Tools</div>
        )}
        <RootLeftSidebarSliderItem key={`${attrs.label}-${ind}`} {...attrs} />
      </>
    )
  );

  return (
    <div className={css(styles.leftSidebarSliderBody)}>
      <div className={css(styles.leftSidebarSliderHeader)}>
        <RHLogo withText iconStyle={styles.rhLogoSlider} />
      </div>
      <NewPostModal />
      {isLoggedIn && (
        <div className={css(styles.newPostButtonContainer)}>
          <NewPostButton customButtonStyle={styles.newPostButtonCustom} />
        </div>
      )}
      {sliderMainItems}
      <div className={css(styles.leftSidebarSliderFooter)}>
        <div className={css(styles.subheader)}>Resources</div>
        <div className={css(styles.leftSidebarSliderFooterItemsTop)}>
          {/* {isLoggedIn && (
            <span
              className={css(styles.leftSidebarSliderFooterTxtItem)}
              onClick={(event: SyntheticEvent): void => {
                event.preventDefault();
                signout({ walletLink });
              }}
            >
              {"Sign out"}
            </span>
          )} */}
          <ALink
            href="https://docs.researchhub.com"
            target="_blank"
            overrideStyle={styles.leftSidebarSliderFooterTxtItem}
          >
            {"About"}
          </ALink>
          <ALink
            href="https://researchhub.foundation"
            overrideStyle={styles.leftSidebarSliderFooterTxtItem}
          >
            Community
          </ALink>
          <span className={css(styles.leftSidebarSliderFooterTxtItem)}>
            <VerificationModal
              isModalOpen={isVerificationModalOpen}
              handleModalClose={() => setIsVerificationModalOpen(false)}
            />
            <span
              className={css(styles.referralProgramItem)}
              onClick={() => setIsVerificationModalOpen(true)}
            >
              {"Verify Authorship"}
              <VerifiedBadge
                height={20}
                width={20}
                variation="grey"
                showTooltipOnHover={false}
              />
            </span>
          </span>
          <ALink
            href="/leaderboard/users"
            overrideStyle={styles.leftSidebarSliderFooterTxtItem}
          >
            Leaderboard
          </ALink>
          <ALink
            href="https://www.notion.so/Working-at-ResearchHub-6e0089f0e234407389eb889d342e5049"
            overrideStyle={styles.leftSidebarSliderFooterTxtItem}
          >
            {"Jobs"}
          </ALink>
        </div>
        <div className={css(styles.leftSidebarSliderFooterBottom)}>
          <div
            className={css(styles.leftSidebarSliderFooterItemsBottomRow)}
            style={{ marginLeft: "-4px !important" }}
          >
            <ALink
              href="https://x.com/researchhub"
              overrideStyle={styles.leftSidebarSliderFooterIcon}
              target="__blank"
            >
              {<FontAwesomeIcon icon={faXTwitter}></FontAwesomeIcon>}
            </ALink>
            <ALink
              href="https://discord.com/invite/ZcCYgcnUp5"
              overrideStyle={styles.leftSidebarSliderFooterIcon}
              target="__blank"
            >
              {<FontAwesomeIcon icon={faDiscord}></FontAwesomeIcon>}
            </ALink>
            <ALink
              href="https://medium.com/researchhub"
              overrideStyle={
                (styles.leftSidebarSliderFooterIcon, styles.mediumIconOverride)
              }
              target="__blank"
            >
              {<FontAwesomeIcon icon={faMedium}></FontAwesomeIcon>}
            </ALink>
          </div>
          <div className={css(styles.leftSidebarSliderFooterItemsBottomRow)}>
            <ALink
              href="/about/tos"
              overrideStyle={styles.leftSidebarSliderFooterBotItem}
            >
              {"Terms"}
            </ALink>
            <ALink
              href="/about/privacy"
              overrideStyle={styles.leftSidebarSliderFooterBotItem}
            >
              {"Privacy"}
            </ALink>
            <ALink
              href="https://researchhub.notion.site/ResearchHub-a2a87270ebcf43ffb4b6050e3b766ba0"
              overrideStyle={styles.leftSidebarSliderFooterBotItem}
            >
              {"Help"}
            </ALink>
          </div>
          {isLoggedIn && (
            <div className={css(styles.signOutButtonContainer)}>
              <Button
                size="med"
                label="Sign Out"
                variant="outlined"
                fullWidth
                hideRipples={true}
                customButtonStyle={styles.signOutButtonStyle}
                onClick={(event: SyntheticEvent): void => {
                  event.preventDefault();
                  signout({ walletLink });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  leftSidebarSliderBody: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  leftSidebarSliderHeader: {
    display: "flex",
    width: "100%",
    marginBottom: 32,
  },
  leftSidebarSliderFooter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
    height: "100%",
    width: "100%",
  },
  leftSidebarSliderFooterTxtItem: {
    color: colors.TEXT_GREY(1),
    fontSize: 16,
    fontWeight: 400,
    textDecoration: "none",
    margin: "0 0 16px",
    ":hover": {
      color: colors.TEXT_GREY(1),
    },
  },
  leftSidebarSliderFooterBotItem: {
    color: colors.TEXT_GREY(1),
    textAlign: "center",
    fontSize: 14,
    ":hover": {
      color: colors.TEXT_GREY(1),
    },
  },
  leftSidebarSliderFooterItemsBottomRow: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 16,
    width: "100%",
  },
  leftSidebarSliderFooterItemsTop: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 12,
    paddingBottom: 16,
  },
  leftSidebarSliderFooterBottom: {
    marginTop: "auto",
    // position: "fixed",
    bottom: 0,
    width: "100%",
    left: 0,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  leftSidebarSliderFooterIcon: {
    fontSize: 18,
    display: "block",
  },
  mediumIconOverride: { fontSize: 18, marginTop: "-4px" },
  newPostButtonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginBottom: 16,
  },
  newPostButtonCustom: {
    height: 40,
    width: "100%",
  },
  loginButtonWrap: {
    width: "100%",
    display: "flex",
    marginBottom: 16,
  },
  loginButton: {
    height: "unset",
    justifyContent: "center",
    marginBottom: 16,
    minWidth: 172,
    padding: 8,
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "95%",
      minWidth: 172,
    },
  },
  googleIcon: {
    width: 25,
    height: 25,
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    borderRadius: "50%",
  },
  googleLabelMobile: {
    fontVariant: "small-caps",
    fontSize: 14,
    letterSpacing: 0.7,
    color: "#fff",
  },
  referralProgramItem: {
    display: "flex",
    alignItems: "center",
    columnGap: "6px",
    cursor: "pointer",
  },
  rhLogoSlider: { width: 148 },
  subheader: {
    borderTop: `1px solid ${colors.GREY_BORDER}`,
    marginTop: 8,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.LIGHT_GREY_TEXT,
    padding: "14px 0 8px",
  },
  signOutButtonContainer: {
    marginTop: 8,
    width: "100%",
    [`@media only screen and (max-height: ${breakpoints.mobile.str})`]: {
      paddingBottom: 24,
    },
  },
  signOutButtonStyle: {
    background: "transparent",
    backgroundColor: "transparent",
  },
});

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  walletLink: state.auth.walletLink,
});

const mapDispatchToProps = {
  openLoginModal: ModalActions.openLoginModal,
  signout: AuthActions.signout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootLeftSidebarSlider);
