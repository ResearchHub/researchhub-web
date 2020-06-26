import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Link from "next/link";
import { withAlert } from "react-alert";
import ReactTooltip from "react-tooltip";
import { keccak256, sha3_256 } from "js-sha3";
import miniToken from "./Artifacts/mini-me-token";
import contractAbi from "./Artifacts/contract-abi";
import { ethers } from "ethers";

// Component
import BaseModal from "./BaseModal";
import Loader from "~/components/Loader/Loader";
import Button from "~/components/Form/Button";
import FormInput from "~/components/Form/FormInput";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { AuthActions } from "~/redux/auth";
import { PaperActions } from "~/redux/paper";

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
      nextScreen: false,
      offChain: false,
      transition: false,
      // OnChain
      balance: 0,
      networkVersion: null, //
      networkAddress: "",
      connectedMetaMask: false,
      transition: false,
      listenerNetwork: null,
      listenerAccount: null,
      validating: false,
      valid: false,
      transactionHash: "",
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
    this.createContract();
  }

  createContract = () => {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner(0);
    ethereum.autoRefreshOnNetworkChange = false;
    this.RSCContract = new ethers.Contract(
      "0x2275736dfEf93a811Bb32156724C1FCF6FFd41be",
      miniToken.abi,
      this.provider
    );
  };

  checkRSCBalance = async (account) => {
    let rawBalance = await this.RSCContract.balanceOf(account);
    let balance = ethers.utils.formatUnits(rawBalance, 18);
    this.setState({ balance }, () => {
      this.setState({
        error: this.handleError(this.state.value),
      });
    });
  };

  signTransaction = async (item) => {
    let { setMessage, showMessage, paper, updatePaperState } = this.props;
    let { purchase_hash, id } = item;
    let allow = true;

    const appContract = new ethers.Contract(
      "0xd2Abb07F644FDA2CB423220b80cEeb4e81C4B5ca",
      contractAbi,
      this.provider
    );

    let rawAllowance = await this.RSCContract.functions.allowance(
      this.state.networkAddress,
      appContract.address
    );

    let allowance = ethers.utils.formatUnits(rawAllowance[0], 18);

    if (Number(allowance) < Number(this.state.value)) {
      allow = await this.RSCContract.connect(this.signer).functions.approve(
        appContract.address,
        ethers.utils.parseEther(`${this.state.value}`)
      );
    }

    if (allow) {
      let hash = await appContract.connect(this.signer).functions.buy(
        "0x7d50101bbfa12f4a1b4e6de0dd58ad36de150d55", // address of token contract
        ethers.utils.parseEther(`${this.state.value}`), // amount of RSC parsed
        ethers.utils.hexZeroPad(`0x${purchase_hash}`, 32) // convert item to bytes, (item)
      );

      let payload = { transaction_hash: hash.hash };

      fetch(API.PROMOTION({ purchaseId: id }), API.PATCH_CONFIG(payload))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          showMessage({ show: false });
          setMessage("Transaction Successful!");
          showMessage({ show: true });
          this.setState({ transactionHash: hash.hash }, () => {
            let promoted = paper.promoted ? paper.promoted : 0;
            updatePaperState("promoted", promoted + Number(this.state.value));
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
      setMessage("Something went wrong.");
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
        let newUser = { ...res.user };
        this.props.updateUser(newUser);
        this.setState({
          userBalance: res.user.balance,
          withdrawals: [...res.results],
        });
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
    let { showMessage, setMessage, updatePaperState, paper, user } = this.props;
    showMessage({ show: true, load: true });

    let paperId = paper.id;
    let userId = user.id;

    let payload = {
      amount: Number(this.state.value),
      object_id: paperId,
      content_type: "paper",
      user: userId,
      purchase_method: this.state.offChain ? "OFF_CHAIN" : "ON_CHAIN",
      purchase_type: "BOOST",
    };

    fetch(API.PROMOTION_PURCHASE, API.POST_CONFIG(payload))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        if (!this.state.offChain) {
          let item = { ...res };
          this.signTransaction(item);
        } else {
          showMessage({ show: false });
          setMessage("Transaction Successful!");
          showMessage({ show: true });
          this.transitionScreen(() => {
            this.setState({
              transactionHash: res.trasaction_hash,
              finish: true,
            });
            let promoted = res.source.promoted && res.source.promoted;
            promoted && updatePaperState("promoted", promoted);
            this.updateBalance();
          });
        }
      })
      .catch((err) => {
        showMessage({ show: false });
        setMessage("Something went wrong.");
        showMessage({ show: true, error: true });
      });
  };

  connectWallet = async () => {
    if (!this.state.connectedMetaMask) {
      ethereum
        .send("eth_requestAccounts")
        .then((accounts) => {
          let account = accounts && accounts.result ? accounts.result[0] : [];
          this.setState(
            {
              connectedMetaMask: true,
              networkAddress: account,
              listenerNetwork: ethereum.on(
                "networkChanged",
                this.updateChainId
              ),
              listenerAccount: ethereum.on(
                "accountsChanged",
                this.updateAccount
              ),
              valid: true,
            },
            () => this.checkBalance()
          );
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

  checkBalance = (accountAddress) => {
    let account = accountAddress ? accountAddress : this.state.networkAddress;
    this.checkRSCBalance(account);
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
              this.setState(
                {
                  transition: false,
                },
                () => this.checkRSCBalance(this.state.networkAddress)
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
        networkAddress: account,
      },
      () => {
        this.checkRSCBalance(account);
      }
    );
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
            balance: this.isAddress(this.state.networkAddress)
              ? this.checkBalance(value)
              : null,
          });
        }, 400);
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
          !this.state.offChain && this.connectWallet();
          this.state.offChain &&
            this.setState({ error: this.handleError(this.state.value) });
        });
      }, 300);
    });
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
            <div className={css(styles.instruction)}>
              Simply open MetaMask and switch over {"\n"}to the
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

  renderContent = () => {
    let { user } = this.props;
    let {
      nextScreen,
      offChain,
      transition,
      connectedMetaMask,
      networkAddress,
      networkVersion,
      validating,
      valid,
      finish,
      transactionHash,
    } = this.state;
    if (finish) {
      return (
        <Fragment>
          <div className={css(styles.row)}>
            <div className={css(styles.column)}>
              <div className={css(styles.mainHeader)}>
                Transaction Successful
                <span className={css(styles.icon)}>
                  <i className="fal fa-check-circle" />
                </span>
              </div>
              {!offChain && (
                <div className={css(styles.confirmation)}>
                  Click{" "}
                  <span
                    className={css(styles.transactionHashLink)}
                    onClick={() =>
                      this.openTransactionConfirmation(
                        `https://rinkeby.etherscan.io/tx/${transactionHash}`
                      )
                    }
                  >
                    here
                  </span>{" "}
                  to view the transaction confirmation.
                </div>
              )}
              <div onClick={this.closeModal}>
                You can view your promotions on your
                <Link
                  href={"/user/[authorId]/[tabName]"}
                  as={`/user/${user.author_profile.id}/promotions`}
                >
                  <a
                    href={"/user/[authorId]/[tabName]"}
                    as={`/user/${user.author_profile.id}/promotions`}
                    className={css(
                      styles.transactionHashLink,
                      styles.marginLeft
                    )}
                  >
                    profile page.
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
      );
    }
    if (!nextScreen) {
      return (
        <div className={css(styles.content, transition && styles.transition)}>
          <div className={css(styles.description)}>
            {
              "Use RSC to give this paper better visibility. Every RSC spent will increase the paper's score and its likelihood to trend."
            }
          </div>
          <div className={css(styles.row, styles.mobileCenter)}>
            <div className={css(styles.column, styles.center)}>
              <Button
                customButtonStyle={styles.button}
                label={() => {
                  return (
                    <div className={css(styles.buttonLabel)}>
                      <div className={css(styles.label)}>Use RSC in App</div>
                      <img
                        src={"/static/icons/coin-filled.png"}
                        draggable={false}
                        className={css(styles.coinIcon)}
                      />
                    </div>
                  );
                }}
                onClick={() =>
                  this.transitionScreen(() =>
                    this.setState({ nextScreen: true, offChain: true })
                  )
                }
              />
            </div>
            <div className={css(styles.column, styles.center)}>
              <Button
                customButtonStyle={styles.button}
                isWhite={true}
                label={() => {
                  return (
                    <div className={css(styles.buttonLabel)}>
                      <div className={css(styles.label)}>Use RSC in Wallet</div>
                      <img
                        src={"/static/icons/coin-filled.png"}
                        draggable={false}
                        className={css(styles.coinIcon)}
                      />
                    </div>
                  );
                }}
                onClick={() =>
                  this.transitionScreen(() =>
                    this.setState({ nextScreen: true, offChain: false })
                  )
                }
              />
            </div>
          </div>
        </div>
      );
    } else if (nextScreen && offChain) {
      return (
        <div className={css(styles.content, transition && styles.transition)}>
          <div className={css(styles.description)}>
            {
              "Use RSC to give this paper better visibility. Every RSC spent will increase the paper's score and its likelihood to trend."
            }
          </div>
          <div className={css(styles.row, styles.numbers, styles.borderBottom)}>
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
              <div className={css(styles.title)}>Amount</div>
              <div className={css(styles.subtitle)}>
                Your total must exceed 1 RSC
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
      );
    } else if (nextScreen && !offChain) {
      return (
        <div className={css(styles.content, transition && styles.transition)}>
          {/* {connectedMetaMask && networkVersion !== "1" ? ( */}
          {false ? (
            this.renderSwitchNetworkMsg()
          ) : (
            <Fragment>
              <div className={css(styles.description)}>
                {
                  "Use RSC to give this paper better visibility. Every RSC spent will increase the paper's score and its likelihood to trend."
                }
              </div>
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
              <div className={css(styles.inputLabel)}>
                Wallet Address
                <span
                  className={css(styles.infoIcon)}
                  data-tip={"The address of your ETH Account (ex. 0x0000...)"}
                >
                  {icons["info-circle"]}
                  <ReactTooltip />
                </span>
              </div>
              <FormInput
                value={networkAddress}
                containerStyle={styles.formInput}
                // onChange={this.handleNetworkAddressInput}
                // disabled={true}
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

              <div
                className={css(styles.row, styles.numbers, styles.borderBottom)}
              >
                <div className={css(styles.column, styles.left)}>
                  <div className={css(styles.title)}>Total Balance</div>
                  <div className={css(styles.subtitle)}>
                    Your current wallet balance in RSC
                  </div>
                </div>
                <div className={css(styles.column, styles.right)}>
                  <div className={css(styles.userBalance)}>
                    {this.state.balance}
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
                  <div className={css(styles.title)}>Amount</div>
                  <div className={css(styles.subtitle)}>
                    Your total must exceed 1 RSC
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
    let { modals } = this.props;

    return (
      <BaseModal
        isOpen={modals.openPaperTransactionModal}
        closeModal={this.closeModal}
        title={"Promote Paper"} // this needs to
      >
        {this.renderContent()}
        {this.state.nextScreen && !this.state.finish && (
          <div
            className={css(styles.backButton)}
            onClick={() =>
              this.transitionScreen(() => this.setState({ nextScreen: false }))
            }
          >
            <i class="fal fa-long-arrow-left" />
          </div>
        )}
      </BaseModal>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    // paddingTop: 30,
    width: 420,
    opacity: 1,
    transition: "all ease-in-out 0.2s",
    position: "relative",
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
      // width: 300,
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
    height: 50,
    width: 80,
    fontSize: 16,
    borderRadius: 4,
  },
  error: {
    borderColor: "red",
  },
  title: {
    fontSize: 19,
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
    justifyContent: "center",
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
    padding: "10px 0",
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
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  modals: state.modals,
  paper: state.paper,
  auth: state.auth,
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  openPaperTransactionModal: ModalActions.openPaperTransactionModal,
  updateUser: AuthActions.updateUser,
  updatePaperState: PaperActions.updatePaperState,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert()(PaperTransactionModal));
