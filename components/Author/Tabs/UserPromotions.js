import React from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Link from "next/link";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import { ScorePill } from "~/components/VoteWidget";

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
      case "PAID":
      case "paid":
        return (
          <div className={css(styles.status, styles.confirmed)}>{status}</div>
        );
      case "initiated":
      case "INITIATED":
      case "PENDING":
      case "pending":
        return (
          <div className={css(styles.status, styles.pending)}>{status}</div>
        );
      case "FAILED":
      case "failed":
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
        const { source } = promotion;

        return (
          <div className={css(styles.card)}>
            <div className={css(styles.metadata)}>
              <div className={css(styles.column, styles.vote)}>
                <ScorePill
                  score={source.promoted ? source.promoted : source.score}
                  promoted={source.promoted}
                />
              </div>
              <div className={css(styles.column)}>
                <Link
                  href={"/paper/[paperId]/[tabName]"}
                  as={`/paper/${promotion.source.id}/summary`}
                >
                  <a
                    href={"/paper/[paperId]/[tabName]"}
                    as={`/paper/${promotion.source.id}/summary`}
                    className={css(styles.link)}
                  >
                    <div className={css(styles.title)}>{source.title}</div>
                  </a>
                </Link>
                <div className={css(styles.metatext)}>
                  Promotion Date:{" "}
                  {formatTransactionDate(transformDate(promotion.created_date))}
                  {this.renderStatus(promotion.paid_status)}
                </div>
                <div className={css(styles.amountContainer, styles.metatext)}>
                  {"Amount Used in Promotion: "}
                  <div className={css(styles.amount)}>{promotion.amount}</div>
                  <img
                    className={css(styles.coin)}
                    src={"/static/icons/coin-filled.png"}
                    draggable={false}
                  />
                </div>
              </div>
            </div>
            <div className={css(styles.dataContainer)}>
              <div className={css(styles.statsColumn)}>
                <span className={css(styles.icon)}>
                  <i className="fas fa-eye" />
                </span>
                <div className={css(styles.stats)}>5424</div>
              </div>
              <div className={css(styles.statsColumn)}>
                <span className={css(styles.icon)}>
                  <i className="fas fa-mouse-pointer" />
                </span>
                <div className={css(styles.stats)}>424</div>
              </div>
              <div className={css(styles.statsColumn)}>
                <span className={css(styles.icon)}>
                  <i className="fas fa-share-square" />
                </span>
                <div className={css(styles.stats)}>424</div>
              </div>
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
    justifyContent: "space-between",
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
      flexDirection: "column",
    },
    "@media only screen and (max-width: 620px)": {
      // height: 110,
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
    padding: "1px 8px",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    borderRadius: 3,
    fontWeight: 500,
    marginLeft: 10,
    border: "1px solid #FFF",
    "@media only screen and (max-width: 620px)": {
      fontSize: 11,
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
  statusContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    position: "absolute",
    top: 20,
    right: 20,
  },
  amountContainer: {
    display: "flex",
    alignItems: "center",
    fontWeight: 400,
    marginTop: 5,
    "@media only screen and (max-width: 767px)": {
      fontSize: 13,
    },
  },
  amount: {
    fontWeight: "bold",
    marginLeft: 5,
    "@media only screen and (max-width: 767px)": {
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
  metadata: {
    width: "50%",
    display: "flex",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  metatext: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    color: "rgba(36, 31, 58, 0.5)",
  },
  vote: {
    marginRight: 15,
  },
  statsColumn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 25,
    "@media only screen and (max-width: 767px)": {
      marginLeft: 25,
    },
  },
  icon: {
    color: "rgba(36, 31, 58, 0.25)",
    fontSize: 18,
    marginRight: 8,
    // width: 20,
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
      width: "unset",
    },
  },
  stats: {
    color: "#241F3A",
    fontSize: 16,
    fontWeight: 500,
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
  },
  dataContainer: {
    display: "flex",
    justifyContent: "space-between",
    paddingRight: 30,
    width: "60%",
    "@media only screen and (max-width: 767px)": {
      marginTop: 10,
      width: "100%",
      boxSizing: "border-box",
      paddingRight: 0,
      justifyContent: "flex-end",
      // paddingLeft: 45
    },
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
