import { StyleSheet, css } from "aphrodite";
import ReactTooltip from "react-tooltip";
import Link from "next/link";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { formatTransactionDate } from "~/config/utils/dates";
import { transformDate } from "~/redux/utils";
import { getEtherscanLink } from "~/config/utils/crypto";

const TransactionCard = (props) => {
  let { transaction, style } = props;
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
      let url = getEtherscanLink(transaction.transaction_hash);
      let win = window.open(url, "_blank");
      win.focus();
    }
  }

  const paper = transaction.source?.proof_item?.paper;
  const comment = transaction.source?.proof_item?.source;
  const commentSlug =
    comment &&
    (comment.paper_slug
      ? `/paper/${comment.paper}/${comment.paper_slug}#comments`
      : comment.hypothesis_slug
      ? `/hypothesis/${comment.hypothesis}/${comment.hypothesis_slug}#comments`
      : comment.post_slug &&
        `/post/${comment.post}/${comment.post_slug}#comments`);

  const etherscanLink = getEtherscanLink(transaction.source?.transaction_hash);

  return (
    <div
      className={css(styles.transactionCard, style && style)}
      onClick={openTransactionHash}
    >
      <div className={css(styles.row)}>
        <div className={css(styles.column)}>
          <div className={css(styles.maintext)}>
            {transaction.source?.purchase_type === "DOI"
              ? `DOI`
              : transaction.source?.purchase_type === "BOOST"
              ? "Supported Content"
              : transaction.source?.distribution_type === "PURCHASE"
              ? "Received Support"
              : transaction.source?.distribution_type
              ? transaction.source?.distribution_type
                  .replaceAll("_", " ")
                  .toLocaleLowerCase()
              : transaction.source?.to_address
              ? "Withdrawal"
              : ""}
          </div>
          {transaction.source?.transaction_hash ? (
            <a
              href={etherscanLink}
              target="_blank"
              className={css(styles.metatext, styles.noUnderline)}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className={css(styles.metatext)}>{etherscanLink}</div>
            </a>
          ) : null}
          {paper && (
            <Link href={`/paper/${paper.id}/${paper.slug}`}>
              <a
                className={css(styles.metatext)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className={css(styles.metatext)}>{paper.paper_title}</div>
              </a>
            </Link>
          )}
          {transaction.source?.purchase_type === "DOI" && (
            <Link
              href={`/post/${transaction.source.source.id}/${transaction.source.source.slug}`}
            >
              <a
                className={css(styles.metatext)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className={css(styles.metatext)}>
                  {transaction.source.source.title}
                </div>
              </a>
            </Link>
          )}
          {commentSlug && (
            <Link href={commentSlug}>
              <a
                className={css(styles.metatext, styles.noUnderline)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div
                  className={css(styles.metatext)}
                >{`"${comment.plain_text}"`}</div>
              </a>
            </Link>
          )}
          <div className={css(styles.metatext)}>
            Created:{" "}
            {formatTransactionDate(transformDate(transaction.created_date))}
          </div>
          <div className={css(styles.metatext)}>
            Last Update:{" "}
            {formatTransactionDate(transformDate(transaction.updated_date))}
          </div>
          {transaction.source?.transaction_hash && (
            <div
              className={css(
                styles.row,
                styles.metatext,
                styles.colorBlack,
                styles.walletLink
              )}
            >
              Transaction Details:
              <span className={css(styles.address)}>
                {transaction.source.transaction_hash}
              </span>
            </div>
          )}
          {transaction.source?.to_address && (
            <>
              <div
                className={css(
                  styles.row,
                  styles.metatext,
                  styles.colorBlack,
                  styles.walletLink
                )}
              >
                Wallet Address:
                <span className={css(styles.address)}>
                  {transaction.source?.to_address}
                  <span
                    className={css(styles.infoIcon)}
                    data-tip="User's wallet address"
                  >
                    {icons["info-circle"]}
                    <ReactTooltip />
                  </span>
                </span>
              </div>
              <div
                className={css(styles.row, styles.metatext, styles.colorBlack)}
              >
                {renderStatus(transaction.source.paid_status)}
              </div>
            </>
          )}
        </div>
        <div className={css(styles.amountContainer)}>
          {transaction.amount}
          <img
            className={css(styles.coin)}
            src={"/static/icons/coin-filled.png"}
            draggable={false}
            alt="RSC Icon"
          />
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  transactionCard: {
    width: "100%",
    padding: 15,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    cursor: "pointer",
    borderBottom: "1px solid #EDEDED",
    marginBottom: 10,
    borderRadius: 3,
    background: "white",
    border: "1px solid #EDEDED",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
    ":last-child": {
      borderBottom: 0,
    },
    "@media only screen and (max-width: 620px)": {
      position: "relative",
    },
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    boxSizing: "border-box",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  timestamp: {
    fontSize: 14,
  },
  metatext: {
    fontSize: 14,
    color: "rgba(36, 31, 58, 0.5)",
    marginBottom: 5,
    width: "100%",
    wordBreak: "break-all",
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
  },
  colorBlack: {
    color: colors.BLACK(),
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
    ":hover": {
      borderColor: "#2a6218",
    },
  },
  pending: {
    color: "#DCAA72",
    backgroundColor: "#FDF2DE",
    borderColor: "#FDF2DE",
    ":hover": {
      borderColor: "#DCAA72",
    },
  },
  failed: {
    color: colors.RED(),
    backgroundColor: "rgba(235, 51, 35, 0.2)",
    borderColor: "rgba(235, 51, 35, 0.2)",
    ":hover": {
      borderColor: colors.RED(),
    },
  },
  maintext: {
    fontWeight: 500,
    marginBottom: 10,
    textTransform: "capitalize",
    "@media only screen and (max-width: 620px)": {
      fontSize: 16,
    },
  },
  address: {
    marginLeft: 5,
    color: colors.BLUE(1),
    cursor: "pointer",
    display: "flex",
    justifyContent: "flex-start",
    maxWidth: 300,

    ":hover": {
      textDecoration: "underline",
    },
    "@media only screen and (max-width: 620px)": {
      display: "block",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      margin: 0,
      marginTop: 5,
    },
  },
  addressContainer: {
    display: "flex",
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
  },
  amountContainer: {
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    fontSize: 15,
    "@media only screen and (max-width: 767px)": {
      position: "absolute",
      top: 16,
      right: 16,
      fontSize: 14,
    },
  },
  coin: {
    height: 20,
    width: 20,
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
    color: colors.BLACK(0.4),
    fontSize: 14,
  },
  walletLink: {
    justifyContent: "unset",
    "@media only screen and (max-width: 767px)": {
      display: "block",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
});

export default TransactionCard;
