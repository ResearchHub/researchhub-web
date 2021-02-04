import React from "react";
import { StyleSheet, css } from "aphrodite";

// Components
import OnboardHub from "./OnboardHub";
import Loader from "~/components/Loader/Loader";

// Config
import icons from "~/config/themes/icons";
import colors from "../../config/themes/colors";

const OnboardHubList = (props) => {
  const { searching, onClick, hubs, userHubIds } = props;

  const renderContent = () => {
    if (hubs && hubs.length) {
      return hubs.map((hub, index) => (
        <div className={css(styles.cardContainer)}>
          <OnboardHub
            key={`onboardHub-${hub.id}`}
            hub={hub}
            index={index}
            onClick={onClick}
            userHubIds={userHubIds}
          />
        </div>
      ));
    } else {
      return (
        <div className={css(styles.emptyResults)}>
          <img
            src={"/static/icons/search-empty.png"}
            className={css(styles.logo)}
            alt="Empty Search Icon"
          />
          <h3 className={css(styles.emptyTitle)}>
            We can't find what you're looking for!{"\n"}
            {searching ? (
              <div style={{ display: "flex" }}>
                Please try another search
                <Loader
                  loading={true}
                  size={3}
                  type={"beat"}
                  color={"#000"}
                  containerStyle={styles.loaderStyle}
                />
              </div>
            ) : (
              "Please try another search."
            )}
          </h3>
        </div>
      );
    }
  };

  return <div className={css(styles.root)}>{renderContent()}</div>;
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    maxWidth: 700,
    width: "100%",
    flexWrap: "wrap",
    "@media only screen and (max-width: 936px)": {
      justifyContent: "center",
    },
  },
  cardContainer: {
    margin: 5,
  },
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyResults: {
    padding: "15px 0",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.BLACK(),
    boxSizing: "border-box",
  },
  emptyTitle: {
    fontWeight: 500,
    fontSize: 20,
    whiteSpace: "pre-wrap",
    marginLeft: 15,
    lineHeight: 1.5,
    height: 60,
    "@media only screen and (max-width: 415px)": {
      height: 45,
      fontSize: 16,
    },
  },
  logo: {
    height: 60,
    "@media only screen and (max-width: 415px)": {
      height: 45,
    },
  },
  searchResultPaper: {
    border: "none",
  },
  hide: {
    display: "none",
  },
  loaderStyle: {
    paddingTop: 2,
    paddingLeft: 1,
  },
});

export default OnboardHubList;
