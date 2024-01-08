import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import { Component, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Link from "next/link";
import { withAlert } from "react-alert";
import ReactTooltip from "react-tooltip";
import { keccak256, sha3_256 } from "js-sha3";
import miniToken from "./Artifacts/mini-me-token";
import contractAbi from "./Artifacts/contract-abi";
import { ethers } from "ethers";
import numeral from "numeral";
import * as Sentry from "@sentry/browser";

// Component
import BaseModal from "./BaseModal";
import Loader from "~/components/Loader/Loader";
import Button from "~/components/Form/Button";
import FormInput from "~/components/Form/FormInput";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { AuthActions } from "~/redux/auth";

// Config
import colors from "~/config/themes/colors";

import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { RINKEBY_CHAIN_ID } from "../../config/constants";
import { sendAmpEvent } from "~/config/fetch";
import {
  sanitizeNumber,
  onKeyDownNumInput,
  onPasteNumInput,
  formatBalance,
} from "~/config/utils/form";
import {
  emptyFncWithMsg,
  isEmpty,
  isNullOrUndefined,
} from "~/config/utils/nullchecks";

// Constants
import {
  ContentTypes,
  ChainStatus,
  SUPPORT_MIN_RSC_REQUIRED,
  SUPPORT_MAX_RSC_REQUIRED,
  SUPPORT_DEFAULT_AMOUNT,
  SUPPORT_RH_PERCENTAGE,
} from "./constants/SupportContent";
import { getEtherscanLink } from "~/config/utils/crypto";
import { parsePurchase } from "~/config/types/purchase";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import { withExchangeRate } from "../contexts/ExchangeRateContext";
const RinkebyRSCContractAddress = "0xD101dCC414F310268c37eEb4cD376CcFA507F571";
const RinkebyAppPurchaseContractAddress =
  "0x9483992e2b67fd45683d9147b63734c7a9a7eb82";

class PaperTransactionModal extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      value: SUPPORT_DEFAULT_AMOUNT,
      error: false,
      nextScreen: true,
      offChain: true,
      transition: false,
      // OnChain
      metaMaskVisible: false,
      walletLinkVisible: false,
      balance: 0,
      hasEthereum: false,
      networkVersion: null,
      ethAccount: "",
      connectedMetaMask: false,
      connectedWalletLink: false,
      ethProvider: null,
      listenerNetwork: null,
      listenerAccount: null,
      validating: false,
      ethAccountIsValid: false,
      transactionHash: "",
      AppPurchaseContractAddress: RinkebyAppPurchaseContractAddress,
      RSCContractAddress: RinkebyRSCContractAddress,
      // Finish
      finish: false,
    };
    this.state = {
      ...this.initialState,
    };

    // Contract Constants
    this.provider;
    this.signer;
    this.RSCContract;
  }

  closeModal = () => {
    this.setState({ ...this.initialState }, () => {
      this.props.openPaperTransactionModal(false);
    });
  };

  componentDidMount() {
    if (this.handleError(this.state.value)) {
      this.setState({ error: true });
    }
  }

  componentDidUpdate() {
    if (this.handleError(this.state.value) && !this.state.error) {
      this.setState({ error: true });
    }
  }

  createContract = async (provider) => {
    this.provider = provider;
    this.signer = this.provider.getSigner(0);
    ethereum.autoRefreshOnNetworkChange = false;

    let address = this.state.RSCContractAddress;
    const { chainId } = await provider.getNetwork();
    if (String(chainId) === RINKEBY_CHAIN_ID) {
      address = RinkebyRSCContractAddress;
    }

    this.RSCContract = new ethers.Contract(
      address,
      miniToken.abi,
      this.provider
    );
    return this.RSCContract;
  };

  checkRSCBalance = async (contract, account) => {
    let rawBalance = await contract.balanceOf(account);
    let balance = ethers.utils.formatUnits(rawBalance, 18);
    this.setState({ balance }, () => {
      this.setState({
        error: this.handleError(this.state.value),
      });
    });
  };

  signTransaction = async (item) => {
    let { setMessage, showMessage, paper, onTransactionCreate } = this.props;
    let { purchase_hash, id } = item;
    let allow = true;

    const appContract = new ethers.Contract(
      this.state.AppPurchaseContractAddress,
      contractAbi,
      this.provider
    );

    let rawAllowance = await this.RSCContract.functions.allowance(
      this.state.ethAccount,
      appContract.address
    );

    let allowance = ethers.utils.formatUnits(rawAllowance[0], 18);

    if (Number(allowance) < Number(this.state.value)) {
      allow = await this.RSCContract.connect(this.signer)
        .functions.approve(
          appContract.address,
          ethers.utils.parseEther(`${this.state.value}`)
        )
        .catch((err) => {
          Sentry.captureException(err);
        });
    }

    if (allow) {
      let hash = await appContract
        .connect(this.signer)
        .functions.buy(
          this.state.RSCContractAddress, // address of token contract
          ethers.utils.parseEther(`${this.state.value}`), // amount of RSC parsed
          ethers.utils.hexZeroPad(`0x${purchase_hash}`, 32) // convert item to bytes, (item)
        )
        .catch((err) => {
          Sentry.captureException(err);
        });

      if (!hash) {
        showMessage({ show: false });
        setMessage(
          "Transaction failed. Please email hello@researchhub.com for help."
        );
        return showMessage({ show: true, error: true });
      }

      let payload = { transaction_hash: hash.hash };

      return fetch(API.PROMOTION({ purchaseId: id }), API.PATCH_CONFIG(payload))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          showMessage({ show: false });
          setMessage("Transaction Successful!");
          showMessage({ show: true });
          this.setState({ transactionHash: hash.hash }, () => {
            let promoted = paper.promoted ? paper.promoted : 0;
            let updatedPaper = { ...papers };
            updatedPaper.promoted = promoted + Number(this.state.value);
            this.setState({ finish: true });
          });
        })
        .catch((err) => {
          showMessage({ show: false });
          setMessage("Something went wrong.");
          showMessage({ show: true, error: true });
        });
    } else {
      showMessage({ show: false });
      setMessage(
        "Transaction failed. Please email hello@researchhub.com for help."
      );
      showMessage({ show: true, error: true });
    }
  };

  openTransactionConfirmation = (url) => {
    let win = window.open(url, "_blank");
    win.focus();
  };

  updateBalance = () => {
    if (!this.props.auth.isLoggedIn) {
      return;
    }
    fetch(API.WITHDRAW_COIN({}), API.GET_CONFIG())
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
      });
  };

  handleInput = (e) => {
    const inputValue = e.target.value.replace(/^0+/, "");
    const value = inputValue ? parseInt(sanitizeNumber(inputValue)) : "";

    this.setState({
      value,
      error: this.handleError(value),
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

  confirmTransaction = () => {
    let { value, error } = this.state;
    if (error) {
      this.props.setMessage("Not enough coins in balance");
      return this.props.showMessage({
        show: true,
        clickoff: true,
        error: true,
      });
    }
    if (value === 0) {
      this.props.setMessage("Must spend at least 1 RSC");
      return this.props.showMessage({
        show: true,
        clickoff: true,
        error: true,
      });
    }

    /** Add this back if we want confirmation message (3.18.21) */
    // return this.props.alert.show({
    //   text: `Use ${value} RSC to support this paper?`,
    //   buttonText: "Yes",
    //   onClick: () => {
    //     this.sendTransaction();
    //   },
    // });

    this.sendTransaction();
  };

  sendTransaction = () => {
    const { showMessage, setMessage, onTransactionCreate, paper, post, user } =
      this.props;
    showMessage({ show: true, load: true });

    const isPaper = !isNullOrUndefined(paper);
    const documentId = isPaper ? paper.id : post.id;
    const contentType = isPaper
      ? ContentTypes.PAPER
      : ContentTypes.RESEARCHHUB_POST;
    const { id: userId } = user;

    const payload = {
      amount: Number(this.state.value),
      object_id: documentId,
      content_type: contentType,
      user: userId,
      purchase_method: this.state.offChain
        ? ChainStatus.OFF_CHAIN
        : ChainStatus.ON_CHAIN,
      purchase_type: "BOOST",
    };

    fetch(API.PROMOTE, API.POST_CONFIG(payload))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        if (!this.state.offChain) {
          const item = { ...res };
          this.signTransaction(item);
        } else {
          // Send AMP Event
          const payload = {
            event_type: "create_purchase",
            time: +new Date(),
            insert_id: `purchase_${res.id}`,
            user_id: this.props.auth.user
              ? this.props.auth.user.id && this.props.auth.user.id
              : null,
            event_properties: {
              interaction: this.state.offChain
                ? ChainStatus.OFF_CHAIN
                : ChainStatus.ON_CHAIN,
              object_id: documentId,
              content_type: contentType,
              amount: Number(this.state.value),
            },
          };
          sendAmpEvent(payload);

          showMessage({ show: false });
          setMessage("Transaction Successful!");
          showMessage({ show: true });
          this.transitionScreen(() => {
            this.setState({
              transactionHash: res.trasaction_hash,
              finish: true,
            });
            if (isPaper) {
              const promoted = !isNullOrUndefined(res.source.promoted)
                ? res.source.promoted
                : null;
            } else {
              const promoted = !isNullOrUndefined(res.source.promoted)
                ? res.source.promoted
                : null;
            }
            this.updateBalance();

            const purchase = parsePurchase({
              amount: res.amount,
              user: this.props.user,
            });
            onTransactionCreate && onTransactionCreate(purchase);
          });
        }
      })
      .catch((err) => {
        if (err.response.status === 429) {
          showMessage({ show: false });
          this.closeModal();
          return this.props.openRecaptchaPrompt(true);
        }
        showMessage({ show: false });
        setMessage("Something went wrong.");
        showMessage({ show: true, error: true });
      });
  };

  checkBalance = (contract, accountAddress = null) => {
    let account = accountAddress ? accountAddress : this.state.ethAccount;
    this.checkRSCBalance(contract, account);
  };

  updateChainId = (chainId) => {
    // TODO: Error if not 1 or 4
    if (chainId !== this.state.networkVersion) {
      let transition = false;
      if (this.state.networkVersion !== "1" && chainId === "1") {
        transition = true;
      }
      if (this.state.networkVersion === "1" && chainId !== "1") {
        transition = true;
      }

      // TODO: Replace this with mainnet addresses
      let RSCContractAddress = "";
      let AppPurchaseContractAddress = "";
      if (chainId === "4") {
        RSCContractAddress = RinkebyRSCContractAddress;
        AppPurchaseContractAddress = RinkebyAppPurchaseContractAddress;
      }

      this.setState(
        {
          networkVersion: chainId, // shows the eth network
          transition: transition,
          RSCContractAddress,
          AppPurchaseContractAddress,
        },
        () => {
          this.state.transition &&
            setTimeout(() => {
              this.setState(
                {
                  transition: false,
                },
                () => this.checkRSCBalance(this.state.ethAccount)
              );
            }, 300);
        }
      );
    }
  };

  updateAccount = (accounts) => {
    let account = accounts && accounts[0] && accounts[0];
    this.setState(
      {
        ethAccount: account,
      },
      () => {
        this.checkRSCBalance(account);
      }
    );
  };

  handleNetworkAddressInput = (id, value) => {
    this.setState(
      {
        ethAccount: value,
        validating: true,
      },
      () => {
        this.setState({
          validating: false,
          ethAccountIsValid: this.isAddress(this.state.ethAccount),
          balance: this.isAddress(this.state.ethAccount)
            ? this.checkBalance(value)
            : null,
        });
      }
    );
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
            <div className={css(styles.instruction)}>
              Simply open MetaMask and switch over {"\n"}to the
              <b>{" Rinkeby Test Network"}</b>
            </div>
          </Fragment>
        )}
      </div>
    );
  };

  setUpEthListeners() {
    this.setState({
      listenerNetwork: ethereum.on("networkChanged", () =>
        this.updateChainId(ethereum.networkVersion)
      ),
      listenerAccount: ethereum.on("accountsChanged", this.updateAccount),
    });
  }

  updateContractBalance = async (provider) => {
    const contract = await this.createContract(provider);
    this.checkBalance(contract);
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

  parseValue = () => {
    let value = this.state.value;
    if (value !== null) {
      return value;
    } else {
      return 0;
    }
  };
  renderToggleContainer = (className) => {
    return (
      <div className={className}>
        <div
          className={css(
            styles.toggle,
            styles.toggleRight,
            this.state.offChain && styles.activeToggle
          )}
          onClick={() =>
            this.transitionScreen(() =>
              this.setState({
                nextScreen: true,
                offChain: true,
                metaMaskVisible: false,
                walletLinkVisible: false,
              })
            )
          }
        >
          In-App
        </div>
      </div>
    );
  };

  calcResearchHubAmount = ({ offeredAmount }) => {
    if (offeredAmount === 0) {
      return 0;
    }
    return parseFloat(
      ((SUPPORT_RH_PERCENTAGE / 100) * offeredAmount).toFixed(10)
    );
  };

  calcTotalAmount = ({ offeredAmount }) => {
    if (isNullOrUndefined(offeredAmount) || isEmpty(offeredAmount)) {
      return 0;
    }
    return (
      parseFloat(offeredAmount + "") +
      this.calcResearchHubAmount({ offeredAmount })
    );
  };

  renderContent = (isPaper) => {
    const { user } = this.props;
    const {
      nextScreen,
      offChain,
      transition,
      connectedMetaMask,
      ethAccount,
      networkVersion,
      validating,
      ethAccountIsValid,
      finish,
      transactionHash,
    } = this.state;

    const researchHubAmount = this.calcResearchHubAmount({
      offeredAmount: this.state.value,
    });
    const totalAmount = this.calcTotalAmount({
      offeredAmount: this.state.value,
    });
    const hasMinRscError =
      this.state.value < 10 || (user && user.balance < totalAmount);
    const hasMaxRscError = this.state.value > SUPPORT_MAX_RSC_REQUIRED;

    if (finish) {
      return (
        <Fragment>
          <div className={css(styles.row)}>
            <div className={css(styles.column)}>
              <div className={css(styles.mainHeader)}>
                Transaction Successful
                <span className={css(styles.icon)}>
                  {<FontAwesomeIcon icon={faCheckCircle}></FontAwesomeIcon>}
                </span>
              </div>
              {!offChain && (
                <div className={css(styles.confirmation)}>
                  Click{" "}
                  <span
                    className={css(styles.transactionHashLink)}
                    onClick={() =>
                      this.openTransactionConfirmation(
                        getEtherscanLink(transactionHash)
                      )
                    }
                  >
                    here
                  </span>{" "}
                  to view the transaction confirmation.
                </div>
              )}
              <div onClick={this.closeModal}>
                You can view the {isPaper ? "papers" : "posts"} you support on
                your
                <Link
                  href={`/user/${user.author_profile.id}/overview`}
                  as={`/user/${user.author_profile.id}/overview`}
                  className={css(styles.transactionHashLink, styles.marginLeft)}
                >
                  profile page.
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
      );
    } else if (nextScreen && offChain) {
      return (
        <div className={css(styles.content, transition && styles.transition)}>
          <ReactTooltip
            id="commission"
            effect="solid"
            className={css(bountyTooltip.tooltipContainer)}
            delayShow={150}
          >
            <div className={css(bountyTooltip.bodyContainer)}>
              <div className={css(bountyTooltip.desc)}>
                <div>
                  • 1% of tip amount will be used to support the ResearchHub
                  Community
                </div>
                <div>• 2% of tip amount will be paid to ResearchHub Inc</div>
              </div>
            </div>
          </ReactTooltip>
          <ReactTooltip
            id="net"
            effect="solid"
            className={css(
              bountyTooltip.tooltipContainer,
              bountyTooltip.tooltipContainerSmall
            )}
            delayShow={150}
          >
            <div className={css(bountyTooltip.bodyContainer)}>
              <div className={css(bountyTooltip.desc)}>
                Amount including fees
              </div>
            </div>
          </ReactTooltip>
          {/* {this.renderToggleContainer(css(styles.toggleContainer))} */}
          <div
            className={css(
              styles.lineItem,
              styles.borderBottom,
              styles.balanceLine
            )}
          >
            <div className={css(styles.lineItemText, styles.balanceText)}>
              Current Balance
            </div>
            <div className={css(styles.lineItemValue, styles.balanceValue)}>
              <span className={css(styles.valueNumber)}>
                <span>{formatBalance(Math.floor(user && user.balance))}</span>
                <img
                  src={"/static/icons/coin-filled.png"}
                  draggable={false}
                  className={css(styles.coinIcon)}
                  alt="RSC Coin"
                />
              </span>
            </div>
          </div>
          <div className={css(styles.lineItem, styles.offeringLine)}>
            <div className={css(styles.lineItemText, styles.offeringText)}>
              I am tipping
            </div>
            <div className={css(styles.lineItemValue, styles.offeringValue)}>
              <span className={css(styles.valueNumber, styles.valueInInput)}>
                <input
                  className={css(
                    styles.input,
                    this.state.error && styles.error
                  )}
                  type="number"
                  min={"0"}
                  max={user && user.balance}
                  value={this.state.value}
                  onChange={this.handleInput}
                  pattern="\d*"
                  onKeyDown={onKeyDownNumInput}
                  onPaste={onPasteNumInput}
                />
              </span>
              <span className={css(styles.rscText)}>RSC</span>
            </div>
          </div>

          <div className={css(styles.lineItem, styles.platformFeeLine)}>
            <div className={css(styles.lineItemText)}>
              Platform Fee ({SUPPORT_RH_PERCENTAGE}%){` `}
              <span
                className={css(styles.tooltipIcon)}
                data-tip={""}
                data-for="commission"
              >
                {<FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>}
              </span>
            </div>
            <div className={css(styles.lineItemValue)}>
              <span className={css(styles.valueNumber)}>
                <span>+ {researchHubAmount.toLocaleString()}</span>
              </span>
              <span className={css(styles.rscText)}>RSC</span>
            </div>
          </div>

          <div className={css(styles.lineItem, styles.netAmountLine)}>
            <ReactTooltip effect="solid" />
            <div className={css(styles.lineItemText)}>
              Total
              <span
                className={css(styles.tooltipIcon)}
                data-tip={""}
                data-for="net"
              >
                {<FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>}
              </span>
            </div>
            <div className={css(styles.lineItemValue, styles.netAmountValue)}>
              <span className={css(styles.valueNumber)}>
                <span>{totalAmount.toLocaleString()}</span>
                <ResearchCoinIcon
                  overrideStyle={styles.rscIcon}
                  width={20}
                  height={20}
                />
              </span>
              <span className={css(styles.rscText)}>RSC</span>
            </div>
          </div>
          <div className={css(styles.usdValue)}>
            ≈ {this.props.rscToUSDDisplay(totalAmount)}{" "}
            <span style={{ marginLeft: 22 }}>USD</span>
          </div>
          <div className={css(styles.buttonRow)}>
            {hasMinRscError ? (
              <div className={css(alertStyles.alert, alertStyles.rscAlert)}>
                {user && user.balance < totalAmount
                  ? `Your RSC balance is below ${numeral(totalAmount).format(
                      "0[,]0[.]00"
                    )}`
                  : `Minimum tip is ${SUPPORT_MIN_RSC_REQUIRED} RSC`}
              </div>
            ) : hasMaxRscError ? (
              <div className={css(alertStyles.alert, alertStyles.rscAlert)}>
                Tip amount cannot exceed 100,000 RSC
              </div>
            ) : (
              <div />
            )}
            <Button
              label="Confirm"
              onClick={this.confirmTransaction}
              disabled={hasMinRscError || hasMaxRscError}
            />
          </div>
        </div>
      );
    } else if (nextScreen && !offChain) {
      return (
        <div className={css(styles.content, transition && styles.transition)}>
          {connectedMetaMask && networkVersion !== RINKEBY_CHAIN_ID ? (
            this.renderSwitchNetworkMsg()
          ) : (
            <Fragment>
              {/* {this.renderToggleContainer(
                css(styles.toggleContainer, styles.toggleContainerOnChain)
              )} */}
              {connectedMetaMask && (
                <div className={css(styles.connectStatus)}>
                  <div
                    className={css(
                      styles.dot,
                      connectedMetaMask && styles.connected
                    )}
                  />
                  {"Connected wallet: MetaMask"}
                </div>
              )}
              <div className={css(styles.inputLabel)}>
                {"Wallet Address"}
                <span
                  className={css(styles.infoIcon)}
                  data-tip={"The address of your ETH Account (ex. 0x0000...)"}
                >
                  {<FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>}
                  <ReactTooltip />
                </span>
              </div>
              <FormInput
                value={ethAccount}
                containerStyle={styles.formInput}
                // onChange={this.handleNetworkAddressInput}
                // disabled={true}
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
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                          ></FontAwesomeIcon>
                        ) : (
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                          ></FontAwesomeIcon>
                        )}
                      </span>
                    )
                  ) : null
                }
              />

              <div className={css(styles.row, styles.numbers, styles.border)}>
                <div className={css(styles.column, styles.left)}>
                  <div className={css(styles.title)}>{"Total Balance"}</div>
                  <div className={css(styles.subtitle)}>
                    {"Your current wallet balance in RSC"}
                  </div>
                </div>
                <div className={css(styles.column, styles.right)}>
                  <div className={css(styles.userBalance)}>
                    {formatBalance(this.state.balance)}
                    <img
                      src={"/static/icons/coin-filled.png"}
                      draggable={false}
                      className={css(styles.coinIcon)}
                      alt="RSC Coin"
                    />
                  </div>
                </div>
              </div>
              <div className={css(styles.row, styles.numbers)}>
                <div className={css(styles.column, styles.left)}>
                  <div className={css(styles.title)}>{"Amount"}</div>
                  <div className={css(styles.subtitle)}>
                    {"Select the amount of RSC"}
                  </div>
                </div>
                <div className={css(styles.column, styles.right)}>
                  <input
                    type="number"
                    className={css(
                      styles.input,
                      this.state.error && styles.error
                    )}
                    value={this.state.value}
                    onChange={this.handleInput}
                  />
                </div>
              </div>

              <div className={css(styles.buttonRow)}>
                <Button label="Confirm" onClick={this.confirmTransaction} />
              </div>
            </Fragment>
          )}
        </div>
      );
    }
  };

  render() {
    const { modals, paper } = this.props;
    const isPaper = !isNullOrUndefined(paper);

    return (
      <BaseModal
        isOpen={modals.openPaperTransactionModal}
        closeModal={this.closeModal}
        modalStyle={styles.modalStyle}
        modalContentStyle={styles.modalContentStyle}
        title={`Tip Authors`}
      >
        {this.renderContent(isPaper)}
      </BaseModal>
    );
  }
}

