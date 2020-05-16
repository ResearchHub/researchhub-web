import React from "react";
import { StyleSheet, css } from "aphrodite";
import ReactTooltip from "react-tooltip";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { formatTransactionDate } from "~/config/utils";
import { transformDate } from "~/redux/utils";

const TransactionCard = (props) => {
  let { transaction } = props;
  function renderStatus(status) {
    switch (status) {
      case "FAILED":
      case "failed":
        return (
          <div className={css(styles.status, styles.failed)}>{status}</div>
        );
      case "PENDING":
      case "pending":
        return (
          <div className={css(styles.status, styles.pending)}>{status}</div>
        );
      case "PAID":
      case "paid":
        return (
          <div className={css(styles.status, styles.confirmed)}>{status}</div>
        );
      default:
        return (
          <div className={css(styles.status, styles.failed)}>{status}</div>
        );
    }
  }

  function openTransactionHash() {
    if (transaction.transaction_hash) {
      let url = `https://rinkeby.etherscan.io/tx/${transaction.transaction_hash}`;
      let win = window.open(url, "_blank");
      win.focus();
    }
  }

  return (
    <div className={css(styles.transactionCard)} onClick={openTransactionHash}>
      <div className={css(styles.row)}>
        <div className={css(styles.timestamp)}>
          <span className={css(styles.clockIcon)}>
            <i className={"fad fa-clock"} />
          </span>
          {formatTransactionDate(transformDate(transaction.created_date))}
        </div>
        {renderStatus(transaction.paid_status)}
      </div>
      <div className={css(styles.row, styles.bottomRow)}>
        <div className={css(styles.column)}>
          <div className={css(styles.sent)}>Withdrew RSC</div>
          <div className={css(styles.row, styles.addressContainer)}>
            <span className={css(styles.black)}>to</span>
            <div className={css(styles.address)}>
              {transaction.to_address}
              <span
                className={css(styles.infoIcon)}
                data-tip="User's wallet address"
              >
                {icons["info-circle"]}
                <ReactTooltip />
              </span>
            </div>
          </div>
        </div>
        <div className={css(styles.amountContainer)}>
          {transaction.amount}
          <img
            className={css(styles.coin)}
            src={"/static/icons/coin-filled.png"}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  transactionCard: {
    width: "100%",
    padding: "27px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    cursor: "pointer",
    border: "1px solid #EDEDED",
    marginBottom: 10,
    borderRadius: 3,
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
    "@media only screen and (max-width: 767px)": {
      width: "85%",
    },
    "@media only screen and (max-width: 620px)": {
      height: 110,
      position: "relative",
    },
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    height: 45,
  },
  timestamp: {
    fontSize: 14,
    "@media only screen and (max-width: 620px)": {
      fontSize: 13,
    },
  },
  bottomRow: {
    marginTop: 30,
  },
  status: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 40,
    maxWidth: 40,
    padding: "7px 20px",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    borderRadius: 5,
    fontWeight: 500,
    border: "1px solid #FFF",
    "@media only screen and (max-width: 620px)": {
      fontSize: 11,
      padding: "5px 15px",
    },
  },
  confirmed: {
    color: "#2a6218",
    backgroundColor: "#D5F3D7",
    borderColor: "#D5F3D7",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    ":hover": {
      borderColor: "#2a6218",
    },
  },
  pending: {
    color: "#DCAA72",
    backgroundColor: "#FDF2DE",
    borderColor: "#FDF2DE",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    ":hover": {
      borderColor: "#DCAA72",
    },
  },
  failed: {
    color: colors.RED(),
    backgroundColor: "rgba(235, 51, 35, 0.2)",
    borderColor: "rgba(235, 51, 35, 0.2)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    ":hover": {
      borderColor: colors.RED(),
    },
  },
  sent: {
    fontWeight: 500,
    "@media only screen and (max-width: 620px)": {
      fontSize: 13,
    },
  },
  address: {
    marginLeft: 5,
    color: colors.BLUE(1),
    display: "flex",
    justifyContent: "flex-start",
    ":hover": {
      textDecoration: "underline",
    },
    "@media only screen and (max-width: 620px)": {
      display: "block",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      maxWidth: 200,
    },
  },
  addressContainer: {
    display: "flex",
    "@media only screen and (max-width: 620px)": {
      fontSize: 13,
    },
  },
  amountContainer: {
    height: "100%",
    display: "flex",
    alignItems: "flex-end",
    fontWeight: "bold",
    "@media only screen and (max-width: 620px)": {
      position: "absolute",
      bottom: 40,
      right: 15,
      height: "unset",
      fontSize: 13,
    },
  },
  coin: {
    height: 25,
    width: 25,
    marginTop: 1,
    marginLeft: 5,
  },
  clockIcon: {
    marginRight: 8,
    color: "rgb(190, 190, 190)",
  },
  black: {
    fontWeight: 500,
  },
  infoIcon: {
    marginLeft: 5,
    color: "rgb(190, 190, 190)",
    fontSize: 14,
  },
});

export default TransactionCard;
