import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";

// Component
import BaseModal from "./BaseModal";
import Loader from "../Loader/Loader";
import FormInput from "../Form/FormInput";
import Button from "../Form/Button";

// Redux
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

class TransactionModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      networkVersion: null, //
      networkAddress: "",
      connectedMetaMask: false,
      transition: false,
      listenerNetwork: null,
      listenerAccount: null,
      userBalance: null,
      withdrawals: [],
      validating: false,
      valid: false,
      error: null,
    };
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {
    if (typeof window.ethereum !== "undefined") {
      const provider = window["ethereum"];
      if (
        this.props.modals.openTransactionModal &&
        !this.state.connectedMetaMask
      ) {
        this.checkNetwork();
      }
    }
    this.getBalance();
  }

  componentWillUpdate(prevProps) {
    if (
      prevProps.modals.openTransactionModal !==
      this.props.modals.openTransactionModal
    ) {
      if (
        typeof window.ethereum !== "undefined" &&
        prevProps.modals.openTransactionModal
      ) {
        this.updateChainId(ethereum.networkVersion);
        this.checkNetwork();
      }
    }
    if (
      prevProps.auth.user.balance !== this.props.auth.user.balance ||
      this.state.userBalance === null
    ) {
      this.getBalance();
    }
  }

  checkNetwork = () => {
    let that = this;
    if (!this.state.connectedMetaMask) {
      ethereum
        .send("eth_requestAccounts")
        .then((accounts) => {
          let account = accounts && accounts.result ? accounts.result[0] : [];
          that.setState({
            connectedMetaMask: true,
            networkAddress: account,
            listenerNetwork: ethereum.on("networkChanged", () =>
              this.updateChainId(ethereum.networkVersion)
            ),
            listenerAccount: ethereum.on("accountsChanged", this.updateAccount),
            valid: this.state.networkAddress !== "",
          });
        })
        .catch((error) => {
          if (error.code === 4001) {
            // EIP 1193 userRejectedRequest error
            console.log("Please connect to MetaMask.");
          } else {
            console.error(error);
          }
        });
    }
  };

  updateChainId = (chainId) => {
    if (chainId !== this.state.networkVersion) {
      let transition = false;
      if (this.state.networkVersion !== "1" && chainId === "1") {
        transition = true;
      }
      if (this.state.networkVersion === "1" && chainId !== "1") {
        transition = true;
      }
      this.setState(
        {
          networkVersion: chainId, // shows the eth network
          transition: transition,
        },
        () => {
          this.state.transition &&
            setTimeout(() => {
              this.setState({
                transition: false,
              });
            }, 400);
        }
      );
    }
  };

  updateAccount = (accounts) => {
    let account = accounts && accounts[0] && accounts[0];
    this.setState({
      networkAddress: account,
    });
  };

  closeModal = () => {
    let { openTransactionModal } = this.props;
    this.setState({
      ...this.initialState,
    });
    openTransactionModal(false);
  };

  renderSwitchNetworkMsg = () => {
    let { transition } = this.state;
    return (
      <div className={css(styles.networkContainer)}>
        {transition ? (
          <Loader loading={true} />
        ) : (
          <Fragment>
            <div className={css(styles.title)}>
              Oops, you're on the wrong network
            </div>
            <div className={css(styles.subtitle)}>
              Simply open MetaMask and switch over to the
              <b>{" Main Ethereum Network"}</b>
            </div>
            <img
              src={"/static/background/metamask.png"}
              className={css(styles.image)}
              draggable={false}
            />
          </Fragment>
        )}
      </div>
    );
  };

  renderTransactionScreen = () => {
    let { transition, userBalance, networkAddress } = this.state;
    return (
      <div className={css(styles.networkContainer)}>
        {transition ? (
          <Loader loading={true} />
        ) : (
          <Fragment>
            <div className={css(styles.row, styles.top)}>
              <div className={css(styles.left)}>
                <div className={css(styles.mainHeader)}>Amount to withdraw</div>
                <div className={css(styles.subtitle, styles.noMargin)}>
                  Your current total balance in ResearchCoin
                </div>
              </div>
              <div className={css(styles.right)}>
                <div className={css(styles.userBalance)}>
                  {userBalance}
                  <img
                    className={css(styles.coin)}
                    src={"/static/icons/coin.png"}
                  />
                </div>
              </div>
            </div>
            {this.renderRow(
              {
                text: "Recipient ETH Address",
                tooltip: "The address of your ETH Account (ex. 0x0000...)",
              },
              {
                value: networkAddress,
                onChange: this.handleNetworkAddressInput,
              }
            )}
            <div className={css(styles.buttons)}>
              <Button
                label={"Confirm"}
                onClick={this.sendWithdrawalRequest}
                customButtonStyle={styles.button}
              />
            </div>
          </Fragment>
        )}
      </div>
    );
  };

  renderRow = (left, right) => {
    let { networkAddress, validating, valid } = this.state;
    return (
      <div className={css(styles.row)}>
        <div className={css(styles.left, styles.spacedContent)}>
          <div>
            {left.text}
            <span className={css(styles.infoIcon)} data-tip={left.tooltip}>
              {icons["info-circle"]}
              <ReactTooltip type={"info"} />
            </span>
          </div>
          <FormInput
            value={right.value && right.value}
            containerStyle={styles.formInput}
            onChange={right.onChange && right.onChange}
            inlineNodeRight={
              networkAddress !== "" ? (
                validating ? (
                  <span className={css(styles.successIcon)}>
                    <Loader loading={true} size={23} />
                  </span>
                ) : (
                  <span
                    className={css(
                      styles.successIcon,
                      !valid && styles.errorIcon
                    )}
                  >
                    {valid ? (
                      <i className="fal fa-check-circle" />
                    ) : (
                      <i className="fal fa-times-circle" />
                    )}
                  </span>
                )
              ) : null
            }
          />
        </div>
      </div>
    );
  };

  getBalance = () => {
    fetch(API.WITHDRAW_COIN, API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let { user } = this.props.auth;
        this.setState({
          userBalance: user.balance,
          withdrawals: [...res.results],
        });
      });
  };

  handleNetworkAddressInput = (id, value) => {
    this.setState(
      {
        networkAddress: value,
        validating: true,
      },
      () => {
        setTimeout(() => {
          this.setState({
            validating: false,
            valid: this.isAddress(this.state.networkAddress),
          });
        }, 400);
      }
    );
  };

  sendWithdrawalRequest = (e) => {
    e.stopPropagation();
    let { networkAddress } = this.state;
    let { showMessage, setMessage } = this.props;
    showMessage({ load: true, show: true });
    if (this.isAddress(networkAddress)) {
      let param = {
        to_address: networkAddress,
      };
      fetch(API.WITHDRAW_COIN, API.POST_CONFIG(param))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          console.log("res", res);
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
    }
  };

  /**
   * Checks if the given string is an address
   *
   * @method isAddress
   * @param {String} address the given HEX adress
   * @return {Boolean}
   */
  isAddress = (address) => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      // check if it has the basic requirements of an address
      return false;
    } else if (
      /^(0x)?[0-9a-f]{40}$/.test(address) ||
      /^(0x)?[0-9A-F]{40}$/.test(address)
    ) {
      // If it's all small caps or all all caps, return true
      return true;
    } else {
      // Otherwise check each case
      return isChecksumAddress(address);
    }
  };

  /**
   * Checks if the given string is a checksummed address
   *
   * @method isChecksumAddress
   * @param {String} address the given HEX adress
   * @return {Boolean}
   */
  isChecksumAddress = (address) => {
    // Check each case
    address = address.replace("0x", "");
    var addressHash = sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++) {
      // the nth letter should be uppercase if the nth digit of casemap is 1
      if (
        (parseInt(addressHash[i], 16) > 7 &&
          address[i].toUpperCase() !== address[i]) ||
        (parseInt(addressHash[i], 16) <= 7 &&
          address[i].toLowerCase() !== address[i])
      ) {
        return false;
      }
    }
    return true;
  };

  render() {
    let { modals } = this.props;
    let { networkVersion, connectedMetaMask } = this.state;
    return (
      <BaseModal
        isOpen={modals.openTransactionModal}
        closeModal={this.closeModal}
        removeDefault={true}
      >
        <div
          className={css(
            styles.modalContent,
            networkVersion === "1" && styles.main
          )}
        >
          {(!connectedMetaMask || networkVersion === "1") && (
            <div className={css(styles.header, styles.text)}>
              Withdraw ResearchCoin
            </div>
          )}
          <img
            src={"/static/icons/close.png"}
            className={css(styles.closeButton)}
            onClick={this.closeModal}
            draggable={false}
          />
          {connectedMetaMask && (
            <div className={css(styles.connectStatus)}>
              <div
                className={css(
                  styles.dot,
                  connectedMetaMask && styles.connected
                )}
              />
              Connected wallet: MetaMask
            </div>
          )}
          {connectedMetaMask && networkVersion !== "1"
            ? this.renderSwitchNetworkMsg()
            : this.renderTransactionScreen()}
        </div>
      </BaseModal>
    );
  }
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 50,
  },
  main: {
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 20,
  },
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 20,
    right: 20,
    cursor: "pointer",
  },
  networkContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    transition: "all ease-in-out 0.3s",
  },
  header: {
    fontWeight: "500",
    height: 30,
    width: "100%",
    fontSize: 26,
    color: "#232038",
    textAlign: "center",
    marginBottom: 20,
    "@media only screen and (max-width: 557px)": {
      fontSize: 24,
    },
    "@media only screen and (max-width: 725px)": {
      width: 450,
    },
    "@media only screen and (max-width: 557px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 300,
      fontSize: 22,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  title: {
    fontWeight: 500,
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Roboto",
  },
  subtitle: {
    color: "#83817c",
    fontSize: 14,
    marginBottom: 25,
    textAlign: "center",
    fontFamily: "Roboto",
  },
  image: {
    objectFit: "contain",
    width: 250,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "1px dashed #E7E5E4",
    width: 440,
    padding: "20px 0 20px",
  },
  spacedContent: {
    width: "100%",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    color: "#82817D",
    height: 60,
    fontFamily: "Roboto",
  },
  right: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    // height: '100%'
    height: 60,
    fontFamily: "Roboto",
  },
  orientRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  noMargin: {
    margin: 0,
  },
  mainHeader: {
    fontWeight: "500",
    fontSize: 22,
    color: "#000 ",
  },
  input: {
    height: 60,
    width: 90,
    border: "1px solid #82817d",
    borderRadius: ".5rem",
    // fontSize: '1.8rem'
  },
  infoIcon: {
    marginLeft: 5,
    cursor: "pointer",
  },
  eth: {
    color: "#82817D",
  },
  userBalance: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
  },
  coin: {
    height: 20,
    width: 20,
    marginTop: 1,
    marginLeft: 5,
  },
  formInput: {
    width: "100%",
  },
  buttons: {
    marginTop: 40,
  },
  successIcon: {
    color: "#7ae9b1",
    fontSize: 28,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBFBFB",
    cursor: "default",
  },
  errorIcon: {
    color: colors.RED(1),
  },
  connectStatus: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    marginBottom: 10,
  },
  dot: {
    height: 10,
    maxHeight: 10,
    minHeight: 10,
    width: 10,
    maxWidth: 10,
    minWidth: 10,
    borderRadius: "50%",
    marginRight: 5,
    backgroundColor: "#f9f4d3",
    border: "2px solid #f8de5a",
  },
  connected: {
    backgroundColor: "#d5f3d7",
    border: "2px solid #7ae9b1",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  modals: state.modals,
});

const mapDispatchToProps = {
  openTransactionModal: ModalActions.openTransactionModal,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionModal);
