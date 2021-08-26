import { Component } from "react";
import { StyleSheet, css } from "aphrodite";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";

// Config
import colors from "../../../../config/themes/colors";

class EmptySummary extends Component {
  render() {
    return (
      <ComponentWrapper>
        <div className={css(styles.box) + " second-step"}>
          {this.props.icon}
          <h2 className={css(styles.noSummaryTitle)}>{this.props.message}</h2>
          <div className={css(styles.text)}>{this.props.subText}</div>
          <PermissionNotificationWrapper
            onClick={this.props.onClick}
            modalMessage={this.props.modalMessage}
            permissionKey={"ProposeSummaryEdit"}
            loginRequired={true}
          >
            <button className={css(styles.button)}>
              {this.props.buttonText}
            </button>
          </PermissionNotificationWrapper>
        </div>
      </ComponentWrapper>
    );
  }
}

var styles = StyleSheet.create({
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  noSummaryTitle: {
    color: colors.BLACK(1),
    fontSize: 20,
    fontWeight: 500,
    textAlign: "center",
    "@media only screen and (max-width: 415px)": {
      width: 280,
      fontSize: 16,
    },
  },
  text: {
    fontSize: 16,
    color: colors.BLACK(0.8),
    marginBottom: 24,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  summaryEdit: {
    marginBottom: 50,
    width: "100%",
    transition: "all ease-in-out 0.3s",
  },
  button: {
    border: "1px solid",
    borderColor: colors.PURPLE(1),
    padding: "8px 32px",
    background: "#fff",
    color: colors.PURPLE(1),
    fontSize: 16,
    borderRadius: 4,
    height: 45,
    outline: "none",
    cursor: "pointer",
    ":hover": {
      borderColor: "#FFF",
      color: "#FFF",
      backgroundColor: colors.PURPLE(1),
    },
    "@media only screen and (max-width: 415px)": {
      padding: "6px 24px",
      fontSize: 12,
    },
  },
  icon: {
    fontSize: 50,
    color: colors.BLUE(1),
    height: 50,
    marginBottom: 10,
  },
});

export default EmptySummary;
