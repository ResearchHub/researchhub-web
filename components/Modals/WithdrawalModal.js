import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { keccak256, sha3_256 } from "js-sha3";
import { ethers } from "ethers";
import Link from "next/link";

// Component
import BaseModal from "./BaseModal";
import Loader from "../Loader/Loader";
import FormInput from "../Form/FormInput";
import Button from "../Form/Button";

// Redux
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { useMetaMask, useWalletLink } from "../connectEthereum";
import CheckBox from "../Form/CheckBox";
import {
  sanitizeNumber,
  onKeyDownNumInput,
  onPasteNumInput,
  formatBalance,
} from "~/config/utils";

const RINKEBY_CHAIN_ID = "4";
const MAINNET_CHAIN_ID = "1";

const CURRENT_CHAIN_ID =
  process.env.REACT_APP_ENV === "staging" ||
  process.env.NODE_ENV !== "production"
    ? RINKEBY_CHAIN_ID
    : MAINNET_CHAIN_ID;

class WithdrawalModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      buttonEnabled: false,
      networkVersion: null,
      connectedMetaMask: false,
      connectedWalletLink: false,
      ethAccount: "",
      ethAccountIsValid: false,
      transition: false,
      listenerNetwork: null,
      listenerAccount: null,
      userBalance: 0,
      withdrawals: [],
      validating: false,
      transactionHash: "",
      // error for withdrawal input
      error: false,
      amount: 0,
    };
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {
    if (this.props.auth.isLoggedIn) {
      this.getBalance();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.auth.isLoggedIn) {
      if (!this.state.buttonEnabled && this.props.agreedToTerms) {
        this.setState({
          buttonEnabled: true,
        });
      }
      if (
        prevProps.modals.openWithdrawalModal !==
          this.props.modals.openWithdrawalModal &&
        this.props.modals.openWithdrawalModal
      ) {
        this.getBalance();
      }
      if (
        prevProps.auth.user.balance !== this.props.auth.user.balance ||
        this.state.userBalance === null
      ) {
        this.getBalance();
      }
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
            ethAccount: account,
          });
        })
        .catch((error) => {
          if (error.code === 4001) {
            // EIP 1193 userRejectedRequest error
          } else {
            console.error(error);
          }
        });
    }
  };

  updateChainId = (chainId) => {
    if (chainId !== this.state.networkVersion) {
      let transition = false;
      if (
        this.state.networkVersion !== CURRENT_CHAIN_ID &&
        chainId === CURRENT_CHAIN_ID
      ) {
        transition = true;
      }
      if (
        this.state.networkVersion === CURRENT_CHAIN_ID &&
        chainId !== CURRENT_CHAIN_ID
      ) {
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
    let valid = this.isAddress(account);
    this.setState({
      ethAccount: account,
      ethAccountIsValid: valid,
    });
  };

  closeModal = () => {
    let { openWithdrawalModal } = this.props;
    this.setState({
      ...this.initialState,
    });
    this.enableParentScroll();
    openWithdrawalModal(false);
  };

  enableParentScroll = () => {
    document.body.style.overflow = "scroll";
  };

  openTransactionConfirmation = (url) => {
    let win = window.open(url, "_blank");
    win.focus();
  };

  handleAmountInput = (e) => {
    let value = parseInt(sanitizeNumber(e.target.value), 10);
    value = value ? (value > 0 ? value : 0) : null;

    this.setState({
      amount: value,
      error: this.handleAmountError(value),
    });
  };

  handleAmountError = (value) => {
    if (value > this.state.userBalance || value < 100) {
      return true;
    }
    return false;
  };

  toggleButton = () => {
    this.setState({ buttonEnabled: !this.state.buttonEnabled });
  };

  renderRow = (left, right) => {
    let { ethAccount, validating, ethAccountIsValid } = this.state;
    return (
      <div className={css(styles.row)}>
        <div className={css(styles.left, styles.spacedContent)}>
          <div>
            {left.text}
            <span className={css(styles.infoIcon)} data-tip={left.tooltip}>
              {icons["info-circle"]}
              <ReactTooltip />
            </span>
          </div>
          <FormInput
            value={right.value && right.value}
            containerStyle={styles.formInput}
            onChange={right.onChange && right.onChange}
            inlineNodeRight={
              ethAccount !== "" ? (
                validating ? (
                  <span className={css(styles.successIcon)}>
                    <Loader loading={true} size={23} />
                  </span>
                ) : (
                  <span
                    className={css(
                      styles.successIcon,
                      !ethAccountIsValid && styles.errorIcon
                    )}
                  >
                    {ethAccountIsValid ? (
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
    if (!this.props.auth.isLoggedIn) {
      return;
    }
    if (this.props.auth.user.probable_spammer) {
      return;
    }
    return fetch(API.WITHDRAW_COIN({}), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let param = {
          balance: res.user.balance,
        };
        this.props.updateUser(param);
        this.setState({
          userBalance: res.user.balance,
          withdrawals: [...res.results],
        });
      })
      .catch((err) => {
        //Todo: handle error
      });
  };

  handleNetworkAddressInput = (id, value) => {
    this.setState(
      {
        ethAccount: value,
        validating: true,
      },
      () => {
        setTimeout(() => {
          this.setState({
            validating: false,
            ethAccountIsValid: this.isAddress(value),
          });
        }, 400);
      }
    );
  };

  sendWithdrawalRequest = (e) => {
    const { showMessage, setMessage } = this.props;

    if (!this.state.buttonEnabled) {
      showMessage({ show: false });
      setMessage("Please agree to the ResearchHub ToS.");
      showMessage({ show: true, error: true });
      return;
    }

    if (this.state.amount < 100) {
      showMessage({ show: false });
      setMessage("Withdrawal amount must be at least 100 RSC");
      showMessage({ show: true, error: true });
      return;
    }

    if (this.state.amount > this.state.userBalance) {
      showMessage({ show: false });
      setMessage("Not enough coins in balance");
      showMessage({ show: true, error: true });
      return;
    }

    e.stopPropagation();
    let { ethAccount } = this.state;
    showMessage({ load: true, show: true });
    if (this.isAddress(ethAccount)) {
      let param = {
        to_address: this.toCheckSumAddress(ethAccount),
        agreed_to_terms: true,
        amount: `${this.state.amount}`,
      };
      fetch(API.WITHDRAW_COIN({}), API.POST_CONFIG(param))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let { id, paid_status, transaction_hash } = res;
          if (paid_status === "failed") {
            showMessage({ show: false });
            setMessage(
              "Your transaction request has failed. \n Please try again later."
            );
            showMessage({ show: true, error: true });
          } else {
            showMessage({ show: false });
            setMessage("Your transaction request has been made.");
            showMessage({ show: true });
            this.setState({ transactionHash: true }, () => {
              this.getBalance();
            });
          }
        })
        .catch((err) => {
          if (err.response.status === 429) {
            showMessage({ show: false });
            this.closeModal();
            return this.props.openRecaptchaPrompt(true);
          }
          err.name = "";
          showMessage({ show: false });
          setMessage(err.toString());
          showMessage({ show: true, error: true });
        });
    } else {
      showMessage({ show: false });
      setMessage("Please enter a valid address.");
      showMessage({ show: true, error: true });
    }
  };

  toCheckSumAddress = (address) => {
    address = address.toLowerCase().replace("0x", "");
    let hash = keccak256(address);
    let ret = "0x";

    for (var i = 0; i < address.length; i++) {
      if (parseInt(hash[i], 16) >= 8) {
        ret += address[i].toUpperCase();
      } else {
        ret += address[i];
      }
    }

    return ret;
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
      return true;
      // Otherwise check each case
      // return this.isChecksumAddress(address);
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
    var addressHash = sha3_256(address.toLowerCase());
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

  renderToggleContainer = (className) => {
    return (
      <div className={className}>
        {this.renderMetaMaskButton()}
        {this.renderWalletLinkButton()}
      </div>
    );
  };

  renderMetaMaskButton = () => {
    return (
      <div
        className={css(
          styles.toggle,
          this.state.metaMaskVisible && styles.activeToggle
        )}
        onClick={async () => {
          if (!this.state.connectedMetaMask) {
            await this.connectMetaMask();
          }
          this.transitionScreen(() =>
            this.setState({
              nextScreen: true,
              offChain: false,
              metaMaskVisible: true,
              walletLinkVisible: false,
            })
          );
        }}
      >
        MetaMask
      </div>
    );
  };

  connectMetaMask = async () => {
    const { connected, account } = await useMetaMask();
    if (connected) {
      this.setUpEthListeners();
      console.log("Connected to MetaMask");
      this.setState({
        connectedMetaMask: connected,
        connectedWalletLink: false,
        ethAccount: account,
        networkVersion: ethereum.networkVersion,
        ethAccountIsValid: this.isAddress(account),
      });
    } else {
      console.log("Failed to connect MetaMask");
      this.setState({
        connectedMetaMask: false,
        connectedWalletLink: false,
      });
    }
  };

  setUpEthListeners() {
    this.setState({
      listenerNetwork: ethereum.on("networkChanged", () =>
        this.updateChainId(ethereum.networkVersion)
      ),
      listenerAccount: ethereum.on("accountsChanged", this.updateAccount),
    });
  }

  renderWalletLinkButton = () => {
    return (
      <div
        className={css(
          styles.toggle,
          styles.toggleRight,
          this.state.walletLinkVisible && styles.activeToggle
        )}
        onClick={async () => {
          if (!this.state.connectedWalletLink) {
            await this.connectWalletLink();
          }
          this.transitionScreen(() => {
            this.setState({
              nextScreen: true,
              walletLinkVisible: true,
              connectedMetaMask: false,
              metaMaskVisible: false,
              offChain: false,
            });
          });
        }}
      >
        WalletLink
      </div>
    );
  };

  connectWalletLink = async () => {
    if (this.state.connectedWalletLink) {
      this.disconnectWalletLink();
      return;
    }

    const { connected, account, walletLink } = await useWalletLink();
    if (connected) {
      this.props.setWalletLink(walletLink);
      console.log("Connected to WalletLink");
      this.setState({
        walletLink,
        connectedMetaMask: false,
        connectedWalletLink: connected,
        ethAccount: account,
        ethAccountIsValid: this.isAddress(account),
      });
    } else {
      console.log("Failed to connect WalletLink");
      this.setState({
        connectedMetaMask: false,
        connectedWalletLink: false,
      });
    }
  };

  disconnectWalletLink = async () => {
    if (this.state.walletLink) {
      this.state.walletLink.disconnect();
      console.log("Disconnected WalletLink");
    } else {
      console.log("Nothing to disconnect");
    }
    this.setState({
      connectedWalletLink: false,
    });
  };

  transitionScreen = (callback) => {
    this.setState({ transition: true }, () => {
      setTimeout(() => {
        callback();
        this.setState({ transition: false }, () => {
          if (this.state.offChain || !this.state.hasEthereum) {
            this.setState({ error: this.handleError(this.state.value) });
          }
        });
      }, 300);
    });
  };

  handleError = (value) => {
    if (!this.state.offChain) {
      if (value > Number(this.state.balance) || value < 0) {
        return true;
      } else {
        return false;
      }
    } else {
      if (value > this.props.user.balance || value < 0) {
        return true;
      }
    }
    return false;
  };

  renderSwitchNetworkMsg = () => {
    // TODO: For now let's just tell them to use rinkeby
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
    let {
      transition,
      userBalance,
      ethAccount,
      transactionHash,
      error,
      amount,
    } = this.state;
    return (
      <div className={css(styles.networkContainer)}>
        {transition ? (
          <Loader loading={true} />
        ) : transactionHash ? (
          <Fragment>
            <div className={css(styles.row, styles.top)}>
              <div className={css(styles.left)}>
                <div className={css(styles.mainHeader)}>
                  Withdrawal Successful
                  <span className={css(styles.icon)}>
                    <i className="fal fa-check-circle" />
                  </span>
                </div>
                <div
                  className={css(styles.confirmation)}
                  onClick={this.closeModal}
                >
                  Review your transactions in your
                  <Link
                    href={"/user/[authorId]/[tabName]"}
                    as={`/user/${this.props.auth.user.author_profile.id}/transactions`}
                  >
                    <a
                      href={"/user/[authorId]/[tabName]"}
                      as={`/user/${this.props.auth.user.author_profile.id}/transactions`}
                      className={css(styles.transactionHashLink)}
                    >
                      profile page
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className={css(styles.buttons, styles.confirmationButtons)}>
              <Button
                label={"Finish"}
                onClick={this.closeModal}
                customButtonStyle={styles.button}
              />
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className={css(styles.row, styles.top)}>
              <div className={css(styles.left)}>
                <div className={css(styles.mainHeader)}>Total Balance</div>
                <div className={css(styles.subtitle, styles.noMargin)}>
                  Your current total balance in ResearchCoin
                </div>
              </div>
              <div className={css(styles.right)}>
                <div className={css(styles.userBalance)}>
                  {formatBalance(userBalance)}
                  <img
                    className={css(styles.coin)}
                    src={"/static/icons/coin-filled.png"}
                    draggable={false}
                  />
                </div>
              </div>
            </div>
            <div className={css(styles.row, styles.numbers)}>
              <div className={css(styles.left)}>
                <div className={css(styles.mainHeader)}>Withdrawal Amount</div>
                <div className={css(styles.subtitle, styles.noMargin)}>
                  Select the withdrawal amount (min. 100 RSC)
                </div>
              </div>
              <div className={css(styles.right)}>
                <input
                  type="number"
                  className={css(styles.amountInput, error && styles.error)}
                  value={amount}
                  onChange={this.handleAmountInput}
                  min={"0"}
                  max={userBalance}
                  onKeyDown={onKeyDownNumInput}
                  onPaste={onPasteNumInput}
                />
              </div>
            </div>
            {this.renderRow(
              {
                text: "Recipient ETH Address",
                tooltip: "The address of your ETH Account (ex. 0x0000...)",
                onClick: "",
              },
              {
                value: ethAccount,
                onChange: this.handleNetworkAddressInput,
              }
            )}
            {!this.props.agreedToTerms && (
              <div className={css(styles.checkBoxContainer)}>
                <CheckBox
                  id={"tos"}
                  active={this.state.buttonEnabled}
                  isSquare={true}
                  label={
                    <span style={{ fontSize: 14, whiteSpace: "pre-wrap" }}>
                      I agree to the ResearchHub{" "}
                      <a href={"/about/tos"} target="_blank">
                        Terms of Service.
                      </a>
                    </span>
                  }
                  onChange={this.toggleButton}
                />
              </div>
            )}
            <div className={css(styles.buttons)}>
              <Button
                disabled={!this.state.buttonEnabled || !ethAccount}
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

  renderOverlay = () => {
    return (
      <div className={css(styles.overlay)} onClick={this.closeModal}>
        <div className={css(styles.bannerContainer)}>
          <div className={css(styles.overlayButtonContainer)}>
            <i
              className={
                css(styles.closeButton, styles.overlayButton) + " fal fa-times"
              }
              onClick={this.closeModal}
              draggable={false}
            />
          </div>
          <p className={css(styles.banner)}>
            Withdrawals will resume again on Sept. 1st.
          </p>
        </div>
      </div>
    );
  };

  renderContent = () => {
    let { connectedWalletLink, connectedMetaMask } = this.state;
    return (
      <div
        className={css(
          styles.modalContent,
          this.state.networkVersion === CURRENT_CHAIN_ID && styles.main
        )}
      >
        <div className={css(styles.header)}>Withdraw ResearchCoin</div>
        {this.renderToggleContainer(
          css(
            styles.toggleContainer,
            (connectedMetaMask || connectedWalletLink) && styles.marginBottom
          )
        )}
        <img
          src={"/static/icons/close.png"}
          className={css(styles.closeButton)}
          onClick={this.closeModal}
          draggable={false}
        />
        {!this.state.connectedMetaMask &&
          !this.state.connectedMetaMask &&
          this.state.ethAccountIsValid && (
            <div className={css(styles.connectStatus)}>
              <div className={css(styles.dot, styles.connected)} />
              Connected to Wallet
            </div>
          )}
        {this.state.connectedWalletLink && (
          <div className={css(styles.connectStatus)}>
            <div
              className={css(
                styles.dot,
                this.state.connectedWalletLink && styles.connected
              )}
            />
            Connected to WalletLink
          </div>
        )}
        {this.state.connectedMetaMask && (
          <div className={css(styles.connectStatus)}>
            <div
              className={css(
                styles.dot,
                this.state.connectedMetaMask && styles.connected
              )}
            />
            Connected to MetaMask
          </div>
        )}
        {this.state.connectedMetaMask &&
        this.state.networkVersion !== CURRENT_CHAIN_ID
          ? this.renderSwitchNetworkMsg()
          : this.renderTransactionScreen()}
      </div>
    );
  };

  render() {
    let { modals } = this.props;
    return (
      <BaseModal
        isOpen={modals.openWithdrawalModal}
        closeModal={this.closeModal}
        removeDefault={true}
      >
        {this.renderContent()}
        {/* {this.renderOverlay()} */}
      </BaseModal>
    );
  }
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 50,
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
  },
  disabled: {
    pointerEvents: "none",
    userSelect: "none",
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
    "@media only screen and (max-width: 415px)": {
      fontSize: 22,
    },
  },
  text: {
    fontSize: 18,
    color: "#82817d",
    fontWeight: 500,
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
    fontFamily: "Roboto",
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
      lineHeight: 1.5,
    },
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
    "@media only screen and (max-width: 557px)": {
      width: 380,
    },
    "@media only screen and (max-width: 410px)": {
      width: 300,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  top: {
    borderBottom: "none",
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
    "@media only screen and (max-width: 415px)": {
      height: 70,
    },
  },
  textLabel: {
    color: colors.BLACK(),
  },
  right: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end",
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
    "@media only screen and (max-width: 415px)": {
      fontSize: 20,
    },
  },
  input: {
    height: 60,
    width: 90,
    border: "1px solid #82817d",
    borderRadius: ".5rem",
  },
  checkBoxContainer: {
    marginTop: 40,
  },

  amountInput: {
    height: 50,
    width: 80,
    fontSize: 16,
    padding: "0 10px",
    boxSizing: "border-box",
    borderRadius: 4,
    borderColor: colors.BLACK(0.4),
  },
  error: {
    borderColor: "red",
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
    fontWeight: 500,
    "@media only screen and (max-width: 415px)": {
      fontSize: 16,
    },
  },
  coin: {
    height: 25,
    width: 25,
    marginTop: 1,
    marginLeft: 5,
  },
  formInput: {
    width: "100%",
  },
  buttons: {
    marginTop: 20,
  },
  button: {
    "@media only screen and (max-width: 415px)": {
      width: "100%",
    },
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
    marginTop: 15,
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
  pendingConnection: {
    backgroundColor: "#FDF2DE",
    border: `2px solid ${colors.YELLOW()}`,
    // #FDF2DE
  },
  confirmation: {
    color: "#000",
  },
  transactionHashLink: {
    cursor: "pointer",
    color: colors.BLUE(1),
    marginLeft: 6,
    ":hover": {
      textDecoration: "underline",
    },
  },
  icon: {
    color: colors.GREEN(1),
    marginLeft: 5,
  },
  confirmationButtons: {
    marginTop: 10,
  },
  toggleContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: 15,
  },
  marginBottom: {
    marginBottom: 20,
  },
  toggleContainerOnChain: {
    marginTop: 0,
  },
  toggle: {
    color: "rgba(36, 31, 58, 0.8)",
    cursor: "pointer",
    padding: "2px 8px",
    fontSize: 14,
    border: "1px solid #FFF",
    ":hover": {
      color: colors.BLUE(),
      background: "rgb(234, 235, 254)",
      borderRadius: 4,
    },
  },
  toggleRight: {
    marginLeft: 5,
  },
  activeToggle: {
    background: "#eaebfe",
    borderRadius: 4,
    color: colors.BLUE(),
    ":hover": {
      border: `1px solid ${colors.BLUE()}`,
    },
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerContainer: {
    background: "#FFF",
    padding: "25px 30px",
    boxShadow: "0 0 24px rgba(0, 0, 0, 0.14)",
    borderRadius: 4,
    position: "relative",
  },
  banner: {
    fontSize: 18,
  },
  overlayButtonContainer: {
    background: "#FFF",
    borderRadius: "50%",
    height: 30,
    width: 30,
    boxShadow: "0 0 24px rgba(0, 0, 0, 0.14)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    cursor: "pointer",
    top: -50,
    right: -2,
    ":hover": {
      color: colors.BLUE(),
    },
  },
  overlayButton: {
    position: "unset",
    top: "unset",
    right: "unset",
    height: "unset",
    width: "unset",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  modals: state.modals,
  agreedToTerms: state.auth.user.agreed_to_terms,
});

const mapDispatchToProps = {
  openWithdrawalModal: ModalActions.openWithdrawalModal,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  getUser: AuthActions.getUser,
  updateUser: AuthActions.updateUser,
  setWalletLink: AuthActions.setWalletLink,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithdrawalModal);
