import React from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import { connect } from "react-redux";
import moment from "moment";

// Components
import { ScorePill } from "~/components/VoteWidget";
import PromotionGraph from "./PromotionGraph";

// Config
import colors from "~/config/themes/colors";
import { formatTransactionDate } from "~/config/utils";
import { transformDate } from "~/redux/utils";

class PromotionCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      views: 0,
      clicks: 0,
      showViews: true,
      fetchingViews: true,
      fetchingClicks: true,
      hovered: false,
      remove: false,
    };
  }

  setStateByKey = (key, value) => {
    let newState = { [key]: value };
    if (key === "views") {
      newState["fetchingViews"] = false;
    } else {
      newState["fetchingClicks"] = false;
    }
    this.setState({ ...newState });
  };

  toggleGraph = (state) => {
    if (state !== this.state.showViews) {
      this.setState({ showViews: state });
    }
  };

  renderStatus = (status) => {
    switch (status) {
      case "PAID":
      case "paid":
        return <div className={css(styles.status, styles.progress)}>Paid</div>;
      case "initiated":
      case "INITIATED":
      case "PENDING":
      case "pending":
        return (
          <div className={css(styles.status, styles.pending)}>Pending</div>
        );
      case "FAILED":
      case "failed":
        return (
          <div className={css(styles.status, styles.confirmed)}>Failed</div>
        );
      case "active":
        return (
          <div className={css(styles.status, styles.progress)}>Active</div>
        );
      case "completed":
        return (
          <div className={css(styles.status, styles.completed)}>Completed</div>
        );
      default:
        return (
          <div className={css(styles.status, styles.failed)}>{status}</div>
        );
    }
  };

  renderData = () => {
    let { promotion } = this.props;
    return (
      <div className={css(styles.row)}>
        <div
          className={css(
            styles.statsColumn,
            this.state.showViews && styles.activeTab
          )}
          onClick={() => this.toggleGraph(true)}
        >
          <span
            className={css(styles.icon, this.state.showViews && styles.active)}
            id={"statIcon"}
          >
            <i className="fas fa-eye" />
          </span>
          <div
            className={css(styles.stats, this.state.showViews && styles.active)}
            id={"stat"}
          >
            {promotion.stats.total_views}
          </div>
        </div>
        <div
          className={css(
            styles.statsColumn,
            styles.right,
            !this.state.showViews && styles.activeTab
          )}
          onClick={() => this.toggleGraph(false)}
        >
          <span
            className={css(styles.icon, !this.state.showViews && styles.active)}
            id={"statIcon"}
          >
            <i className="fas fa-mouse-pointer" />
          </span>
          <div
            className={css(
              styles.stats,
              !this.state.showViews && styles.active
            )}
            id={"stat"}
          >
            {promotion.stats.total_clicks}
          </div>
        </div>
      </div>
    );
  };

  render() {
    /**
     * show loading state,
     * add pagination
     */
    let { promotion, paper } = this.props;

    return (
      <div className={css(styles.card)}>
        <div className={css(styles.metadata)}>
          <div className={css(styles.column, styles.vote)}>
            <ScorePill
              score={paper.promoted ? paper.promoted : paper.score}
              promoted={paper.promoted}
              paper={paper}
              type={"Paper"}
            />
          </div>
          <div className={css(styles.column)}>
            <Link
              href={"/paper/[paperId]/[paperName]"}
              as={`/paper/${paper.id}/${paper.slug}`}
            >
              <a className={css(styles.link)}>
                <div className={css(styles.title)}>{paper.title}</div>
              </a>
            </Link>
            <div className={css(styles.metatext)}>
              Start Date:{" "}
              {formatTransactionDate(transformDate(promotion.created_date))}
              {promotion.stats.end_date
                ? this.renderStatus(
                    moment() < moment(promotion.stats.end_date)
                      ? "active"
                      : "completed"
                  )
                : this.renderStatus(promotion.paid_status)}
            </div>
            {promotion.stats.end_date && (
              <div className={css(styles.metatext)}>
                End Date:{" "}
                {formatTransactionDate(transformDate(promotion.stats.end_date))}
              </div>
            )}
            <div className={css(styles.amountContainer, styles.metatext)}>
              {"Promoted Amount: "}
              <div className={css(styles.amount)}>
                {promotion.stats.total_amount}
              </div>
              <img
                className={css(styles.coin)}
                src={"/static/icons/coin-filled.png"}
                draggable={false}
              />
            </div>
            {this.renderData()}
          </div>
        </div>
        <div className={css(styles.dataContainer)}>
          <div className={css(styles.graph)}>
            <PromotionGraph
              paper={paper}
              promotion={promotion}
              clicks={promotion.stats.clicks ? promotion.stats.clicks : []}
              views={promotion.stats.views ? promotion.stats.views : []}
              showViews={this.state.showViews}
            />
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    width: "100%",
    padding: "27px 20px",
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    borderBottom: "1px solid #EDEDED",
    marginBottom: 10,
    borderRadius: 3,
    position: "relative",
    "@media only screen and (max-width: 767px)": {
      width: "85%",
      flexDirection: "column",
    },
    "@media only screen and (max-width: 620px)": {
      position: "relative",
    },
  },
  hide: {
    display: "none",
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
    padding: "0.5px 8px",
    fontSize: 12,
    textTransform: "capitalize",
    letterSpacing: 1.1,
    borderRadius: 3,
    fontWeight: 500,
    marginLeft: 10,
    border: "1px solid #FFF",
    "@media only screen and (max-width: 620px)": {
      fontSize: 11,
    },
  },
  progress: {
    color: "#FFF",
    backgroundColor: "#48C055",
    borderColor: "#48C055",
    textTransform: "unset",
    ":hover": {
      borderColor: "#2a6218",
    },
  },
  completed: {
    textTransform: "unset",
    color: "#241F3A",
    background: "rgba(36, 31, 58, 0.03)",
    border: "1px solid rgba(36, 31, 58, 0.15)",
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
    height: 15,
    marginLeft: 5,
  },
  link: {
    color: "unset",
    textDecoration: "unset",
  },
  metadata: {
    width: "55%",
    display: "flex",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  metatext: {
    display: "flex",
    alignItems: "flex-start",
    fontSize: 14,
    color: "rgba(36, 31, 58, 0.5)",
    marginBottom: 5,
  },
  vote: {
    marginRight: 15,
  },
  statsColumn: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "4px 12px",
    borderRadius: 4,
    ":hover #statIcon": {
      color: colors.BLUE(),
    },
    ":hover #stat": {
      color: colors.BLUE(),
    },
  },
  right: {
    marginLeft: 20,
  },
  active: {
    color: colors.BLUE(),
  },
  activeTab: {
    backgroundColor: colors.BLUE(0.11),
  },
  icon: {
    color: "rgba(36, 31, 58, 0.25)",
    fontSize: 18,
    marginRight: 8,
    // width: 20,
    "@media only screen and (max-width: 767px)": {
      fontSize: 16,
      width: "unset",
    },
  },
  iconPointer: {
    color: "rgba(36, 31, 58, 0.25)",
    fontSize: 18,
    marginRight: 8,
    // transform: "scaleX(-1)",
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
    // paddingRight: 30,
    width: "45%",
    "@media only screen and (max-width: 767px)": {
      justifyContent: "center",
      paddingRight: 0,
      width: "100%",
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 10,
  },
  graph: {
    width: "100%",
    height: 180,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    "@media only screen and (max-width: 767px)": {
      height: 200,
    },
  },
  mobileGraph: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      height: 200,
      display: "flex",
      marginLeft: "auto",
      marginRight: "auto",
      justifyContent: "center",
    },
  },
  trashIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    cursor: "pointer",
    color: "rgba(36, 31, 58, 0.5)",
    opacity: 0.6,
    ":hover": {
      opacity: 1,
    },
  },
  italics: {
    fontStyle: "italic",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  author: state.author,
});

export default connect(
  mapStateToProps,
  null
)(PromotionCard);
