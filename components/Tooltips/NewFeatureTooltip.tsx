import { ReactElement, useState, useEffect } from "react";
import { css, StyleSheet } from "aphrodite";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { useEffectNewFeatureShouldAlertUser } from "~/config/newFeature/useEffectNewFeature";
import { connect } from "react-redux";
import { postNewFeatureNotifiedToUser } from "~/config/newFeature/postNewFeatureNotified";

function NewFeatureTooltip({ featureName, auth = null, delay = 500, position = "right" }): ReactElement|null {

  const [shouldAlert, setShouldAlert] = useEffectNewFeatureShouldAlertUser({ auth, featureName })
  const normalizedFeatureName = featureName.toLocaleLowerCase();

  const handleDismiss = () => {
    window.localStorage.setItem(
      `feature_${normalizedFeatureName}_clicked`, "true"
    );

    setShouldAlert(false);    
    postNewFeatureNotifiedToUser({ auth, featureName: normalizedFeatureName })    
  }

  let html;
  if (normalizedFeatureName === "discussiontypes" ) {
    html = (
      <div className={css(styles.body)}>
        <span className={css(styles.caret)}>{icons.caretLeft}</span>
        <div className={css(styles.title)}>
          Discussion Types
          <span className={css(styles.new)}>
          <span className={css(styles.fireIcon)}>{icons.fire}</span>
            <span className={css(styles.newText)}>New</span>
          </span>
        </div>
        <div className={css(styles.desc)}>
          You can now choose different discussion types such as <span className={css(styles.bolded)}>Peer Review</span> and <span className={css(styles.bolded)}>Summary</span>. Give it a shot!
        </div>
        <div className={css(styles.btnContainer)}>
          <Button onClick={handleDismiss} label={`Okay`} size="small" customButtonStyle={styles.btn} customLabelStyle={styles.btnLabel} />
        </div>
      </div>
    )
  }
  if (normalizedFeatureName === "bounty" ) {
    html = (
      <div className={css(styles.body)}>
        <span className={css(styles.caret)}>{icons.caretLeft}</span>
        <div className={css(styles.title)}>
          Bounties
          <span className={css(styles.new)}>
          <span className={css(styles.fireIcon)}>{icons.fire}</span>
            <span className={css(styles.newText)}>New</span>
          </span>
        </div>
        <div className={css(styles.desc)}>
          Bounties are now available. Incentivize others by offering up ResearchCoin to the best solution.
        </div>
        <div className={css(styles.btnContainer)}>
          <Button onClick={handleDismiss} label={`Okay`} size="small" customButtonStyle={styles.btn} customLabelStyle={styles.btnLabel} />
        </div>
      </div>
    )
  }


  if (shouldAlert) {
    return (
      <div className={css(styles.tooltipContainer)}>
        {html}
      </div> 
    )
  }
  else {
    return null;
  }

}

// const bounty = StyleSheet.create({
//   body: {
//     background: colors.ORANGE(),
//     color: "white",
//   }
// })

const styles = StyleSheet.create({
  tooltipContainer: {
    position: "absolute",
    zIndex: 10,
    right: -395,
    top: -11,
  },
  caret: {
    color: colors.NEW_BLUE(),
    position: "absolute",
    fontSize: 25,
    left: -9,
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
    background: colors.NEW_BLUE(),
    borderRadius: 4,
    color: "white",
    padding: "10px 15px",
    boxShadow: "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
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
    padding: "7px 15px"
  },
  btnLabel: {
    color: colors.NEW_BLUE(),
    fontWeight: 500,
    fontSize: 16,
  }
})

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(NewFeatureTooltip);
