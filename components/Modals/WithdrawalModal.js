import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";

import Link from "next/link";

// Component
import BaseModal from "./BaseModal";
import Loader from "../Loader/Loader";
import ETHAddressInput from "../Ethereum/ETHAddressInput";
import Button from "../Form/Button";
import DepositScreen from "../Ethereum/DepositScreen";
import { AmountInput, RecipientInput } from "../Form/RSCForm";

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
  formatBalance,
  isAddress,
  toCheckSumAddress,
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
      validating: false,
      transactionHash: "",
      // error for withdrawal input
      error: false,
      amount: 0,
      transactionFee: null,
      depositScreen: false,
    };
    this.state = {
      ...this.initialState,
    };

    this.provider = null;
  }

  componentDidMount() {
    if (this.props.auth.isLoggedIn) {
      this.getBalance();
      this.getTransactionFee();
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
        !this.state.transactionFee && this.getTransactionFee();
      }
      if (
        prevProps.auth.user.balance !== this.props.auth.user.balance ||
        this.state.userBalance === null
      ) {
        this.getBalance();
        !this.state.transactionFee && this.getTransactionFee();
      }
    }
  }

  getTransactionFee = () => {
    fetch(API.WITHDRAWAL_FEE, API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(
        (res) =>
          !this.state.transactionFee !== res &&
          this.setState({ transactionFee: res })
      );
  };

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
            }, 200);
        }
      );
    }
  };

  updateAccount = (accounts) => {
    let account = accounts && accounts[0] && accounts[0];
    let valid = isAddress(account);
    this.setState({
      ethAccount: account,
      ethAccountIsValid: valid,
    });
  };

  closeModal = () => {
    const { openWithdrawalModal } = this.props;
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
        const param = {
          balance: res.user.balance,
        };
        this.props.updateUser(param);
        this.setState({ userBalance: res.user.balance });
      })
      .catch((err) => {
        //Todo: handle error
      });
  };

  handleNetworkAddressInput = (id, value) => {
    const validETHAddress = isAddress(value);
    let nextState = {
      ethAccount: value,
      ethAccountIsValid: validETHAddress,
    };

    if (!validETHAddress) {
      nextState = {
        ...nextState,
        connectedMetaMask: false,
        connectedWalletLink: false,
        networkVersion: ethereum.networkVersion,
        metaMaskVisible: false,
        walletLinkVisible: false,
      };
    }

    this.setState({ ...nextState });
  };

  sendWithdrawalRequest = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { showMessage, setMessage } = this.props;
    const {
      buttonEnabled,
      amount,
      transactionFee,
      userBalance,
      ethAccount,
    } = this.state;

    if (!buttonEnabled) {
      showMessage({ show: false });
      setMessage("Please agree to the ResearchHub ToS.");
      showMessage({ show: true, error: true });
      return;
    }

    if (amount < 100) {
      showMessage({ show: false });
      setMessage("Withdrawal amount must be at least 100 RSC");
      showMessage({ show: true, error: true });
      return;
    }

    if (amount > userBalance) {
      showMessage({ show: false });
      setMessage("Not enough coins in balance");
      showMessage({ show: true, error: true });
      return;
    }
    showMessage({ load: true, show: true });
    if (isAddress(ethAccount)) {
      const param = {
        to_address: toCheckSumAddress(ethAccount),
        agreed_to_terms: true,
        amount: `${amount}`,
        transaction_fee: transactionFee,
      };
      fetch(API.WITHDRAW_COIN({}), API.POST_CONFIG(param))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          const { id, paid_status, transaction_hash } = res;
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
    const { connected, provider, account } = await useMetaMask();
    if (connected) {
      this.setUpEthListeners();
      console.log("Connected to MetaMask");
      this.setState({
        connectedMetaMask: connected,
        connectedWalletLink: false,
        ethAccount: account,
        networkVersion: ethereum.networkVersion,
        ethAccountIsValid: isAddress(account),
      });

      if (!this.provider) {
        this.provider = provider;
      }
    } else {
      console.log("Failed to connect MetaMask");
      this.setState({
        connectedMetaMask: false,
        connectedWalletLink: false,
      });
    }
  };

  setUpEthListeners() {
    if (!this.state.listnerNetwork && !this.state.listenerAccount) {
      this.setState({
        listenerNetwork: ethereum.on("networkChanged", () =>
          this.updateChainId(ethereum.networkVersion)
        ),
        listenerAccount: ethereum.on("accountsChanged", this.updateAccount),
      });
    }
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
              walletLinkVisible: true,
              connectedMetaMask: false,
              metaMaskVisible: false,
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
      return this.disconnectWalletLink();
    }

    const { connected, provider, account, walletLink } = await useWalletLink();
    if (connected) {
      this.props.setWalletLink(walletLink);
      console.log("Connected to WalletLink");
      this.setState({
        walletLink,
        connectedMetaMask: false,
        connectedWalletLink: connected,
        ethAccount: account,
        ethAccountIsValid: isAddress(account),
      });
      if (!this.provider) {
        this.provider = provider;
      }
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
      }, 100);
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
    const { transition } = this.state;
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
              alt="Metamask Network Screen"
            />
          </Fragment>
        )}
      </div>
    );
  };

  renderTransactionScreen = () => {
    const {
      transition,
      userBalance,
      ethAccount,
      transactionHash,
      depositScreen,
      error,
      amount,
    } = this.state;

    // if (transition) {
    //   return <Loader loading={true} />;
    // }

    if (transactionHash) {
      return (
        <div className={css(styles.networkContainer)}>
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
        </div>
      );
    }

    if (depositScreen) {
      return (
        <div className={css(styles.networkContainer)}>
          <DepositScreen
            provider={this.provider}
            ethAddressOnChange={this.handleNetworkAddressInput}
            {...this.state}
          />
        </div>
      );
    }

    return this.renderScreen();
  };

  renderConnectionStatus = () => {
    const {
      ethAccount,
      connectedWalletLink,
      connectedMetaMask,
      ethAccountIsValid,
    } = this.state;

    if (ethAccount && !ethAccountIsValid) {
      return (
        <div className={css(styles.connectStatus)}>
          <div className={css(styles.dot, styles.invalidAddress)} />
          <span className={css(styles.red)}>Invalid ETH address</span>
        </div>
      );
    }

    if (!connectedMetaMask && ethAccountIsValid) {
      return (
        <div className={css(styles.connectStatus)}>
          <div className={css(styles.dot, styles.connected)} />
          <span className={css(styles.green)}>Valid ETH address</span>
        </div>
      );
    }

    if (connectedWalletLink) {
      return (
        <div className={css(styles.connectStatus)}>
          <div
            className={css(styles.dot, connectedWalletLink && styles.connected)}
          />
          <span className={css(styles.green)}>Connected: WalletLink</span>
        </div>
      );
    }

    if (connectedMetaMask) {
      return (
        <div className={css(styles.connectStatus)}>
          <div
            className={css(styles.dot, connectedMetaMask && styles.connected)}
          />
          <span className={css(styles.green)}>Connected:</span>
          <img
            src={"/static/icons/metamask.svg"}
            className={css(styles.metaMaskIcon)}
          />
          MetaMask
        </div>
      );
    }
  };

  renderScreen = () => {
    const { ethAccount, amount, transactionFee } = this.state;

    return (
      <form
        className={css(styles.networkContainer)}
        onSubmit={this.sendWithdrawalRequest}
      >
        <RecipientInput
          containerStyles={styles.recipientInputStyles}
          cardStyles={styles.fullWidth}
          author={this.props.auth.user.author_profile}
          label={"From"}
        />
        <ETHAddressInput
          label="To"
          tooltip="The address of your ETH Account (ex. 0x0000...)"
          value={ethAccount}
          onChange={this.handleNetworkAddressInput}
          containerStyles={styles.ethAddressStyles}
          {...this.state}
        />
        <AmountInput
          rightAlignBalance={true}
          containerStyles={styles.amountInputStyles}
          inputContainerStyles={styles.fullWidth}
          inputStyles={[styles.fullWidth]}
          placeholder={"Enter the withdrawal amount (min. 100 RSC)"}
          required={true}
          minValue={100}
          value={amount}
          onChange={this.handleAmountInput}
        />
        <div className={css(styles.row)}>
          <div className={css(styles.left)}>
            <div className={css(styles.mainHeader)}>Network Fee</div>
            <a
              href={"https://ethereum.org/en/developers/docs/gas/"}
              target="_blank"
              rel="noopener noreferrer"
              className={css(styles.description, styles.link)}
            >
              Learn more about fees.
            </a>
          </div>
          <div className={css(styles.right)}>
            {formatBalance(transactionFee)}
          </div>
        </div>
        <div className={css(styles.row)}>
          <div className={css(styles.left)}>
            <div className={css(styles.mainHeader)}>Total</div>
            <div className={css(styles.description)}>
              The total RSC transferred after fees.
            </div>
          </div>
          <div className={css(styles.right)}>
            {formatBalance(amount - transactionFee)}
          </div>
        </div>
        <div className={css(styles.buttons)}>
          <Button
            disabled={!this.state.buttonEnabled || !ethAccount}
            label={"Confirm"}
            type="submit"
            customButtonStyle={styles.button}
            rippleClass={styles.button}
          />
        </div>
      </form>
    );
  };

  renderContent = () => {
    const { connectedMetaMask, networkVersion, depositScreen } = this.state;
    return (
      <Fragment>
        <div className={css(styles.tabBar)}>
          <div
            className={css(styles.tab, !depositScreen && styles.tabActive)}
            onClick={() =>
              this.transitionScreen(() =>
                this.setState({ depositScreen: false })
              )
            }
          >
            Withdraw
          </div>
          <div
            className={css(styles.tab, depositScreen && styles.tabActive)}
            onClick={() =>
              this.transitionScreen(() =>
                this.setState({ depositScreen: true })
              )
            }
          >
            Deposit to RH
          </div>
        </div>
        <div className={css(styles.content)}>
          {this.renderToggleContainer(css(styles.toggleContainer))}
          {connectedMetaMask && networkVersion !== CURRENT_CHAIN_ID
            ? this.renderSwitchNetworkMsg()
            : this.renderTransactionScreen()}
        </div>
      </Fragment>
    );
  };

  render() {
    const { modals } = this.props;
    return (
      <BaseModal
        isOpen={modals.openWithdrawalModal}
        closeModal={this.closeModal}
        removeDefault={true}
      >
        {this.renderContent()}
      </BaseModal>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    padding: "0 50px 50px 50px",
    "@media only screen and (max-width: 767px)": {
      padding: "0 25px 25px 25px",
    },
  },
  disabled: {
    pointerEvents: "none",
    userSelect: "none",
  },
  tabBar: {
    display: "flex",
    width: "100%",
  },
  tab: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    height: 64,
    fontSize: 20,
    fontWeight: 500,
    cursor: "pointer",
    backgroundColor: "rgba(17, 51, 83, 0.02)",
    borderLeft: "1px solid rgb(236, 239, 241)",
    borderRight: "1px solid rgb(236, 239, 241)",
    borderBottom: "1px solid rgb(236, 239, 241)",
    color: "rgba(17, 51, 83, 0.6)",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  tabActive: {
    color: colors.BLUE(),
    border: "none",
    backgroundColor: "#FFF",
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
    width: 400,
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
  header: {
    fontWeight: "500",
    height: 30,
    width: "100%",
    fontSize: 26,
    color: "#232038",
    textAlign: "center",
    marginBottom: 20,
    // test css
    marginTop: 20,
    // end test css
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
    lineHeight: 1.5,
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
      lineHeight: 1.5,
    },
  },
  description: {
    fontSize: 14,
    paddingTop: 5,
    color: "#83817c",
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
    },
  },
  link: {
    cursor: "pointer",
    textDecoration: "unset",
    color: colors.BLUE(),
    ":hover": {
      textDecoration: "underline",
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
    width: "100%",
    padding: "20px 0 20px",
  },
  top: {
    borderBottom: "none",
  },
  spacedContent: {
    width: "100%",
    marginTop: 20,
  },
  left: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    color: "#82817D",
    height: 40,
    fontFamily: "Roboto",
    "@media only screen and (max-width: 415px)": {
      height: 70,
    },
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
    lineSpacing: 1.2,
    color: colors.BLACK(),
    position: "relative",
  },
  placeholderIcon: {
    position: "absolute",
    color: colors.BLUE(),
    fontSize: 18,
    height: 32,
    width: 32,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    border: `1px solid rgb(232, 232, 242)`,
    top: 38,
    left: 10,
    zIndex: 4,
    cursor: "pointer",
  },
  metaMaskIcon: {
    height: 20,
    margin: "0px 5px",
  },
  textLabel: {
    color: colors.BLACK(),
  },
  right: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 500,
    height: 40,
    fontFamily: "Roboto",
  },
  orientRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  noMargin: {
    margin: 0,
    color: colors.BLUE(),
  },
  mainHeader: {
    fontWeight: "500",
    fontSize: 16,
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
    width: 90,
    fontSize: 16,
    padding: "0 8px",
    boxSizing: "border-box",
    borderRadius: 4,
    borderColor: colors.BLACK(0.4),
  },
  gasInput: {
    width: 90,
    padding: "0 5px",
  },
  error: {
    borderColor: "red",
  },
  infoIcon: {
    marginLeft: 5,
    cursor: "pointer",
    color: colors.BLACK(0.4),
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
  smallCoin: {
    height: 20,
    width: 20,
  },
  formInput: {
    width: "100%",
    margin: 0,
    padding: 0,
    minHeight: "unset",
  },
  buttons: {
    marginTop: 35,
    width: "100%",
  },
  button: {
    width: "100%",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
    },
  },
  successIcon: {
    color: "#7ae9b1",
    fontSize: 25,
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
    justifyContent: "flex-end",
    alignItems: "center",
    width: "max-content",
    fontSize: 14,
  },
  dot: {
    height: 5,
    maxHeight: 5,
    minHeight: 5,
    width: 5,
    maxWidth: 5,
    minWidth: 5,
    borderRadius: "50%",
    marginRight: 5,
    backgroundColor: "#f9f4d3",
    border: "2px solid #f8de5a",
  },
  connected: {
    backgroundColor: "#d5f3d7",
    border: "2px solid #7ae9b1",
  },
  invalidAddress: {
    backgroundColor: colors.RED(0.7),
    border: `2px solid ${colors.RED()}`,
  },
  red: {
    color: colors.RED(),
  },
  green: {
    color: colors.GREEN(),
  },
  pendingConnection: {
    backgroundColor: "#FDF2DE",
    border: `2px solid ${colors.YELLOW()}`,
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
    marginTop: 30,
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
  recipientInputStyles: {
    marginTop: 25,
    width: "100%",
  },
  ethAddressStyles: {
    marginTop: 25,
  },
  amountInputStyles: {
    width: "100%",
    paddingBottom: 30,
    borderBottom: "1px dashed #E7E5E4",
  },
  fullWidth: {
    width: "100%",
    fontSize: 16,
    fontWeight: 400,
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