const alertStyles = StyleSheet.create({
  alert: {
    fontSize: 14,
    textAlign: "left",
    color: colors.DARKER_GREY(),
  },
  rscAlert: {
    color: colors.RED(),
  },
  previewAlert: {},
});

const bountyTooltip = StyleSheet.create({
  tooltipContainer: {
    textAlign: "left",
    width: 300,
    padding: 12,
  },
  tooltipContainerSmall: {
    width: "auto",
  },
  bodyContainer: {},
  title: {
    textAlign: "center",
    color: "white",
    fontWeight: 500,
    marginBottom: 8,
  },
  desc: {
    fontSize: 13,
    lineHeight: "20px",
  },
});

const styles = StyleSheet.create({
  modalStyle: {
    maxWidth: 500,

    "@media only screen and (min-width: 768px)": {
      width: 500,
    },
  },
  modalContentStyle: {
    padding: 40,
    maxWidth: 550,
    "@media only screen and (max-width: 767px)": {
      padding: 40,
      minWidth: "unset",
      width: "100%",
    },
    "@media only screen and (max-width: 415px)": {
      padding: 40,
      paddingTop: 50,
    },
  },
  content: {
    width: "100%",
    opacity: 1,
    transition: "all ease-in-out 0.2s",
    position: "relative",
    paddingTop: 40,
    "@media only screen and (max-width: 557px)": {
      boxSizing: "border-box",
    },
  },
  transition: {
    opacity: 0,
  },
  description: {
    marginTop: 15,
    marginBottom: 15,
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
    },
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    boxSizing: "border-box",
    padding: "20px 0",
  },
  networkContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    transition: "all ease-in-out 0.3s",
    marginTop: 20,
  },
  borderBottom: {
    borderBottom: ".1rem dotted #e7e6e4",
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 12,
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
  amountContainer: {
    justifyContent: "space-between",
    position: "relative",
    minHeight: 60,
  },
  mainHeader: {
    fontWeight: "500",
    fontSize: 22,
    color: "#000 ",
    width: "100%",
    marginTop: 20,
    marginBottom: 10,
  },
  icon: {
    color: colors.GREEN(1),
    marginLeft: 5,
  },
  mobileCenter: {
    paddingTop: 10,
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
    },
  },
  center: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  numbers: {
    alignItems: "flex-end",
  },
  input: {
    width: 80,
    marginRight: "-8px",
    textAlign: "right",
    padding: "5px 7px",
    borderRadius: 2,
    border: `1px solid rgb(229 229 230)`,
    background: "#FBFBFD",
    fontSize: 16,
    [`[type="number"]`]: {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  error: {
    borderColor: "red",
  },
  title: {
    fontSize: 19,
    color: "#2a2825",
    fontWeight: 500,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#82817d",
    display: "flex",
    alignItems: "center",
    // fontWeight: 500
  },
  instruction: {
    color: "#83817c",
    fontSize: 14,
    marginBottom: 25,
    fontFamily: "Roboto",
    textAlign: "center",
    whiteSpace: "pre-wrap",
  },
  label: {
    marginBottom: 0,
    marginRight: 5,
    fontSize: 18,
  },
  button: {
    width: "unset",
    height: "unset",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "10px 16px",
    "@media only screen and (max-width: 767px)": {
      margin: "10px 0",
    },
  },
  buttonLabel: {
    display: "flex",
  },
  blue: {
    color: colors.BLUE(),
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
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  coinIcon: {
    height: 20,
    marginLeft: 5,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 15,
    cursor: "pointer",
    color: "#A5A5A5",
    fontSize: 20,
    ":hover": {
      color: "#000",
    },
  },
  connectStatus: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    margin: "15px 0",
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
  formInput: {
    width: "100%",
    margin: 0,
    minHeight: "unset",
    paddingBottom: 10,
  },
  infoIcon: {
    marginLeft: 5,
    cursor: "pointer",
    color: "#82817D",
    color: "#DFDFDF",
  },
  inputLabel: {
    paddingBottom: 10,
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
  image: {
    objectFit: "contain",
    width: 250,
  },
  confirmation: {
    color: "#000",
    marginBottom: 10,
  },
  transactionHashLink: {
    cursor: "pointer",
    color: colors.BLUE(1),
    ":hover": {
      textDecoration: "underline",
    },
  },
  marginLeft: {
    marginLeft: 5,
    textDecoration: "unset",
  },
  toggleContainer: {
    width: "100%",
    display: "flex",
    // justifyContent: "flex-end",
    justifyContent: "center",
    marginBottom: 15,
    marginTop: 15,
  },
  toggleContainerOnChain: {
    marginTop: 0,
  },
  toggle: {
    color: "rgba(36, 31, 58, 0.6)",
    cursor: "pointer",
    padding: "2px 8px",
    fontSize: 14,
    ":hover": {
      color: colors.BLUE(),
    },
  },
  toggleRight: {
    marginLeft: 5,
  },
  activeToggle: {
    background: "#eaebfe",
    borderRadius: 4,
    color: colors.BLUE(),
  },
  errorMsg: {
    fontSize: 14,
    color: colors.RED(),
  },

  lineItem: {
    display: "flex",
    fontSize: 16,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "100%",
  },
  lineItemValue: {
    display: "flex",
    width: 150,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  lineItemText: {
    display: "flex",
    alignItems: "center",
    fontSize: 18,
  },
  balanceLine: {
    paddingBottom: 20,
  },
  balanceText: {
    // fontWeight: 500,
    color: colors.DARKER_GREY(),
  },
  balanceValue: {
    alignItems: "center",
    color: colors.DARKER_GREY(),
  },
  offeringLine: {
    // marginBottom: 7,
  },
  offeringText: {
    fontWeight: 500,
  },
  offeringValue: {
    alignItems: "center",
  },
  valueNumber: {
    width: 100,
    textAlign: "right",
    display: "flex",
    alignItems: "center",
    gap: 4,
    justifyContent: "flex-end",
  },
  valueInInput: {
    paddingRight: 0,
  },
  platformFeeLine: {
    color: colors.DARKER_GREY(),
    marginBottom: 20,
  },
  netAmountLine: {
    paddingTop: 16,
    borderTop: `2px solid rgb(229 229 230)`,
    fontWeight: 500,
    marginBottom: 0,
  },
  netAmountValue: {
    fontWeight: 500,
  },
  usdValue: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 8,
    color: colors.LIGHT_GREY_TEXT,
  },
  tooltipIcon: {
    fontSize: 16,
    color: colors.DARKER_GREY(),
    marginLeft: 5,
    cursor: "pointer",
  },
  rscText: {
    fontWeight: 500,
    marginLeft: 16,
    display: "block",
    color: colors.BLACK(),
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  modals: state.modals,
  auth: state.auth,
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  openPaperTransactionModal: ModalActions.openPaperTransactionModal,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
  updateUser: AuthActions.updateUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert()(withExchangeRate(PaperTransactionModal)));
