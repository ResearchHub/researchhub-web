import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";

// Component
import BaseModal from "./BaseModal";
import Loader from "../Loader/Loader";

// Redux
import { ModalActions } from "~/redux/modals";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import icons from "~/config/themes/icons";

class TransactionModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      rate: null,
      gasFee: null,
      networkVersion: null,
      transition: false,
      listener: ethereum.on("networkChanged", this.checkNetwork),
      withdrawAmount: null,
    };
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {
    this.checkNetwork();
    let path = "https://ethgasstation.info/json/ethgasAPI.json";
    // this.getMinGWEI();
  }

  componentWillUpdate() {
    this.checkNetwork();
    // if (!this.state.gasFee) {
    //   this.getMinGWEI();
    // }
  }

  checkNetwork = () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = window["ethereum"];
      if (ethereum.networkVersion !== this.state.networkVersion) {
        let transition = false;
        if (
          this.state.networkVersion !== "1" &&
          ethereum.networkVersion === "1"
        ) {
          transition = true;
        }
        if (
          this.state.networkVersion === "1" &&
          ethereum.networkVersion !== "1"
        ) {
          transition = true;
        }
        this.setState(
          {
            networkVersion: ethereum.networkVersion,
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
    }
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
    /**
     * Amount
     * Recipient
     * Note
     * Password
     * --
     * Estimated transaction fee
     * Offer Fee
     * Estimated total cost
     * Before you confirm:
     *
     */
    let { transition, withdrawAmount } = this.state;
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
                  Your offer must exceed 0.03 ether.
                </div>
              </div>
              <div className={css(styles.right)}>
                <input
                  className={css(styles.input)}
                  type={"number"}
                  required={true}
                  value={withdrawAmount}
                  onChange={this.handleInput}
                />
              </div>
            </div>
            {this.renderRow(
              {
                text: "Estimated transaction fee",
                tooltip:
                  "This fee is charged by the network to confirm transactions.",
              },
              { value: this.state.gasFee }
            )}
            {/* {this.renderRow('third', 'third')} */}
          </Fragment>
        )}
      </div>
    );
  };

  renderRow = (left, right) => {
    // let {
    //   text,
    //   tooltip,
    // } = left;
    // let {
    //   text,
    //   tooltip
    // } = right;

    return (
      <div className={css(styles.row)}>
        <div className={css(styles.left, styles.orientRow)}>
          {left.text}
          <span className={css(styles.infoIcon)} data-tip={left.tooltip}>
            {icons["info-circle"]}
            <ReactTooltip type={"info"} />
          </span>
        </div>
        <div className={css(styles.right)}>
          <span className={css(styles.eth)}>
            {right && right.value && `${right.value.eth} ETH`}
          </span>
          <span className={css(styles.dollar)}>
            {right && right.value && `$${right.value.usd}`}
          </span>
        </div>
      </div>
    );
  };

  toBigNumber = (number) => {
    number = number || 0;
    if (number.isBigNumber) return number;

    if (
      (typeof number === "string" || number instanceof String) &&
      (number.indexOf("0x") === 0 || number.indexOf("-0x") === 0)
    ) {
      return new BigNumber(number.replace("0x", ""), 16);
    }

    return new BigNumber(number.toString(10), 10);
  };

  /*
   * Get the safeLow gwei from ethgasstation
   */
  getMinGWEI = () => {
    // return fetch(API.ETH_GAS_STATION)
    return fetch("https://ethgasstation.info/json/ethgasAPI.json")
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(({ safeLow, eth_gasPrice }) => {
        var modifier = this.props.modifier ? this.props.modifier : 1;
        var calculatedSafeLow = (safeLow / 10) * modifier;
        var uppedSafeLow = calculatedSafeLow * 1.1;
        var eth_safe_low = eth_gasPrice
          ? toBigNumber(eth_gasPrice) * 1e-9
          : null;
        console.log("eth_gasPrice", eth_gasPrice);
        this.setState({
          gasFee: {
            usd: safeLow ? uppedSafeLow : eth_safe_low / 2.5,
            eth: eth_gasPrice,
          },
        });
      });
  };

  render() {
    let { modals } = this.props;
    let { networkVersion, transition } = this.state;
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
          {networkVersion !== "1" && (
            <img
              src={"/static/icons/close.png"}
              className={css(styles.closeButton)}
              onClick={this.closeModal}
              draggable={false}
            />
          )}
          {networkVersion !== "1"
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
  left: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    color: "#82817D",
    // height: '100%'
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
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = {
  openTransactionModal: ModalActions.openTransactionModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionModal);
