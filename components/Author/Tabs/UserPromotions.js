import React from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Link from "next/link";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import { Reply, Comment } from "~/components/DiscussionComment";

// Config
import colors from "~/config/themes/colors";
import PaperPlaceholder from "../../Placeholders/PaperPlaceholder";
import { formatTransactionDate } from "~/config/utils";
import { transformDate } from "~/redux/utils";

class UserPromotions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderStatus = (status) => {
    switch (status) {
      case "initiated":
      case "INITIATED":
        return (
          <div className={css(styles.status, styles.confirmed)}>{status}</div>
        );
      case "PENDING":
      case "pending":
        return (
          <div className={css(styles.status, styles.pending)}>{status}</div>
        );
      case "SUCCESS":
      case "success":
        return (
          <div className={css(styles.status, styles.confirmed)}>{status}</div>
        );
      default:
        return (
          <div className={css(styles.status, styles.failed)}>{status}</div>
        );
    }
  };

  renderPromotions = () => {
    let { author } = this.props;
    return (
      author.promotions &&
      author.promotions.results.map((promotion, i) => {
        return (
          <div className={css(styles.card)}>
            <div className={css(styles.timestamp)}>
              <span className={css(styles.clockIcon)}>
                <i className={"fad fa-clock"} />
              </span>
              {formatTransactionDate(transformDate(promotion.created_date))}
            </div>
            <div className={css(styles.statusContainer)}>
              {this.renderStatus(promotion.status)}
            </div>
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${promotion.source.id}/summary`}
            >
              <a
                href={"/paper/[paperId]/[tabName]"}
                as={`/paper/${promotion.source.id}/summary`}
                className={css(styles.link)}
              >
                <div className={css(styles.title)}>
                  {promotion.source.title}
                </div>
              </a>
            </Link>
            <div className={css(styles.amountContainer)}>
              {"Amount Used in Promotion: "}
              <div className={css(styles.amount)}>{promotion.amount}</div>
              <img
                className={css(styles.coin)}
                src={"/static/icons/coin-filled.png"}
                draggable={false}
              />
            </div>
          </div>
        );
      })
    );
  };

  render() {
    return (
      <ComponentWrapper>
        <div className={css(styles.feed)}>{this.renderPromotions()}</div>
      </ComponentWrapper>
    );
  }
}

const styles = StyleSheet.create({
  feed: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  card: {
    width: "100%",
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
    position: "relative",
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
  timestamp: {
    marginBottom: 15,
    fontSize: 14,
    "@media only screen and (max-width: 620px)": {
      fontSize: 13,
    },
  },
  clockIcon: {
    marginRight: 8,
    color: "rgb(190, 190, 190)",
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 500,
    width: "100%",
    ":hover": {
      color: colors.BLUE(),
      textDecoration: "underline",
    },
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
  statusContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    position: "absolute",
    top: 20,
    right: 20,
  },
  amountContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    fontWeight: 400,
    "@media only screen and (max-width: 620px)": {
      fontSize: 13,
    },
  },
  amount: {
    fontWeight: "bold",
    marginLeft: 10,
    "@media only screen and (max-width: 620px)": {
      fontSize: 13,
    },
  },
  coin: {
    height: 20,
    marginLeft: 5,
  },
  link: {
    color: "unset",
    textDecoration: "unset",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  author: state.author,
});

export default connect(
  mapStateToProps,
  null
)(UserPromotions);
