import { Component, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";

// Component
import BaseModal from "./BaseModal";
import Loader from "../Loader/Loader";
import ETHAddressInput from "../Ethereum/ETHAddressInput";
import Button from "../Form/Button";
import { AmountInput, RecipientInput } from "../Form/RSCForm";
import FormSelect from "../Form/FormSelect";

// Redux
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

import colors, { alertColors } from "~/config/themes/colors";
import { sanitizeNumber } from "~/config/utils/form";
import {
  getEtherscanLink,
  getBasescanLink,
  isAddress,
  toCheckSumAddress,
} from "~/config/utils/crypto";
import { captureEvent } from "~/config/utils/events";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { partyPopper } from "~/config/themes/icons";
import UserStateBanner from "../Banner/UserStateBanner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/pro-regular-svg-icons";

const DepositScreen = dynamic(() => import("../Ethereum/DepositScreen"));

const GOERLY_CHAIN_ID = "5";
const MAINNET_CHAIN_ID = "1";

const CURRENT_CHAIN_ID =
  process.env.REACT_APP_ENV === "staging" ||
  process.env.NODE_ENV !== "production"
    ? GOERLY_CHAIN_ID
    : MAINNET_CHAIN_ID;

class WithdrawalModal extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      buttonEnabled: true,
      networkVersion: null,
      connectedMetaMask: false,
      connectedWalletLink: false,
      ethAccount: this.props.address,
      ethAccountIsValid: true,
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
      // api toggle
      metaMaskVisible: false,
      walletLinkVisible: false,
      selectedNetwork: "BASE",
      isLoadingFee: false,
    };
    this.state = {
      ...this.initialState,
    };

    this.provider = null;

    this.networkOptions = [
      {
        value: "BASE",
        label: "Base",
        icon: "/static/icons/base.png",
      },
      {
        value: "ETHEREUM",
        label: "Ethereum",
        icon: "/static/icons/ethereum.png",
      },
    ];
  }

  componentDidMount() {
    if (this.props.auth.isLoggedIn) {
      this.getBalance();
      this.getTransactionFee();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.auth.isLoggedIn) {
      if (this.props.address !== prevProps.address) {
        this.setState({
          ethAccount: this.props.address,
          ethAccountIsValid: false,
        });
      }
      if (!this.state.buttonEnabled && this.state.userBalance) {
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
        this.setState({
          depositScreen: this.props.modals.depositScreen,
        });
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
    const params = {
      network: this.state.selectedNetwork,
    };

    // Set loading state
    this.setState({ isLoadingFee: true });

    const queryString = new URLSearchParams(params).toString();
    const url = `${API.WITHDRAWAL_FEE}?${queryString}`;

    fetch(url, API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        if (this.state.transactionFee !== res) {
          this.setState({
            transactionFee: res,
            isLoadingFee: false, // Clear loading state on success
          });
        }
      })
      .catch((err) => {
        // Clear loading state on error
        this.setState({ isLoadingFee: false });
      });
  };

  checkNetwork = () => {
    if (!this.state.connectedMetaMask) {
      ethereum
        .send("eth_requestAccounts")
        .then((accounts) => {
          const account = accounts && accounts.result ? accounts.result[0] : [];
          this.setState({
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
    openWithdrawalModal(false);
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
        console.log(err);
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
    const { amount, transactionFee, userBalance, ethAccount, selectedNetwork } =
      this.state;

    if (this.props.auth.user.probable_spammer) {
      showMessage({ show: false });
      setMessage(
        "We've detected suspicious activity on your account. Please contact us to resolve your issues."
      );
      showMessage({ show: true, error: true });

      return;
    }

    if (amount < transactionFee) {
      showMessage({ show: false });
      setMessage(`Withdrawal amount must be at least ${transactionFee} RSC`);
      showMessage({ show: true, error: true });
      return;
    }

    if (amount > userBalance) {
      showMessage({ show: false });
      setMessage("Not enough RSC in balance");
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
        network: selectedNetwork,
      };
      return fetch(API.WITHDRAW_COIN({}), API.POST_CONFIG(param))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          const { id, paid_status, transaction_hash } = res;
          this.setTransactionHash(transaction_hash);
          this.getBalance();

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
          }
        })
        .catch((err) => {
          captureEvent({
            err,
            msg: "Failed to withdraw",
            data: param,
          });
          if (err.response.status === 429) {
            showMessage({ show: false, error: true });
            this.closeModal();
            return this.props.openRecaptchaPrompt(true);
          } else if (err.response.status === 403) {
            showMessage({ show: true, error: true });
            setMessage("Cannot withdraw funds at this time.");
          } else {
            err.name = "";
            showMessage({ show: false });
            setMessage(err.toString());
            showMessage({ show: true, error: true });
          }
        });
    } else {
      showMessage({ show: false });
      setMessage("Please enter a valid address.");
      showMessage({ show: true, error: true });
    }
  };

  renderToggleContainer = (className) => {
    return <div className={className}>{this.renderConnectWallet()}</div>;
  };

  renderConnectWallet = () => {
    return (
      <div
        className={css(
          styles.toggle,
          this.state.metaMaskVisible && styles.activeToggle
        )}
        onClick={async () => {
          await this.props.openWeb3ReactModal();
          this.transitionScreen(() =>
            this.setState({
              metaMaskVisible: true,
              walletLinkVisible: false,
            })
          );
        }}
      >
        Connect Wallet
      </div>
    );
  };

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
      emptyFncWithMsg("Failed to connect WalletLink");
      this.setState({
        connectedMetaMask: false,
        connectedWalletLink: false,
      });
    }
  };

  disconnectWalletLink = async () => {
    if (this.state.walletLink) {
      this.state.walletLink.disconnect();
      emptyFncWithMsg("Disconnected WalletLink");
    } else {
      emptyFncWithMsg("Nothing to disconnect");
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

  setTransactionHash = (transactionHash) => {
    this.setState({ transactionHash });
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
    const { transactionHash, depositScreen } = this.state;

    if (depositScreen) {
      return (
        <div className={css(styles.networkContainer)}>
          <DepositScreen
            provider={this.provider}
            ethAddressOnChange={this.handleNetworkAddressInput}
            onSuccess={this.setTransactionHash}
            setMessage={this.props.setMessage}
            showMessage={this.props.showMessage}
            openWeb3ReactModal={this.props.openWeb3ReactModal}
            {...this.state}
          />
        </div>
      );
    }

    return this.renderWithdrawalForm();
  };

  renderNetworkOption = (data, meta) => {
    const { value, label, icon } = data;
    const isSelected = meta.selectValue?.some(
      (selected) => selected.value === value
    );

    // Only show badge in the menu, not in the selected value display
    const showBadge = meta.context === "menu";

    const badge =
      showBadge &&
      (value === "BASE" ? (
        <div className={css(styles.badge, isSelected && styles.selectedBadge)}>
          Lower Fees
        </div>
      ) : (
        <div className={css(styles.badge, isSelected && styles.selectedBadge)}>
          Higher Fees
        </div>
      ));

    return (
      <div className={css(styles.networkOptionContainer)}>
        <div className={css(styles.iconColumn)}>
          <Image
            src={icon}
            alt={`${label} logo`}
            width={showBadge ? 30 : 20}
            height={showBadge ? 30 : 20}
          />
        </div>
        <div className={css(styles.networkOptionContent)}>
          <div className={css(styles.networkOptionHeader)}>
            <span>{label}</span>
            {badge}
          </div>
          {showBadge && (
            <div
              className={css(
                styles.networkDescription,
                isSelected && styles.selectedDescription
              )}
            >
              {value === "BASE"
                ? "Recommended network for low fees"
                : "Higher fees, with increased decentralization"}
            </div>
          )}
        </div>
      </div>
    );
  };

  renderWithdrawalForm = () => {
    const {
      ethAccount,
      amount,
      transactionFee,
      selectedNetwork,
      isLoadingFee,
    } = this.state;
    const isUnderInvestigation = this.props?.auth?.user?.probable_spammer;

    const isBase = selectedNetwork === "BASE";

    const feeDocUrl = isBase
      ? "https://docs.base.org/docs/fees/"
      : "https://ethereum.org/en/developers/docs/gas/";

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

        <FormSelect
          id="network"
          label="Network"
          placeholder="Select Network"
          value={this.networkOptions.find(
            (opt) => opt.value === selectedNetwork
          )}
          options={this.networkOptions}
          onChange={(id, option) => {
            this.setState(
              {
                selectedNetwork: option.value,
                transactionFee: null,
              },
              () => {
                this.getTransactionFee();
              }
            );
          }}
          formatOptionLabel={this.renderNetworkOption}
          containerStyle={styles.networkSelectContainer}
          inputStyle={styles.networkSelect}
          isSearchable={false}
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
          placeholder={"Enter withdrawal amount"}
          required={true}
          // minValue={5000}
          value={amount}
          onChange={this.handleAmountInput}
        />
        <div className={css(styles.row)}>
          <div className={css(styles.left)}>
            <div className={css(styles.mainHeader)}>Transaction Fee</div>
            <a
              href={feeDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={css(styles.description, styles.link)}
            >
              Learn more about fees.
            </a>
          </div>
          <div className={css(styles.right)}>
            {isLoadingFee ? <span>--</span> : transactionFee}
          </div>
        </div>
        <div className={css(styles.row)}>
          <div className={css(styles.left)}>
            <div className={css(styles.mainHeader)}>Total</div>
            <div className={css(styles.description)}>
              The total RSC transferred after fees.
            </div>
          </div>
          <div className={css(styles.right)}>{amount - transactionFee}</div>
        </div>

        {isUnderInvestigation && (
          <div className={css(styles.alert)}>
            <div style={{ textAlign: "center", fontSize: 28 }}>
              <FontAwesomeIcon icon={faExclamationTriangle} color={"#FFA500"} />
            </div>
            <div
              style={{
                textAlign: "center",
                paddingBottom: 10,
                borderBottom: "1px solid #dedede",
                fontWeight: 500,
              }}
            >
              Your account is currently under review by an administrator.
            </div>
            <div style={{ marginTop: 10, textAlign: "center" }}>
              Please open a&nbsp;
              <Link
                href="https://airtable.com/appuhMJaf1kb3ic8e/pagYeh6cB9sgiTIgx/form"
                style={{ color: colors.NEW_BLUE(), display: "inline-block" }}
                target="_blank"
              >
                support ticket
              </Link>{" "}
              and allow up to 72 hours for your ticket to be reviewed.
            </div>
          </div>
        )}

        <div className={css(styles.buttons)}>
          <Button
            disabled={!ethAccount || isLoadingFee || isUnderInvestigation}
            label={"Confirm"}
            type="submit"
            customButtonStyle={styles.button}
            rippleClass={styles.button}
          />
        </div>
      </form>
    );
  };

  renderSuccessScreen = () => {
    const { depositScreen, transactionHash, selectedNetwork } = this.state;

    const title = depositScreen
      ? "Deposit Successful"
      : "Withdrawal Successful";

    const isBase = selectedNetwork === "BASE";
    const explorerUrl = isBase
      ? getBasescanLink(transactionHash)
      : getEtherscanLink(transactionHash);
    const explorerName = isBase ? "Basescan" : "Etherscan";

    const confirmationMessage = depositScreen ? (
      <Fragment>
        {
          "Congrats! Your balance will update when the transfer is fully processed.\n\n"
        }
        Review your transaction details and status on
        <a
          href={explorerUrl}
          rel="noopener noreferrer"
          target="_blank"
          className={css(styles.transactionHashLink)}
        >
          {explorerName}
        </a>
        {" or in your"}
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${this.props.auth.user.author_profile.id}/transactions`}
          className={css(styles.transactionHashLink)}
        >
          profile page.
        </Link>
      </Fragment>
    ) : (
      <Fragment>
        {
          "Congrats! Your wallet balance will update when the transfer is fully processed.\n\n"
        }
        Review your transaction details and status on
        <a
          href={explorerUrl}
          rel="noopener noreferrer"
          target="_blank"
          className={css(styles.transactionHashLink)}
        >
          {explorerName}
        </a>
        {" or in your"}
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${this.props.auth.user.author_profile.id}/transactions`}
          className={css(styles.transactionHashLink)}
        >
          profile page.
        </Link>
      </Fragment>
    );

    return (
      <div className={css(styles.content)}>
        <img
          src={"/static/icons/close.png"}
          className={css(styles.closeButton)}
          onClick={this.closeModal}
          draggable={false}
          alt="Close Button"
        />
        <div className={css(styles.networkContainer)}>
          <div className={css(styles.successContainer)}>
            <div className={css(styles.title)}>
              {title}
              <span className={css(styles.icon)}>
                {partyPopper({ style: styles.partyIcon })}
              </span>
            </div>
            <div className={css(styles.confirmation)} onClick={this.closeModal}>
              {confirmationMessage}
            </div>
          </div>
          <div className={css(styles.buttons)}>
            <Button
              label={"Finish"}
              onClick={this.closeModal}
              customButtonStyle={styles.button}
              rippleClass={styles.button}
            />
          </div>
        </div>
      </div>
    );
  };

  renderTabs = () => {
    const { depositScreen } = this.state;

    return (
      <div className={css(styles.tabBar)}>
        <div
          className={css(
            styles.tab,
            !depositScreen && styles.tabActive
            // styles.oneTab
          )}
          onClick={() =>
            this.transitionScreen(() => this.setState({ depositScreen: false }))
          }
        >
          Withdraw
        </div>
        <div
          className={css(styles.tab, depositScreen && styles.tabActive)}
          onClick={() =>
            this.transitionScreen(() => this.setState({ depositScreen: true }))
          }
        >
          Deposit
        </div>
      </div>
    );
  };

  renderContent = () => {
    const { connectedMetaMask, networkVersion, transactionHash } = this.state;

    if (transactionHash) {
      return this.renderSuccessScreen();
    }

    return (
      <Fragment>
        {this.renderTabs()}
        <div className={css(styles.content)}>
          {this.renderToggleContainer(css(styles.toggleContainer))}
          {connectedMetaMask
            ? this.renderSwitchNetworkMsg()
            : this.renderTransactionScreen()}
          <img
            src={"/static/icons/close.png"}
            className={css(styles.closeButton)}
            onClick={this.closeModal}
            draggable={false}
            alt="Close Button"
          />
        </div>
      </Fragment>
    );
  };

  render() {
    const { modals } = this.props;
    return (
      <>
        <BaseModal
          isOpen={modals.openWithdrawalModal}
          closeModal={this.closeModal}
          removeDefault={true}
          modalStyle={styles.modal}
          modalContentStyle={styles.root}
        >
          {this.renderContent()}
        </BaseModal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  alert: {
    marginTop: 15,
    background: "rgb(255, 244, 229)",
    display: "flex",
    flexDirection: "column",
    padding: 15,
    color: colors.BLACK(0.9),
  },
  banner: {
    backgroundColor: alertColors.warning,
    color: colors.BLACK(),
    fontSize: 14,
  },
  modal: {
    transform: "translateX(-50%)",
    top: "10%",
  },
  root: {
    maxHeight: "90vh",
    overflowY: "scroll",
  },
  content: {
    padding: "0 50px 45px 50px",
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
    justifyContent: "center",
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
      color: colors.NEW_BLUE(),
    },
  },
  tabActive: {
    color: colors.NEW_BLUE(),
    border: "none",
    backgroundColor: "#FFF",
  },
  oneTab: {
    width: "100%",
    fontSize: 22,
    paddingTop: 30,
    color: colors.BLACK(),
    height: 30,
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
  successContainer: {
    paddingTop: 30,
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
    fontSize: 22,
    marginBottom: 25,
    textAlign: "center",
    color: colors.BLACK(),
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
    color: colors.NEW_BLUE(),
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
    marginTop: 20,
    width: "100%",
  },
  button: {
    width: "100%",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      height: 50,
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
    lineHeight: 1.3,
    whiteSpace: "pre-wrap",
    fontWeight: 400,
  },
  transactionHashLink: {
    cursor: "pointer",
    color: colors.BLUE(1),
    marginLeft: 5,
    textDecoration: "unset",
    ":hover": {
      textDecoration: "underline",
    },
  },
  icon: {
    color: colors.GREEN(1),
    marginLeft: 5,
  },
  partyIcon: {
    height: 25,
    marginLeft: 5,
  },
  confirmationButtons: {
    marginTop: 10,
  },
  toggleContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
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
  recipientInputStyles: {
    marginTop: 15,
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
  networkSelectContainer: {
    marginTop: 25,
    width: "100%",
  },
  networkSelect: {
    width: "100%",
    fontSize: 16,
    fontWeight: 400,
  },
  networkOptionContainer: {
    width: "100%",
    padding: "4px 0",
    display: "flex",
    alignItems: "center",
  },
  iconColumn: {
    width: 24,
    marginRight: 12,
    display: "flex",
    justifyContent: "center",
    paddingTop: 2,
  },
  networkOptionContent: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  networkOptionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  networkDescription: {
    fontSize: 12,
    lineHeight: 1.3,
    color: colors.TEXT_GREY(0.8),
  },
  selectedDescription: {
    color: colors.WHITE(),
  },
  badge: {
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 12,
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.NEW_BLUE(0.1),
    color: colors.BLACK(),
  },
  selectedBadge: {
    backgroundColor: colors.NEW_BLUE(),
    color: colors.WHITE(),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  modals: state.modals,
  // agreedToTerms: state.auth.user.agreed_to_terms,
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

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawalModal);
