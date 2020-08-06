import React from "react";
import { StyleSheet, css } from "aphrodite";
import Router, { withRouter } from "next/router";
import { connect } from "react-redux";
import { Helpers } from "~/config/helpers";

import BaseModal from "./BaseModal";
import OrcidConnectButton from "~/components/OrcidConnectButton";

import { ModalActions } from "../../redux/modals";
import { MessageActions } from "~/redux/message";

import API from "~/config/api";
import colors from "~/config/themes/colors";

class OrcidConnectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * closes the modal on button click
   */
  closeModal = () => {
    const { openOrcidConnectModal } = this.props;
    let setHasSeen = false;
    const hasSeen = this.props.auth.user.has_seen_orcid_connect_modal;
    if (!hasSeen) {
      setHasSeen = true;
    }
    openOrcidConnectModal(false, setHasSeen);
  };

  render() {
    let { modals } = this.props;
    return (
      <BaseModal
        isOpen={modals.openOrcidConnectModal}
        closeModal={this.closeModal}
        title={"Are you an author on ORCiD?"}
        subtitle={
          modals.loginModal.flavorText
            ? modals.loginModal.flavorText
            : "Connect your ResearchHub profile with ORCiD to verify your authorship."
        }
        backgroundImage={true}
      >
        <div className={css(styles.titleContainer)}></div>
        <div className={css(styles.buttonColumn)}>
          <OrcidConnectButton customLabel={"Connect to ORCID"} />
        </div>
      </BaseModal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    background: "#fff",
    outline: "none",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#fff",
    padding: "50px 0px 50px 0px",
    width: 625,
    overflowY: "scroll",
  },
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 20,
    right: 20,
    cursor: "pointer",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    marginBottom: 30,
  },
  noMargin: {
    marginBottom: 0,
  },
  title: {
    fontWeight: "500",
    height: 30,
    width: 426,
    fontSize: 26,
    color: "#232038",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    height: 22,
    width: 484,
    fontWeight: "400",
    color: "#4f4d5f",
  },
  text: {
    fontFamily: "Roboto",
  },
  button: {
    height: 55,
    width: 230,
    marginBottom: 15,
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  },
  orchidButton: {
    backgroundColor: "#fff",
    color: colors.BLUE(1),
    border: `1px solid ${colors.BLUE()}`,
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  orchidLabel: {
    color: colors.BLUE(1),
  },
  iconStyle: {
    height: 33,
    width: 33,
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    borderRadius: "50%",
  },
  inputContainer: {
    width: 425,
    marginTop: 0,
    marginBottom: 30,
  },
  input: {
    width: 395,
  },
  buttonColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  orcidButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  modals: state.modals,
});

const mapDispatchToProps = {
  openOrcidConnectModal: ModalActions.openOrcidConnectModal,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrcidConnectModal)
);
