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
import { AuthorActions } from "~/redux/author";
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import StripeForm from "../Stripe/StripeForm";

const Amount = ({ value, onChange, error, containerStyles, dollar }) => {
  return (
    <div className={css(styles.row, styles.numbers, containerStyles)}>
      <div className={css(styles.column, styles.left)}>
        <div className={css(styles.title)}>Amount</div>
        <div className={css(styles.subtitle)}>
          Select the amount you want to give
        </div>
      </div>
      <div className={css(styles.column, styles.right)}>
        <div className={css(styles.inputContainer)}>
          {dollar && (
            <i className={css(styles.dollarSign) + " fas fa-dollar-sign"}></i>
          )}
          <input
            type="number"
            className={css(
              styles.input,
              error && styles.error,
              dollar && styles.dollar
            )}
            value={value}
            minValue={1}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

const AuthorSupportModal = (props) => {
  const { user } = props;
  const alert = useAlert();

  const [page, setPage] = useState(1); // 1
  const [activePayment, setActivePayment] = useState(); // 0 is RSC, 1 is Stripe
  // const [paymentOptions, setPaymentOptions] = useState(formatOptions() || []); // list of payment options
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {}, [props.modals]);

  const paymentOptions = [
    {
      label: (
        <div className={css(iconStyles.row)}>
          <span className={css(styles.boldResearch)}>ResearchCoin</span>
          <img
            className={css(iconStyles.rsc)}
            src={"/static/icons/coin-filled.png"}
          />
        </div>
      ),
      id: "RSC_OFF_CHAIN",
    },
  ];

  function closeModal() {
    document.body.style.overflow = "scroll";
    props.openAuthorSupportModal(false);
    setPage(1); //1
    setActivePayment(null);
    setAmount(1);
  }

  /**
   * Confirming RSC transaction
   * @param { Event } e -- event from form submission
   */
  function confirmTransaction(e) {
    e.preventDefault();
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

  function formatPaymentOptions() {
    let options = [...paymentOptions];

    if (props.author.wallet && props.author.wallet.stripe_verified) {
      options.push({
        label: (
          <div className={css(iconStyles.row)}>
            <span className={css(styles.boldResearch)}>Credit Card</span>
            <i
              className={css(styles.creditCardIcon) + " fad fa-credit-card"}
            ></i>
          </div>
        ),
      });
    }

    return options;
  }

  function getAuthorId() {
    const { paper, author } = props.modals.openAuthorSupportModal.props;

    if (author) {
      return author.id;
    }
    if (paper && paper.uploaded_by.author_profile) {
      let author = paper.uploaded_by.author_profile;
      return author.id;
    }
  }

  function getObjectId() {
    const { paper, author } = props.modals.openAuthorSupportModal.props;
    if (author) {
      return author.id;
    }
    if (paper) {
      return paper.id;
    }
  }

  function getPaymentId() {
    switch (activePayment) {
      case 0:
        return "RSC_OFF_CHAIN";
      case 1:
        return "STRIPE";
      default:
        break;
    }
  }

  function sendTransaction() {
    const {
      paper,
      contentType,
      author,
      setSupporters,
      supporters,
    } = props.modals.openAuthorSupportModal.props;

    props.showMessage({ load: true, show: true });

    let payload = {
      user_id: props.user.id,
      recipient_id: getAuthorId(),
      content_type: contentType ? contentType : "paper", // 'paper', 'author'
      object_id: getObjectId(), // id of paper or author
      amount,
      payment_option: "SINGLE", // {'SINGLE', 'MONTHLY'},
      payment_type: getPaymentId(), //{'RSC_ON_CHAIN', 'RSC_OFF_CHAIN', 'ETH', 'BTC', 'STRIPE', 'PAYPAL'}
    };

    return fetch(
      API.SUPPORT({ route: "get_supported" }),
      API.POST_CONFIG(payload)
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        props.showMessage({ show: false });
        props.setMessage("Project supported!");
        props.showMessage({ show: true });

        setPage(3);
        props.updateUser({ ...res.user });
        setSupporters([{ ...res.user }, ...supporters]);
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
    value = value ? (value > 0 ? value : 0) : 0;
    if (activePayment === 0) {
      setError(handleError(value));
    }
    setAmount(value);
  }

  function handleError(value) {
    if (value > props.user.balance || value < 0) {
      return true;
    }
    return false;
  }

  function formatAuthorName() {
    const { paper, author } = props.modals.openAuthorSupportModal.props;
    if (author) {
      return `${author.first_name} ${author.last_name}`;
    }
    if (paper) {
      const { first_name, last_name } = paper.uploaded_by.author_profile;
      return `${first_name} ${last_name}`;
    }
  }

  function formatTitle() {
    const { paper, author } = props.modals.openAuthorSupportModal.props;
    if (author) {
      return `Support ${formatAuthorName()}`;
    }
    if (paper) {
      return `Support ${formatAuthorName()}'s Preregistration`;
    }
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
    const payments = formatPaymentOptions();
    return (
      <div className={css(styles.root)}>
        <h3 className={css(styles.title)}>Payment Details</h3>
        <div className={css(styles.paymentList)}>
          {payments.map((payment, i) => {
            return (
              <div
                className={css(styles.paymentOption)}
                key={`payment_option_${i}`}
              >
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

  /**
   * Successful stripe payment
   */
  const stripePaymentSuccess = () => {
    setPaymentLoading(false);
    setPage(3);
    const {
      setSupporters,
      supporters,
    } = props.modals.openAuthorSupportModal.props;
    props.updateUser({ ...user });
    setSupporters([{ ...user }, ...supporters]);
  };

  /**
   * When stripe payment errors, do something
   */
  const stripePaymentError = () => {};

  function _renderForm(currency) {
    let label = setupPaymentLabel(amount);

    switch (currency) {
      case 0: //RSC
        return (
          <form onSubmit={confirmTransaction}>
            <div
              className={css(styles.row, styles.numbers, styles.borderBottom)}
            >
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
                  />
                </div>
              </div>
            </div>
            <Amount value={amount} onChange={handleAmountInput} error={error} />
            <div className={css(styles.buttonRow)}>
              <Button
                rippleClass={styles.rippleClass}
                customButtonStyle={styles.customButtonStyle}
                label={label}
                type={"submit"}
              />
            </div>
          </form>
        );
      case 1: // Stripe
        return (
          <div>
            <Amount
              value={amount}
              onChange={handleAmountInput}
              containerStyles={styles.page2ContainerStyles}
              dollar={true}
            />
            <StripeForm
              createStripeIntent={createStripeIntent}
              paymentCallback={stripePaymentSuccess}
              paymentError={stripePaymentError}
              senderName={
                user.author_profile.first_name +
                " " +
                user.author_profile.last_name
              }
              button={
                <div className={css(styles.buttonRow)}>
                  <Button
                    rippleClass={styles.rippleClass}
                    customButtonStyle={styles.customButtonStyle}
                    label={
                      paymentLoading ? (
                        <i className="fas fa-spinner-third fa-spin"></i>
                      ) : (
                        label
                      )
                    }
                    type={"submit"}
                  />
                </div>
              }
            />
          </div>
        );
      default:
        break;
    }
  }

  /**
   * Creating a stripe intent
   */
  const createStripeIntent = () => {
    setPaymentLoading(true);
    let payload = {
      user_id: props.user.id,
      recipient_id: getAuthorId(),
      content_type: props.supportType,
      object_id: getObjectId(), // id of paper or author
      amount,
      payment_option: "SINGLE", // {'SINGLE', 'MONTHLY'},
      payment_type: "STRIPE", //{'RSC_ON_CHAIN', 'RSC_OFF_CHAIN', 'ETH', 'BTC', 'STRIPE', 'PAYPAL'}
    };

    return fetch(API.SUPPORT({}), API.POST_CONFIG(payload))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        return res.client_secret;
        // props.showMessage({ show: false });
        // props.setMessage("Project supported!");
        // props.showMessage({ show: true });

        // setPage(3);
        // props.updateUser({ ...res.user });
        // setSupporters([{ ...res.user }, ...supporters]);
      })
      .catch((err) => {
        props.showMessage({ show: false });
        props.setMessage("We were unable to process your payment.");
        props.showMessage({ show: true, error: true });
      });
  };

  /***
   * Sends the stripe element to backend
   */
  const stripePayment = (e) => {};

  const setupPaymentLabel = (amount) => {
    switch (activePayment) {
      case 0:
        return `Send ${amount} RSC to ${user.author_profile.first_name}`;
      case 1:
        return `Send $${amount} to ${user.author_profile.first_name}`;
    }
  };

  // Handle form submission.
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
    if (result.error) {
      // Inform the user if there was an error.
      setError(result.error.message);
    } else {
      setError(null);
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  };

  function renderAmountScreen() {
    return (
      <div className={css(styles.content)}>
        <div className={css(styles.backButton)} onClick={() => setPage(1)}>
          {icons.longArrowLeft}
          <span className={css(styles.backButtonLabel)}>Back</span>
        </div>
        {_renderForm(activePayment)}
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
                  {activePayment !== 0 && "$"}
                  {amount}
                  {activePayment === 0 && (
                    <img
                      className={css(styles.amountRSC)}
                      src={"/static/icons/coin-filled.png"}
                    />
                  )}
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
            <span className={css(styles.icon)}>
              <i className="far fa-check-circle" />
            </span>
            Transaction Successful
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
    "@media only screen and (max-width: 415px)": {
      width: "90%",
    },
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
    "@media only screen and (max-width: 415px)": {
      width: "100%",
    },
  },
  paymentOption: {
    width: "100%",
    marginBottom: 16,
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
  page2ContainerStyles: {
    marginTop: 0,
    paddingTop: 0,
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
  customButtonStyle: {
    width: "100%",
    fontSize: 18,
  },
  rippleClass: {
    width: "100%",
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
  creditCardIcon: {
    // color: colors.PURPLE(1),
    fontSize: 20,
    marginLeft: "auto",
    paddingRight: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
    color: colors.BLACK(),
  },
  amountRow: {
    display: "flex",
    alignItems: "center",
    color: colors.BLACK(),
  },
  amountRSC: {
    height: 20,
    marginLeft: 5,
  },
  boldResearch: {
    fontWeight: 500,
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
    fontSize: 22,
    letterSpacing: 0.7,
  },
  left: {
    width: "80%",
  },
  right: {
    width: "40%",
    alignItems: "flex-end",
    height: "100%",
  },
  inputContainer: {
    position: "relative",
  },
  mainHeader: {
    fontWeight: 500,
    color: colors.BLACK(),
    width: "100%",
  },
  icon: {
    color: colors.GREEN(1),
    marginRight: 8,
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
    borderWidth: 1,
    border: "1px solid rgb(232, 232, 242)",
    backgroundColor: "rgb(251, 251, 253)",
    // borderColor: colors.BLACK(0.4),
  },
  dollarSign: {
    position: "absolute",
    left: 12,
    top: "50%",
    opacity: 0.7,
    transform: "translateY(-50%)",
  },
  dollar: {
    paddingLeft: 30,
    width: 100,
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
    marginLeft: "auto",
    paddingRight: 16,
  },
  rscBanner: {
    height: 18,
    marginLeft: 5,
  },
  stripe: {
    height: 40,
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
  updateAuthorByKey: AuthorActions.updateAuthorByKey,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorSupportModal);
