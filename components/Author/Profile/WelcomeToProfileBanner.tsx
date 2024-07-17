import { css, StyleSheet } from "aphrodite";
import { FullAuthorProfile } from "../lib/types";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import colors from "~/config/themes/colors";
import { useState } from "react";

const WelcomeToProfileBanner = ({ profile }: { profile: FullAuthorProfile }) => {

  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null;
  }

  return (
    <div className={css(styles.rootWrapper)}>
      <div>
        <div className={css(styles.header)}>
          <ResearchCoinIcon version={4} color="#999999" />
          View your rewards
        </div>
        <div className={css(styles.descriptionWrapper)}>
          ResearchHub is incentivizing healthy research behavior. At this time, first authors of open access papers are eligible for rewards. Visit the publications tab to view eligible publications.
        </div>
        <div className={css(styles.dismissBtn)} onClick={() => setIsVisible(false)}>Got it</div>
      </div>
    </div>
  )
}

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
    // border: `1px solid ${colors.NEW_BLUE()}`,
    background: "rgb(240, 240, 240)",
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
    color: colors.BLACK(),
  },
  descriptionWrapper: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    marginTop: 10,
  },
  rscIcon: {

  },
  badge: {
    borderRadius: "6px",
    fontWeight: 400,
    marginLeft: 5,
    fontSize: 14,
  },
  rscTextWrapper: {
    display: "inline-flex",
    alignItems: "center",
  }
})

export default WelcomeToProfileBanner;