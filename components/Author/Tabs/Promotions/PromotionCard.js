import React from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import { connect } from "react-redux";

import Loader from "~/components/Loader/Loader";
import { ScorePill } from "~/components/VoteWidget";
import PromotionGraph from "./PromotionGraph";

import { AuthorActions } from "~/redux/author";

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

  toggleHover = (state) => {
    if (state !== this.state.hovered) {
      this.setState({ hovered: state });
    }
  };

  toggleRemove = () => {
    this.setState({ remove: true }, () => {
      let obj = { ...this.props.author.promotions };
      obj["count"]--;
      obj["results"].splice(this.props.index, 1);
      this.props.dispatch(
        AuthorActions.updateAuthorByKey({
          key: "promotions",
          value: obj,
          prevState: this.props.author,
        })
      );
    });
  };

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

  render() {
    /**
     * show loading state,
     * add pagination
     */
    let { promotion, paper } = this.props;
    let { fetchingClicks, fetchingViews, hovered, remove } = this.state;
    return (
      <div
        className={css(styles.card, remove && styles.hide)}
        onMouseEnter={() => this.toggleHover(true)}
        onMouseLeave={() => this.toggleHover(false)}
      >
        {hovered && (
          <div className={css(styles.trashIcon)} onClick={this.toggleRemove}>
            <i className="fad fa-trash-alt" />
          </div>
        )}
        <div className={css(styles.metadata)}>
          <div className={css(styles.column, styles.vote)}>
            <ScorePill
              score={paper.promoted ? paper.promoted : paper.score}
              promoted={paper.promoted}
            />
          </div>
          <div className={css(styles.column)}>
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paper.id}/summary`}
            >
              <a
                href={"/paper/[paperId]/[tabName]"}
                as={`/paper/${paper.id}/summary`}
                className={css(styles.link)}
              >
                <div className={css(styles.title)}>{paper.title}</div>
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
          <div
            className={css(styles.statsColumn)}
            onClick={() => this.toggleGraph(true)}
          >
            <span
              className={css(
                styles.icon,
                this.state.showViews && styles.active
              )}
              id={"statIcon"}
            >
              <i className="fas fa-eye" />
            </span>
            <div
              className={css(
                styles.stats,
                this.state.showViews && styles.active
              )}
              id={"stat"}
            >
              {fetchingViews ? (
                <Loader
                  key={"viewloader"}
                  loading={true}
                  size={10}
                  color={"rgba(36, 31, 58, 0.25)"}
                />
              ) : (
                this.state.views
              )}
            </div>
          </div>
          <div
            className={css(styles.statsColumn)}
            onClick={() => this.toggleGraph(false)}
          >
            <span
              className={css(
                styles.icon,
                !this.state.showViews && styles.active
              )}
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
              {fetchingClicks ? (
                <Loader
                  key={"clickLoader"}
                  loading={true}
                  size={10}
                  color={"rgba(36, 31, 58, 0.25)"}
                />
              ) : (
                this.state.clicks
              )}
            </div>
          </div>
          <div className={css(styles.statsColumn, styles.graph)}>
            <PromotionGraph
              paper={paper}
              setCount={this.setStateByKey}
              showViews={this.state.showViews}
            />
          </div>
        </div>
        <div
          className={css(styles.statsColumn, styles.graph, styles.mobileGraph)}
        >
          <PromotionGraph
            paper={paper}
            setCount={this.setStateByKey}
            showViews={this.state.showViews}
          />
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
    height: 15,
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
    ":hover #statIcon": {
      // color: colors.BLUE()
      color: "#241F3A",
    },
    ":hover #stat": {
      // color: colors.BLUE()
      color: "#241F3A",
    },
    "@media only screen and (max-width: 767px)": {
      marginLeft: 25,
    },
  },
  active: {
    // color: colors.BLUE()
    color: "#241F3A",
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
    paddingRight: 30,
    width: "60%",
    "@media only screen and (max-width: 767px)": {
      margin: "15px 0",
      width: "100%",
      boxSizing: "border-box",
      paddingRight: 0,
      justifyContent: "flex-start",
      paddingLeft: 36,
    },
  },
  graph: {
    width: 300,
    height: 100,
    border: "1px solid #FAFAFA",
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  mobileGraph: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
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
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  author: state.author,
});

export default connect(
  mapStateToProps,
  null
)(PromotionCard);
