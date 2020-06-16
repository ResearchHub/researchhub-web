import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import { withAlert } from "react-alert";

// Component
import BaseModal from "./BaseModal";
import Loader from "~/components/Loader/Loader";
import Button from "~/components/Form/Button";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

class PaperTransactionModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      value: 1,
      error: false,
    };
    this.state = {
      ...this.initialState,
    };
  }

  closeModal = () => {
    this.setState({ ...this.initialState }, () => {
      this.props.openPaperTransactionModal(false);
    });
  };

  handleInput = (e) => {
    let value = e.target.value;
    this.setState({
      value,
      error: this.handleError(value),
    });
  };

  handleError = (value) => {
    if (!value > 0 || value > this.props.user.balance) {
      return true;
    }
    return false;
  };

  confirmTransaction = () => {
    let { value } = this.state;
    return this.props.alert.show({
      text: `Use ${value} RSC to promote this paper?`,
      buttonText: "Yes",
      onClick: () => {
        this.sendTransaction();
      },
    });
  };

  sendTransaction = () => {
    let { showMessage, setMessage, paper, user } = this.props;
    showMessage({ show: true, load: true });

    let paperId = paper.id;
    let userId = user.id;

    let payload = {
      amount: this.state.value,
      object_id: paperId,
      content_type: "paper",
      user: userId,
      purchase_method: "OFF_CHAIN",
      purchase_type: "BOOST",
    };

    fetch(API.PROMOTION_PURCHASE, API.POST_CONFIG(payload))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        showMessage({ show: false });
        setMessage("Transaction Successful!");
        showMessage({ show: true });
        setTimeout(() => this.closeModal(), 400);
      })
      .catch((err) => {
        showMessage({ show: false });
        setMessage("Something went wrong.");
        showMessage({ show: true, error: true });
      });
  };

  render() {
    let { user, modals } = this.props;
    return (
      <BaseModal
        isOpen={modals.openPaperTransactionModal}
        closeModal={this.closeModal}
        title={"Promote Paper"} // this needs to
      >
        <div className={css(styles.content)}>
          <div className={css(styles.description)}>
            {
              "Use RSC to give this paper better visibility. Every RSC spent will increase the paper's score and its likelihood to trend."
            }
          </div>
          <div className={css(styles.row, styles.numbers)}>
            <div className={css(styles.column, styles.left)}>
              <div className={css(styles.title)}>Total Balance</div>
              <div className={css(styles.subtitle)}>
                Your current total balance in RSC
              </div>
            </div>
            <div className={css(styles.column, styles.right)}>
              <div className={css(styles.userBalance)}>
                {user && user.balance}
                <img
                  src={"/static/icons/coin-filled.png"}
                  draggable={false}
                  className={css(styles.coinIcon)}
                />
              </div>
            </div>
          </div>
          <div className={css(styles.row, styles.numbers)}>
            <div className={css(styles.column, styles.left)}>
              <div className={css(styles.title)}>Amount to Spend</div>
              <div className={css(styles.subtitle)}>
                Your total must exceed 1 RSC
                {/* <img
                  src={"/static/icons/coin-filled.png"}
                  draggable={false}
                  className={css(styles.coinIcon)}
                /> */}
              </div>
            </div>
            <div className={css(styles.column, styles.right)}>
              <input
                type="number"
                className={css(styles.input, this.state.error && styles.error)}
                value={this.state.value}
                onChange={this.handleInput}
              />
            </div>
          </div>
          <div className={css(styles.buttonRow)}>
            <Button label="Confirm" onClick={this.confirmTransaction} />
          </div>
        </div>
      </BaseModal>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    // paddingTop: 30,
    width: 420,
  },
  description: {
    marginTop: 15,
    marginBottom: 20,
    fontSize: 16,
    minHeight: 22,
    width: "100%",
    fontWeight: "400",
    color: "#4f4d5f",
    boxSizing: "border-box",
    whiteSpace: "pre-wrap",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    "@media only screen and (max-width: 557px)": {
      fontSize: 14,
      width: 300,
    },
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    boxSizing: "border-box",
    padding: "15px 0",
  },
  border: {
    borderBottom: ".1rem dotted #e7e6e4",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    boxSizing: "border-box",
    width: "100%",
  },
  left: {
    width: "80%",
  },
  right: {
    width: "40%",
    alignItems: "flex-end",
    height: "100%",
  },
  numbers: {
    alignItems: "flex-end",
  },
  input: {
    height: 50,
    width: 80,
    fontSize: 16,
  },
  error: {
    borderColor: "red",
  },
  title: {
    fontSize: 22,
    color: "#2a2825",
    fontWeight: 500,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#82817d",
    display: "flex",
    alignItems: "center",
    // fontWeight: 500
  },
  text: {
    fontSize: 18,
    color: "#82817d",
    fontWeight: 500,
  },
  userBalance: {
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  coinIcon: {
    height: 20,
    marginLeft: 5,
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  modals: state.modals,
  paper: state.paper,
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  openPaperTransactionModal: ModalActions.openPaperTransactionModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert()(PaperTransactionModal));
