import { AuthActions } from "~/redux/auth";
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
import icons from "~/config/themes/icons";
import RootLeftSidebarSliderItem, {
  Props as RootLeftSidebarSliderItemProps,
} from "./sidebar_items/RootLeftSidebarSliderItem";
import { breakpoints } from "~/config/themes/screen";

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
    <div>
      {sliderMainItems}
      <div className={css(styles.leftSidebarSliderFooter)}>
        <div className={css(styles.leftSidebarSliderFooterItemsTop)}>
          <ALink
            href="about"
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
          {isLoggedIn ? (
            <div
              className={css(styles.leftSidebarSliderFooterTxtItem)}
              onClick={(event: SyntheticEvent): void => {
                event.preventDefault();
                signout({ walletLink });
              }}
            >
              {"Sign out"}
            </div>
          ) : (
            <div className={css(styles.loginButtonWrap)}>
              <GoogleLoginButton
                styles={[styles.loginButton]}
                iconStyle={styles.googleIcon}
                customLabel="Sign In"
                customLabelStyle={[styles.googleLabelMobile]}
                isLoggedIn
              />
            </div>
          )}
        </div>
        <div className={css(styles.footer)}>
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
  leftSidebarSliderFooter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
    height: "100%",
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
    marginRight: 14,
    ":hover": {
      color: colors.TEXT_GREY(1),
    },
  },
  leftSidebarSliderFooterItemsBottomRow: {
    alignItems: "center",
    display: "flex",
    height: 20,
    marginBottom: 20,
    justifyContent: "center",
    width: "100%",
  },
  leftSidebarSliderFooterItemsTop: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 24,
  },
  footer: {
    marginTop: "auto",
    position: "fixed",
    bottom: 0,
    left: 20,
  },
  leftSidebarSliderFooterIcon: {
    fontSize: 18,
    marginRight: 32,
    display: "block",
  },
  mediumIconOverride: { fontSize: 18, marginTop: "-4px" },
  loginButtonWrap: { width: "100%", display: "flex", justifyContent: "center" },
  loginButton: {
    height: "unset",
    justifyContent: "center",
    marginBottom: 16,
    minWidth: 136,
    padding: 8,
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "95%",
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
