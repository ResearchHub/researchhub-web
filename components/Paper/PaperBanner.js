import React from "react";
import { StyleSheet, css } from "aphrodite";

// Config
import colors from "~/config/themes/colors";

const PaperBanner = ({ type, icon, message, content }) => {
  const renderMessage = () => {
    switch (type) {
      case "removed":
        return (
          <div style={{ textAlign: "center", width: "100%" }}>
            This paper has been removed from ResearchHub by a moderator because
            of poor quality content.
            <br />
            Please visit our{" "}
            <a
              style={{ color: "#4E53FF" }}
              href="https://www.notion.so/researchhub/Paper-Submission-Guidelines-a2cfa1d9b53c431a91c9816e17f212e1"
              target="_blank"
            >
              Paper Submission Guidelines
            </a>{" "}
            to see what kind of content we accept.
          </div>
        );
      case "incomplete":
        return (
          <div>
            You can help improve this page by providing more information.
          </div>
        );
    }
  };

  const renderIcon = () => {
    switch (type) {
      case "removed":
        return <i className="fas fa-exclamation-circle" />;
      case "incomplete":
        return (
          <img
            className={css(styles.incompleteIcon)}
            src={"/static/icons/rh-group.png"}
          />
        );
    }
  };

  return (
    <div className={css(styles.banner)}>
      <div className={css(styles.icon)}>{renderIcon()}</div>
      <div className={css(styles.message)}>{renderMessage()}</div>
    </div>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderRadius: 8,
    padding: 16,
    display: "flex",
    alignItems: "center",
    background: "#F2F2F6",
  },
  message: {
    marginLeft: 16,
    width: "100%",
    lineHeight: 1.8,
    fontSize: 18,
  },
  icon: {
    color: colors.RED(),
    fontSize: "2em",
  },
  incompleteIcon: {
    color: "unset",
    width: 150,
    // background: '#5a3fff'
  },
});

export default PaperBanner;
