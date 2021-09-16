import { css, StyleSheet } from "aphrodite";
import { ReactElement, useEffect, useState } from "react";
import { Helpers } from "@quantfive/js-web-config";

import api from "~/config/api";
import newFeature from "~/config/newFeature/newFeature";
import colors from "../../config/themes/colors";
import TabNewFeature from "../NewFeature/TabNewFeature";
import { connect } from "react-redux";

type Props = {
  isActive: boolean;
  label: string;
  onClick: (e) => void;
  auth: any;
};

function UnifiedDocFeedFilterButton({
  isActive,
  label,
  onClick,
  auth
}: Props): ReactElement<"div"> {

  const [newFeatureActive, setNewFeatureActive] = useState(newFeature(label.toLocaleLowerCase()));
  const [clickedNewFeature, setClickedNewFeature] = useState(false);

  useEffect(() => {
    const fetchClickedNewFeature = () => {
      if (auth.isLoggedIn) {
        return fetch(api.NEW_FEATURE({route: 'clicked', feature: label.toLocaleLowerCase()}), api.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then(res => {
          setClickedNewFeature(res.clicked);
        });
      } else {
        const hypothesis_clicked = window.localStorage && window.localStorage.getItem(`feature_${label.toLocaleLowerCase()}_clicked`) === 'true';
        setClickedNewFeature(hypothesis_clicked);
      }
    }

    if (newFeatureActive) {
      fetchClickedNewFeature();
    }
  }, [auth.isLoggedIn]);

  const buttonClicked = (e) => {
    onClick && onClick(e);

    setClickedNewFeature(true);
    if (auth.isLoggedIn) {
      const params = {
        user: auth.user.id, feature: label.toLocaleLowerCase()
      }
      return fetch(api.NEW_FEATURE({}), api.POST_CONFIG(params))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
    } else {
      window.localStorage.setItem(`feature_${label.toLocaleLowerCase()}_clicked`, 'true')
    }
  }

  return (
    <div className={css(styles.container)} onClick={buttonClicked}>
      <div
        className={css(
          styles.unifiedDocFeedFilterButton,
          isActive && styles.isButtonActive
        )}
        role="button"
      >
        {label}
      </div>
      {!!newFeatureActive && !clickedNewFeature &&
        <div className={css(styles.tabFeature)}>
          <TabNewFeature />
        </div>
      }
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  tabFeature: {
    marginLeft: 8,
    marginRight: 24,
  },
  unifiedDocFeedFilterButton: {
    alignItems: "center",
    boxSizing: "border-box",
    color: "#241F3A",
    cursor: "pointer",
    display: "flex",
    fontSize: 18,
    height: 44,
    justifyContent: "center",
    padding: "4px 0",
    // marginRight: 24,
    borderBottom: "2px solid transparent",
  },
  isButtonActive: {
    borderBottom: `2px solid ${colors.BLUE(1)}`,
    color: colors.BLUE(1),
  },
});


const mapStateToProps = (state: any) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(UnifiedDocFeedFilterButton);
