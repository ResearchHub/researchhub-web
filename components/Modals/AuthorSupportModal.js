import React, { Fragment, useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import { useAlert } from "react-alert";
import Link from "next/link";

// Component
import BaseModal from "./BaseModal";
import Button from "~/components/Form/Button";
import OptionCard from "~/components/Payment/OptionCard";
import { ScorePill } from "~/components/VoteWidget";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";

// Redux
import { AuthActions } from "~/redux/auth";
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const AuthorSupportModal = (props) => {
  const alert = useAlert();

  const [page, setPage] = useState(2); // 1
  const [activePayment, setActivePayment] = useState();
  const [paymentOptions, setPaymentOptions] = useState(formatOptions() || []);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {}, [props.modals]);

  function formatOptions() {
    return [
      {
        label: (
          <div className={css(iconStyles.row)}>
            <img
              className={css(iconStyles.rsc)}
              src={"/static/icons/coin-filled.png"}
              alt="RSC Coin"
            />
            <img
              className={css(iconStyles.rscBanner)}
              src={"/static/ResearchHubText.png"}
              alt="ResearchHub Text Logo"
            />
          </div>
        ),
        id: "RSC_OFF_CHAIN",
      },
      // {
      //   label: (
      //     <img
      //       className={css(iconStyles.apple)}
      //       src={"/static/icons/apple-pay.png"}
      //     />
      //   ),
      // },
      // {
      //   label: (
      //     <img
      //       className={css(iconStyles.mastercard)}
      //       src={"/static/icons/mastercard.png"}
      //     />
      //   ),
      // },
      // {
      //   label: (
      //     <img
      //       className={css(iconStyles.paypal)}
      //       src={"/static/icons/paypal.png"}
      //     />
      //   ),
      //   id: "PAYPAL",
      // },
      // {
      //   label: (
      //     <img
      //       className={css(iconStyles.visa)}
      //       src={"/static/icons/visa.png"}
      //     />
      //   ),
      // },
    ];
  }

  function closeModal() {
    if (document.body.style) {
      document.body.style.overflow = "scroll";
    }
    props.openAuthorSupportModal(false);
    setPage(2); //1
    setActivePayment(null);
    setAmount(0);
  }

  function confirmTransaction() {
    if (error) {
      props.setMessage("Not enough coins in balance");
      return props.showMessage({
        show: true,
        clickoff: true,
        error: true,
      });
    }

    if (amount == 0) {
      props.setMessage("Must spend at least 1 RSC");
      return props.showMessage({
        show: true,
        clickoff: true,
        error: true,
      });
    }

    alert.show({
      text: `Use ${amount} RSC to support this project?`,
      buttonText: "Yes",
      onClick: () => {
        sendTransaction();
      },
    });
  }

  function getAuthorId() {
    const { paper } = props.modals.openAuthorSupportModal.props;

    if (paper && paper.uploaded_by.author_profile) {
      let author = paper.uploaded_by.author_profile;
      return author.id;
    }
  }

  function sendTransaction() {
    const { paper } = props.modals.openAuthorSupportModal.props;
    props.showMessage({ load: true, show: true });

    let payload = {
      user_id: props.user.id,
      recipient_id: getAuthorId(),
      content_type: "paper", // 'paper', 'author'
      object_id: paper.id, // id of paper or author
      amount,
      payment_option: "SINGLE", // {'SINGLE', 'MONTHLY'},
      payment_type: "RSC_OFF_CHAIN", //{'RSC_ON_CHAIN', 'RSC_OFF_CHAIN', 'ETH', 'BTC', 'STRIPE', 'PAYPAL'}
    };

    return fetch(API.SUPPORT, API.POST_CONFIG(payload))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        props.showMessage({ show: false });
        props.setMessage("Project supported!");
        props.showMessage({ show: true });

        setPage(3);
        props.updateUser({ ...res.user });
      })
      .catch((err) => {
        props.showMessage({ show: false });
        props.setMessage("Something went wrong.");
        props.showMessage({ show: true, error: true });
      });
  }

  function handlePaymentClick(index) {
    setActivePayment(index);
    setPage(2);
  }

  function handleAmountInput(e) {
    let value = parseInt(e.target.value, 10);
    value = value ? (value > 0 ? value : 0) : null;
    setAmount(value);
    setError(handleError(value));
  }

  function handleError(value) {
    if (value > props.user.balance || value < 0) {
      return true;
    }
    return false;
  }

  function formatAuthorName() {
    const { paper } = props.modals.openAuthorSupportModal.props;
    if (paper) {
      const { first_name, last_name } = paper.uploaded_by.author_profile;
      return `${first_name} ${last_name}`;
    }
  }

  function formatTitle() {
    return `Support ${formatAuthorName()}'s Project`;
  }

  function renderScreen() {
    switch (page) {
      case 1:
        return renderPaymentScreen();
      case 2:
        return renderAmountScreen();
      case 3:
        return renderReceiptScreen();
    }
  }

  function renderPaymentScreen() {
    return (
      <div className={css(styles.root)}>
        <h3 className={css(styles.title)}>Payment Details</h3>
        <div className={css(styles.paymentList)}>
          {paymentOptions.map((payment, i) => {
            return (
              <div className={css(styles.paymentOption)}>
                <OptionCard
                  label={payment.label}
                  active={activePayment === i}
                  payment={activePayment}
                  index={i}
                  onClick={handlePaymentClick}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderAmountScreen() {
    return (
      <div className={css(styles.content)}>
        <div className={css(styles.backButton)} onClick={() => setPage(1)}>
          {icons.longArrowLeft}
          <span className={css(styles.backButtonLabel)}>Back</span>
        </div>
        <div className={css(styles.row, styles.numbers, styles.borderBottom)}>
          <div className={css(styles.column, styles.left)}>
            <div className={css(styles.title)}>Total Balance</div>
            <div className={css(styles.subtitle)}>
              Your current total balance in ResearchHub
            </div>
          </div>
          <div className={css(styles.column, styles.right)}>
            <div className={css(styles.userBalance)}>
              {props.user && props.user.balance}
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
            <div className={css(styles.title)}>Amount</div>
            <div className={css(styles.subtitle)}>
              Select the amount you want to give
            </div>
          </div>
          <div className={css(styles.column, styles.right)}>
            <input
              type="number"
              className={css(styles.input, error && styles.error)}
              value={amount}
              onChange={handleAmountInput}
            />
          </div>
        </div>
        <div className={css(styles.buttonRow)}>
          <Button label="Confirm" onClick={confirmTransaction} />
        </div>
      </div>
    );
  }

  function renderReceiptScreen() {
    const { paper } = props.modals.openAuthorSupportModal.props;
    return (
      <Fragment>
        <div className={css(styles.row)}>
          <div className={css(styles.column)}>
            <div className={css(styles.receiptContainer)}>
              <div className={css(styles.sectionRow)}>
                <div className={css(styles.label)}>Recipient:</div>
                {formatAuthorName()}
              </div>

              <div className={css(styles.sectionRow)}>
                <div className={css(styles.label)}>Support Amount:</div>
                <div className={css(styles.amountRow)}>
                  {amount}
                  <img
                    className={css(styles.amountRSC)}
                    src={"/static/icons/coin-filled.png"}
                    alt="RSC Coin"
                  />
                </div>
              </div>
              {paper && (
                <div className={css(styles.paperContainer)}>
                  <PaperEntryCard
                    promotionSummary={true}
                    paper={paper && paper}
                    mobileView={true}
                    style={styles.paper}
                  />
                </div>
              )}
            </div>
            {/* <Link
                href={"/user/[authorId]/[tabName]"}
                as={`/user/${props.author.id}/contributions`}
              >
                <a
                  href={"/user/[authorId]/[tabName]"}
                  as={`/user/${props.author.id}/contributions`}
                  className={css(styles.transactionHashLink, styles.marginLeft)}
                >
                  Click to go back to{" "}
                  {`${props.author.first_name} ${props.author.last_name}'s page`}
                </a>
              </Link> */}
          </div>
          {/* {!offChain && (
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
            )} */}
        </div>
        <div className={css(styles.buttons, styles.confirmationButtons)}>
          <Button
            label={"Finish"}
            onClick={closeModal}
            customButtonStyle={styles.button}
          />
        </div>
      </Fragment>
    );
  }

  return (
    <BaseModal
      title={
        page !== 3 ? (
          formatTitle()
        ) : (
          <div className={css(styles.mainHeader)}>
            Transaction Successful
            <span className={css(styles.icon)}>
              <i className="fal fa-check-circle" />
            </span>
          </div>
        )
      }
      isOpen={props.modals.openAuthorSupportModal.isOpen}
      closeModal={closeModal}
      titleStyle={page !== 3 && styles.titleStyle}
    >
      {renderScreen()}
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },

  titleStyle: {
    fontSize: 24,
    marginTop: 20,
    paddingBottom: 40,
    "@media only screen and (max-width: 767px)": {
      paddingTop: 20,
    },
    "@media only screen and (max-width: 415px)": {
      paddingBottom: 10,
      paddingTop: 0,
    },
  },
  paymentList: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    height: "max-content",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      justifyContent: "center",
    },
  },
  paymentOption: {
    width: 246,
    minWidth: 246,
    maxWidth: 246,
    margin: "0 20px 20px 0",
  },
  content: {
    width: 420,
    opacity: 1,
    position: "relative",
    "@media only screen and (max-width: 557px)": {
      padding: 25,
      width: "100%",
      boxSizing: "border-box",
    },
  },
  description: {
    marginTop: 20,
    marginBottom: 30,
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
  receiptContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    minWidth: 400,
    "@media only screen and (max-width: 415px)": {
      padding: "0 20px",
      minWidth: "unset",
    },
  },
  sectionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    fontSize: 16,
    color: colors.BLACK(0.6),
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
    color: colors.BLACK(),
  },
  amountRow: {
    display: "flex",
    alignItems: "center",
  },
  amountRSC: {
    height: 20,
    marginLeft: 5,
  },
  redirect: {
    margin: "10px 0",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    boxSizing: "border-box",
    width: "100%",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    boxSizing: "border-box",
    marginTop: 10,
    padding: "20px 0",
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
    fontWeight: 500,
    color: colors.BLACK(),
    width: "100%",
  },
  icon: {
    color: colors.GREEN(1),
    marginLeft: 5,
  },
  amountContainer: {
    justifyContent: "space-between",
    position: "relative",
    minHeight: 60,
  },
  borderBottom: {
    borderBottom: ".1rem dotted #e7e6e4",
    marginTop: 0,
    paddingTop: 0,
  },
  numbers: {
    display: "flex",
    alignItems: "flex-end",
  },
  input: {
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
    top: -120,
    left: -20,
    color: colors.BLACK(0.5),
    textDecoration: "none",
    cursor: "pointer",
    ":hover": {
      color: colors.BLACK(1),
    },
    "@media only screen and (max-width: 767px)": {
      top: -118,
      left: 0,
    },
    "@media only screen and (max-width: 415px)": {
      top: -90,
      left: 20,
    },
  },
  backButtonLabel: {
    marginLeft: 10,
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
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
  paperContainer: {
    width: "100%",
    margin: "20px 0",
  },
  paper: {
    // border: "none",
    // padding: 0,
    margin: 0,
    width: "100%",
  },
});

const iconStyles = StyleSheet.create({
  apple: {
    height: 22,
    width: 55,
  },
  mastercard: {
    height: 27,
    width: 148,
  },
  paypal: {
    height: 23,
    width: 87,
  },
  visa: {
    height: 19,
    width: 62,
  },
  rsc: {
    height: 25,
  },
  rscBanner: {
    height: 18,
    marginLeft: 5,
  },
  row: {
    display: "flex",
    alignItems: "center",
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  user: state.auth.user,
  author: state.author,
});

const mapDispatchToProps = {
  openAuthorSupportModal: ModalActions.openAuthorSupportModal,
  updateUser: AuthActions.updateUser,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorSupportModal);
