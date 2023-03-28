import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/pro-solid-svg-icons";
import { faFireAlt } from "@fortawesome/pro-duotone-svg-icons";
import { ReactElement } from "react";
import { css, StyleSheet } from "aphrodite";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";

import { useEffectNewFeatureShouldAlertUser } from "~/config/newFeature/useEffectNewFeature";
import { connect } from "react-redux";
import { postNewFeatureNotifiedToUser } from "~/config/newFeature/postNewFeatureNotified";
import { breakpoints } from "~/config/themes/screen";

function NewFeatureTooltip({
  featureName,
  auth = null,
  position = ["right", "bottom"],
  color = "blue",
}): ReactElement | null {
  const [shouldAlert, setShouldAlert] = useEffectNewFeatureShouldAlertUser({
    auth,
    featureName,
  });
  const normalizedFeatureName = featureName.toLocaleLowerCase();

  const handleDismiss = () => {
    window.localStorage.setItem(
      `feature_${normalizedFeatureName}_clicked`,
      "true"
    );

    setShouldAlert(false);
    postNewFeatureNotifiedToUser({ auth, featureName: normalizedFeatureName });
  };

  // const tooltipPos =
  //   (process.browser && window.innerWidth > breakpoints.small.int) ||
  //   position.length === 1
  //     ? position[0]
  //     : position[1];

  // Kobe: Turning this feature off temporarily because something broke with it.
  // It glitches out on page load
  return null;

  let html: ReactElement = <></>;
  if (normalizedFeatureName === "discussiontypes") {
    html = (
      <>
        <div className={css(styles.title)}>
          Contribution Types
          <span className={css(styles.new)}>
            <span className={css(styles.fireIcon)}>
              {<FontAwesomeIcon icon={faFireAlt}></FontAwesomeIcon>}
            </span>
            <span className={css(styles.newText)}>New</span>
          </span>
        </div>
        <div className={css(styles.desc)}>
          You can now choose different contribution types such as{" "}
          <span className={css(styles.bolded)}>Peer Review</span> and{" "}
          <span className={css(styles.bolded)}>Summary</span>. Give it a shot!
        </div>
        <div className={css(styles.btnContainer)}>
          <Button
            onClick={handleDismiss}
            label={`Okay`}
            size="small"
            customButtonStyle={styles.btn}
            customLabelStyle={[styles.btnLabel, colorStyles["btn_" + color]]}
          />
        </div>
      </>
    );
  }
  if (normalizedFeatureName === "bounty") {
    html = (
      <>
        <div className={css(styles.title)}>
          Bounties
          <span className={css(styles.new)}>
            <span className={css(styles.fireIcon)}>
              {<FontAwesomeIcon icon={faFireAlt}></FontAwesomeIcon>}
            </span>
            <span className={css(styles.newText)}>New</span>
          </span>
        </div>
        <div className={css(styles.desc)}>
          Bounties are now available. Incentivize others by offering up
          ResearchCoin to the best solution.
        </div>
        <div className={css(styles.btnContainer)}>
          <Button
            onClick={handleDismiss}
            label={`Okay`}
            size="small"
            customButtonStyle={styles.btn}
            customLabelStyle={[styles.btnLabel, colorStyles["btn_" + color]]}
          />
        </div>
      </>
    );
  }

  if (shouldAlert) {
    return (
      <div
        className={css(
          styles.tooltipContainer,
          styles["tooltipContainer_" + tooltipPos]
        )}
      >
        <span
          className={css(
            styles.caret,
            styles["caret_" + tooltipPos],
            colorStyles["caret_" + color]
          )}
        >
          {<FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon>}
        </span>
        <div className={css(styles.body, colorStyles["body_" + color])}>
          {html}
        </div>
      </div>
    );
  } else {
    return null;
  }
}

const colorStyles = StyleSheet.create({
  body_orange: {
    background: colors.ORANGE_DARK2(),
  },
  body_blue: {
    background: colors.NEW_BLUE(),
  },
  btn_orange: {
    color: colors.ORANGE_DARK2(),
  },
  btn_blue: {
    color: colors.NEW_BLUE(),
  },
  caret_blue: {
    color: colors.NEW_BLUE(),
  },
  caret_orange: {
    color: colors.ORANGE_DARK2(),
  },
});

const styles = StyleSheet.create({
  tooltipContainer: {
    position: "absolute",
    zIndex: 10,
  },
  tooltipContainer_right: {
    position: "absolute",
    right: -18,
    top: -11,
    transform: "translateX(100%)",
  },
  tooltipContainer_bottom: {
    position: "absolute",
    left: 0,
    bottom: -18,
    transform: "translateY(100%)",
  },
  caret: {
    // color: colors.NEW_BLUE(),
    position: "absolute",
  },
  caret_right: {
    fontSize: 25,
    left: -9,
    top: 10,
  },
  caret_bottom: {
    fontSize: 25,
    left: 15,
    top: -18,
    transform: "rotate(90deg)",
  },
  new: {
    display: "flex",
    alignItems: "center",
  },
  newText: {
    fontWeight: 500,
    fontSize: 14,
  },
  fireIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    justifyContent: "space-between",
    display: "flex",
  },
  body: {
    width: 350,
    fontWeight: 400,
    fontSize: 14,
    // background: colors.NEW_BLUE(),
    borderRadius: 4,
    color: "white",
    padding: "10px 15px",
    boxSizing: "border-box",
    boxShadow:
      "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: 320,
    },
  },
  bolded: {
    fontWeight: 600,
  },
  desc: {
    lineHeight: "22px",
  },
  btnContainer: {
    display: "flex",
    marginTop: 10,
  },
  btn: {
    background: "white",
    borderRadius: 2,
    width: "auto",
    height: "auto",
    padding: "7px 15px",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      minHeight: "unset",
      minWidth: "unset",
      height: "auto",
      width: "auto",
      padding: "9px 19px",
    },
  },
  btnLabel: {
    // color: colors.NEW_BLUE(),
    fontWeight: 500,
    fontSize: 16,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(NewFeatureTooltip);
