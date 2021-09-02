import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import Button from "../Form/Button";
import { Fragment, ReactElement, useMemo } from "react";
import { ID } from "../../config/types/root_types";
import { isNullOrUndefined } from "../../config/utils/nullchecks";
import { useRouter } from "next/router";

type Props = {
  auth: any;
  currentAuthorId: ID;
  hubState: any;
  isLoggedIn: Boolean;
};

function FeedBlurWithButton(
  props: Props
): ReactElement<typeof Fragment> | null {
  const { auth, currentAuthorId, hubState, isLoggedIn } = props;
  const router = useRouter();

  const isOnMyHubsTab = ["/my-hubs"].includes(router.pathname);
  const hasSubscribed = useMemo(
    (): Boolean => auth.authChecked && hubState.subscribedHubs.length > 0,
    [auth.authChecked, hubState.subscribedHubs]
  );

  return (!hasSubscribed || !isLoggedIn) && isOnMyHubsTab ? (
    <Fragment>
      <div className={css(styles.blur)} />
      <Button
        isLink={
          isLoggedIn
            ? {
                href: `/user/${currentAuthorId || ""}/onboard`,
                query: {
                  selectHubs: true,
                },
              }
            : {
                href: "/",
                linkAs: "/",
              }
        }
        hideRipples={true}
        label={isLoggedIn ? "Generate My Hubs" : "View All Hubs"}
        customButtonStyle={styles.allFeedButton}
      />
    </Fragment>
  ) : null;
}

const mapStateToProps = ({ auth, hubs }: any) => ({
  auth: auth,
  hubState: hubs,
  allHubs: hubs.hubs,
  isLoggedIn: auth.isLoggedIn,
  currentAuthorId:
    auth.user && auth.user.author_profile ? auth.user.author_profile.id : null,
});

export default connect(mapStateToProps)(FeedBlurWithButton);

const styles = StyleSheet.create({
  allFeedButton: {
    position: "absolute",
    bottom: 100,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 3,
    cursor: "pointer",
    boxSizing: "border-box",
    width: "unset",
    padding: "0px 15px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.14)",
    "@media only screen and (max-width: 415px)": {
      height: 50,
      width: 140,
      fontSize: 18,
    },
  },
  blur: {
    background:
      "linear-gradient(180deg, rgba(250, 250, 250, 0) 0%, #FCFCFC 86.38%)",
    height: "100%",
    position: "absolute",
    zIndex: 3,
    top: 0,
    width: "100%",
    pointerEvents: "none",
  },
});
