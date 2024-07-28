import { css, StyleSheet } from "aphrodite";
import { FullAuthorProfile } from "../lib/types";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import colors from "~/config/themes/colors";
import { useState } from "react";
import { RootState } from "~/redux";
import { useDismissableFeature } from "~/config/hooks/useDismissableFeature";
import { useSelector } from "react-redux";

const WelcomeToProfileBanner = ({
  profile,
}: {
  profile: FullAuthorProfile;
}) => {
  const auth = useSelector((state: RootState) => state.auth);
  const {
    isDismissed,
    dismissFeature,
    dismissStatus
  } = useDismissableFeature({ auth, featureName: "research-rewards-banner" })


  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || dismissStatus === "unchecked" || (dismissStatus === "checked" && isDismissed)) {
    return null;
  }

  return (
    <div className={css(styles.rootWrapper)}>
      <div>
        <div className={css(styles.header)}>
          <ResearchCoinIcon version={4} color={colors.NEW_GREEN()} />
          Healthy Research Rewards
        </div>
        <div className={css(styles.descriptionWrapper)}>
          ResearchHub is incentivizing healthy research behavior. At this time,
          first authors of open access papers are eligible for rewards. Visit
          the publications tab to view your eligible publications.
        </div>
        <div
          className={css(styles.dismissBtn)}
          onClick={() => {
            setIsVisible(false)
            dismissFeature();
          }}
        >
          Got it
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  dismissBtn: {
    cursor: "pointer",
    marginTop: 10,
    color: colors.NEW_BLUE(),
  },
  rootWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    border: "1px solid rgb(10 174 66)",
    background: "rgb(243 255 247)",
    padding: 20,
  },
  btn: {
    fontWeight: 400,
    fontSize: 14,
    padding: "5px 15px",
    borderRadius: 6,
  },
  header: {
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    gap: 10,
    color: "rgb(10 174 66)",
  },
  descriptionWrapper: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    marginTop: 10,
    color: colors.BLACK(0.9),
  },
  rscIcon: {},
  badge: {
    borderRadius: "6px",
    fontWeight: 400,
    marginLeft: 5,
    fontSize: 14,
  },
  rscTextWrapper: {
    display: "inline-flex",
    alignItems: "center",
  },
});

export default WelcomeToProfileBanner;
