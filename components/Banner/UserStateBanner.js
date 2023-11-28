import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
import { Fragment, useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

import { MessageActions } from "~/redux/message";
import { BannerActions } from "~/redux/banner";

import colors from "~/config/themes/colors";

const UserStateBanner = ({ is_suspended, probable_spammer }) => {
  const [showBanner, setShowBanner] = useState(false);
  useEffect(() => {
    determineBanner();
  }, []);

  useEffect(() => {
    determineBanner();
  }, [is_suspended, probable_spammer]);

  const determineBanner = () => {
    if (is_suspended || probable_spammer) {
      return setShowBanner(true);
    }
    return setShowBanner(false);
  };

  const getRootStyle = () => {
    let classNames = [styles.bannerContainer];

    if (!showBanner) {
      classNames.push(styles.closeBanner);
    }
    if (probable_spammer) {
      classNames.push(styles.pending);
    }
    if (is_suspended) {
      classNames.push(styles.suspended);
    }
    return classNames;
  };

  const formatHeader = () => {
    if (is_suspended) {
      return (
        <Fragment>
          <span className={css(styles.icon)}>
            {<FontAwesomeIcon icon={faExclamationTriangle}></FontAwesomeIcon>}
          </span>
          This account has been suspended.
        </Fragment>
      );
    } else if (probable_spammer) {
      return (
        <Fragment>
          <span className={css(styles.icon)}>
            {<FontAwesomeIcon icon={faExclamationTriangle}></FontAwesomeIcon>}
          </span>
          This account is under review.
        </Fragment>
      );
    }
    return null;
  };

  const formatDescription = () => {
    if (probable_spammer) {
      return (
        <Fragment>
          <span style={{ maxWidth: 600 }}>
            We’ve noticed suspicious activity from this account. If you believe
            this to be a mistake, please contact us at{" "}
            <a style={{ color: "#fff" }} href="mailto:hello@researchhub.com">
              verification@researchhub.com
            </a>{" "}
            so we can investigate.
          </span>
        </Fragment>
      );
    } else if (is_suspended) {
      return (
        <Fragment>
          <span style={{ maxWidth: 600 }}>
            If you believe this to be a mistake, please contact us at{" "}
            <a style={{ color: "#fff" }} href="mailto:hello@researchhub.com">
              verification@researchhub.com
            </a>{" "}
            so we can investigate.
          </span>
        </Fragment>
      );
    }
    return null;
  };

  return (
    <div className={css(getRootStyle())}>
      <div className={css(styles.contentContainer)}>
        <h3 className={css(styles.content)}>
          <span className={css(styles.title)}>{formatHeader()}</span>
          <div className={css(styles.paragraph)}>{formatDescription()}</div>
        </h3>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width: "100%",
    minWidth: "100%",
    maxHeight: 120,
    color: "#FFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    userSelect: "none",
    position: "relative",
    whiteSpace: "pre-wrap",
    zIndex: 25,
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 4px 41px -24px",
    borderBottom: "rgb(151,151,151, .2) 1px solid",
    "@media only screen and (max-width: 415px)": {
      flexDirection: "column",
    },
  },
  pending: {
    backgroundColor: colors.YELLOW(),
  },
  suspended: {
    backgroundColor: colors.RED(),
    position: "sticky",
    top: 65,
  },
  contentContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px 25px",
  },
  content: {
    fontSize: 16,
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    "@media only screen and (max-width: 760px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 320px)": {
      fontSize: 12,
    },
  },
  title: {
    fontWeight: 500,
    fontSize: 17,
    "@media only screen and (max-width: 760px)": {
      fontSize: 15,
    },
    "@media only screen and (max-width: 320px)": {
      fontSize: 13,
    },
  },
  link: {
    color: colors.BLUE(),
    ":hover": {
      textDecoration: "underline",
    },
  },
  hovered: {
    textDecoration: "underline",
  },
  paragraph: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 5,
    fontWeight: 400,
    lineHeight: 1.3,
    wordBreak: "break-word",
  },
  flexContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 400,
    "@media only screen and (max-width: 415px)": {
      marginTop: 5,
    },
    ":hover": {
      textDecoration: "underline",
    },
  },
  closeBanner: {
    display: "none",
  },
  removeFormat: {
    textDecoration: "unset",
    fontColor: "unset",
  },
  icon: {
    fontSize: 16,
    marginRight: 5,
    color: "#FFF",
  },
});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  removeBanner: BannerActions.removeBanner,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserStateBanner);
