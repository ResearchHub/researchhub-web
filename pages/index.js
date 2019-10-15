import Link from "next/link";
import Router from "next/router";

import Button from "../components/Form/Button";

import { StyleSheet, css } from "aphrodite";

class Index extends React.Component {
  render() {
    return (
      <div className={css(styles.content, styles.column)}>
        <div className={css(styles.homeBanner)}>
          <img
            src={"/static/background/homepage.png"}
            className={css(styles.bannerOverlay)}
          />
          <div className={css(styles.column, styles.titleContainer)}>
            <div className={css(styles.header, styles.text)}>
              Welcome to Research Hub!
            </div>
            <div className={css(styles.subtext, styles.text)}>
              We're a community seeking to prioritization, collaboraten,
              reproducability, and funding of scientic research.{" "}
              <span className={css(styles.readMore)}>Read more</span>
            </div>
            <Button
              // onClick={renderProps.onClick}
              customButtonStyle={styles.button}
              icon={"/static/icons/google.png"}
              customIconStyle={styles.iconStyle}
              label={"Log in with Google"}
            />
          </div>
        </div>
      </div>
    );
  }
}

var styles = StyleSheet.create({
  content: {},
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#FFF",
    fontFamily: "Roboto",
  },
  titleContainer: {
    alignItems: "flex-start",
    marginLeft: "calc(100% * .08)",
    justifyContent: "space-between",
    height: 200,
    zIndex: 3,
  },
  homeBanner: {
    background: "linear-gradient(#684ef5, #5058f6)",
    width: "100%",
    height: 365,
    position: "relative",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: "100%",
    width: "100%",
    minWidth: "100%",
    zIndex: 2,
  },
  readMore: {
    cursor: "pointer",
    textDecoration: "underline",
    ":hover": {
      fontWeight: 400,
    },
  },
  header: {
    fontSize: 50,
    fontWeight: 400,
  },
  subtext: {
    whiteSpace: "initial",
    width: 670,
    fontSize: 16,
    fontWeight: 300,
  },
  button: {
    height: 55,
    width: 230,
    marginTop: 10,
    marginBottom: 0,
  },
  iconStyle: {
    height: 33,
    width: 33,
  },
});

export default Index;
