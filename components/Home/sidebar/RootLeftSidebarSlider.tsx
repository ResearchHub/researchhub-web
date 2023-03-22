import { AuthActions } from "~/redux/auth";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { getLeftSidebarItemAttrs } from "./RootLeftSidebar";
import { ModalActions } from "~/redux/modals";
import { NullableString } from "~/config/types/root_types";
import { ReactElement, SyntheticEvent, useMemo } from "react";
import { useRouter } from "next/router";
import ALink from "~/components/ALink";
import colors from "~/config/themes/colors";
import GoogleLoginButton from "~/components/GoogleLoginButton";

import RHLogo from "../RHLogo";
import RootLeftSidebarSliderItem, {
  Props as RootLeftSidebarSliderItemProps,
} from "./sidebar_items/RootLeftSidebarSliderItem";
import InviteButton from "~/components/Referral/InviteButton";
import NewPostButton from "~/components/NewPostButton";
import Login from "~/components/Login/Login";
import Button from "~/components/Form/Button";

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
      <RootLeftSidebarSliderItem key={`${attrs.label}-${ind}`} {...attrs} />
    )
  );

  return (
    <div className={css(styles.leftSidebarSliderBody)}>
      <div className={css(styles.leftSidebarSliderHeader)}>
        <RHLogo withText iconStyle={styles.rhLogoSlider} />
      </div>
      {isLoggedIn ? (
        <NewPostButton customButtonStyle={styles.newPostButtonCustom} />
      ) : (
        <div className={css(styles.loginButtonWrap)}>
          <Login>
            <Button size="med" label="Log in" fullWidth hideRipples={true} />
          </Login>
        </div>
      )}
      {sliderMainItems}
      <div className={css(styles.leftSidebarSliderFooter)}>
        <div className={css(styles.leftSidebarSliderFooterItemsTop)}>
          {isLoggedIn && (
            <span
              className={css(styles.leftSidebarSliderFooterTxtItem)}
              onClick={(event: SyntheticEvent): void => {
                event.preventDefault();
                signout({ walletLink });
              }}
            >
              {"Sign out"}
            </span>
          )}
          <span className={css(styles.leftSidebarSliderFooterTxtItem)}>
            <InviteButton context="referral">
              <span className={css(styles.referralProgramItem)}>
                {"Invite"}
              </span>
            </InviteButton>
          </span>
          <ALink
            href="https://docs.researchhub.com"
            target="_blank"
            overrideStyle={styles.leftSidebarSliderFooterTxtItem}
          >
            {"About"}
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
              href="https://twitter.com/researchhub"
              overrideStyle={styles.leftSidebarSliderFooterIcon}
              target="__blank"
            >
              {icons.twitter}
            </ALink>
            <ALink
              href="https://discord.com/invite/ZcCYgcnUp5"
              overrideStyle={styles.leftSidebarSliderFooterIcon}
              target="__blank"
            >
              {icons.discord}
            </ALink>
            <ALink
              href="https://medium.com/researchhub"
              overrideStyle={
                (styles.leftSidebarSliderFooterIcon, styles.mediumIconOverride)
              }
              target="__blank"
            >
              {icons.medium}
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
    fontSize: 18,
    fontWeight: 400,
    textDecoration: "none",
    margin: "0 0 18px",
    ":hover": {
      color: colors.TEXT_GREY(1),
    },
  },
  leftSidebarSliderFooterBotItem: {
    color: colors.TEXT_GREY(1),
    fontSize: 14,
    ":hover": {
      color: colors.TEXT_GREY(1),
    },
  },
  leftSidebarSliderFooterItemsBottomRow: {
    alignItems: "center",
    display: "flex",
    height: 20,
    justifyContent: "space-around",
    marginBottom: 20,
    width: 180,
  },
  leftSidebarSliderFooterItemsTop: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 24,
  },
  leftSidebarSliderFooterBottom: {
    marginTop: "auto",
    position: "fixed",
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
  newPostButtonCustom: {
    marginBottom: 25,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      height: 40,
      width: "100%",
    },
  },
  loginButtonWrap: {
    width: "100%",
    display: "flex",
    marginBottom: 25,
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
    // color: colors.ORANGE_DARK2(),
  },
  rhLogoSlider: { width: 148 },
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
