import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

// Component
import HubEntryPlaceholder from "../Placeholders/HubEntryPlaceholder";

// Config
import colors from "../../config/themes/colors";

class SidebarList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reveal: true,
    };
  }

  render() {
    let { overrideStyle } = this.props;

    return (
      <div className={css(styles.container, overrideStyle && overrideStyle)}>
        <div className={css(styles.hubsListContainer)}>
          <div className={css(styles.listLabel)} id={"hubListTitle"}>
            {this.props.sidebarName}
          </div>
          <div
            className={css(styles.hubsList, this.state.reveal && styles.reveal)}
          >
            {this.props.sidebarItems.length > 0 ? (
              this.props.renderSidebarEntry()
            ) : (
              <Fragment>
                <ReactPlaceholder
                  showLoadingAnimation
                  ready={false}
                  customPlaceholder={
                    <HubEntryPlaceholder color="#efefef" rows={9} />
                  }
                />
              </Fragment>
            )}
            {this.props.viewAll}
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // width: "calc(100% * .625)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },
  hubsListContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "left",
    cursor: "default",
  },
  text: {
    fontFamily: "Roboto",
  },
  listLabel: {
    textTransform: "uppercase",
    fontWeight: 500,
    fontSize: 13,
    letterSpacing: 1.2,
    marginBottom: 15,
    textAlign: "left",
    color: "#a7a6b0",
    transition: "all ease-out 0.1s",
    width: "90%",
    paddingLeft: 35,
    boxSizing: "border-box",
    "@media only screen and (max-width: 1303px)": {
      paddingLeft: 25,
    },
  },
  topIcon: {
    color: colors.RED(),
    marginLeft: 6,
    fontSize: 13,
  },
  hubLink: {
    textDecoration: "none",
    color: "#111",
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "8px",
  },
  current: {
    borderColor: "rgb(237, 237, 237)",
    backgroundColor: "#FAFAFA",
    ":hover": {
      borderColor: "rgb(227, 227, 227)",
      backgroundColor: "#EAEAEA",
    },
  },
  hubsList: {
    opacity: 0,
    width: "90%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: "0px 30px",
    "@media only screen and (max-width: 1303px)": {
      padding: "0px 20px",
    },
  },
  reveal: {
    opacity: 1,
    transition: "all ease-in-out 0.2s",
  },
  space: {
    height: 10,
  },
  subscribedIcon: {
    marginLeft: "auto",
    color: colors.DARK_YELLOW(),
    fontSize: 11,
  },
  link: {
    textDecoration: "none",
    color: "rgba(78, 83, 255)",
    fontWeight: 300,
    textTransform: "capitalize",
    fontSize: 16,
    padding: "3px 5px",
    ":hover": {
      color: "rgba(78, 83, 255, .5)",
      textDecoration: "underline",
    },
  },
});

export default SidebarList;
