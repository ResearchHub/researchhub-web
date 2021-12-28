import { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { withRouter } from "next/router";
import Modal from "react-modal";

import colors from "~/config/themes/colors";
import { modalStyles } from "~/config/themes/styles";

class OrcidLoginSuccessPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        className={css(modalStyles.modal)}
        isOpen={true}
        closeModal={null}
        shouldCloseOnOverlayClick={false}
        style={overlay}
        ariaHideApp={false}
      >
        <div className={css(styles.page)}>
          <div className={css(styles.content)}>
            <div className={css(styles.icons)}>
              <img
                className={css(styles.rhIcon)}
                src={"/static/ResearchHubLogo.webp"}
              />
              <img
                className={css(styles.orcidIcon)}
                src={"/static/icons/orcid.png"}
              />
            </div>
            <div className={css(styles.headerContainer)}>
              <h1 className={css(styles.header)}>Successfully logged in.</h1>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const overlay = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: "11",
    borderRadius: 5,
  },
};

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    background: "url(/static/background/background-modal.png) #FCFCFC",
    backgroundSize: "cover",
    paddingTop: 50,
    height: "100vh",
    width: "100vw",
  },
  content: {
    padding: "30px 30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    border: "1px solid #E7E7E7",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  },
  headerContainer: {
    maringTop: 10,
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.6",
    textAlign: "center",
    fontWeight: 400,
  },
  icons: {
    display: "flex",
    alignItems: "center",
  },
  rhIcon: {
    height: 30,
  },
  orcidIcon: {
    height: 25,
    maxHeight: 25,
    minHeight: 25,
    minWidth: 25,
    maxWidth: 25,
    width: 25,
    paddingLeft: 5,
  },
  linkIcon: {
    margin: "0px 13px",
    color: colors.GREY(),
    fontSize: 14,
  },
  buttonWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  error: {
    marginTop: 0,
    marginBottom: 15,
    color: colors.RED(),
    fontSize: 13,
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  errorIcon: {
    color: colors.RED(),
    fontSize: 14,
    marginRight: 5,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default withRouter(connect(mapStateToProps)(OrcidLoginSuccessPage));
