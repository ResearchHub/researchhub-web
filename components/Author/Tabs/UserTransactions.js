import { Component } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactPlaceholder from "react-placeholder";
import Ripples from "react-ripples";

// Components
import TransactionCard from "../../ResearchCoin/TransactionCard";
import Loader from "~/components/Loader/Loader";
import PaperPlaceholder from "~/components/Placeholders/PaperPlaceholder";
import EmptyState from "./EmptyState";

// Redux
import { TransactionActions } from "~/redux/transaction";

// Config
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

class UserTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
    };
  }

  loadMore = () => {
    this.setState({ loading: true }, () => {
      fetch(this.props.transactions.next, API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let newState = { ...this.props.transactions };
          newState.next = res.next;
          newState.withdrawals = [
            ...this.props.transactions.withdrawals,
            ...res.results,
          ];
          this.props.updateState(newState);
          this.setState({ loading: false });
        });
    });
  };

  renderLoadMoreButton = () => {
    if (this.props.transactions && this.props.transactions.withdrawals) {
      const { loading } = this.state;
      const { next } = this.props.transactions;
      if (next) {
        return (
          <div className={css(styles.buttonContainer)}>
            {!loading ? (
              <Ripples
                className={css(styles.loadMoreButton)}
                onClick={this.loadMore}
              >
                Load More
              </Ripples>
            ) : (
              <Loader
                key={"paperLoader"}
                loading={true}
                size={25}
                color={colors.BLUE()}
              />
            )}
          </div>
        );
      }
    }
  };

  render() {
    const { transactions, maxCardsToRender, auth } = this.props;

    return (
      <ReactPlaceholder
        ready={transactions && !this.props.fetching}
        showLoadingAnimation
        customPlaceholder={<PaperPlaceholder color="#efefef" />}
      >
        {transactions && transactions.withdrawals.length ? (
          transactions.withdrawals.map((transaction, i) => {
            return (
              <TransactionCard
                key={`transactionCard-${i}`}
                transaction={transaction}
                mobileView={this.props.mobileView}
              />
            );
          })
        ) : (
          <EmptyState
            message={"User has not created any transactions"}
            icon={icons.receipt}
          />
        )}
        {!maxCardsToRender && this.renderLoadMoreButton()}
      </ReactPlaceholder>
    );
  }
}

var styles = StyleSheet.create({
  root: {
    paddinRight: 30,
  },
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    boxSizing: "border-box",
  },
  paperContainer: {
    width: "100%",
  },
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  noContent: {
    color: colors.BLACK(1),
    fontSize: 20,
    fontWeight: 500,
    textAlign: "center",
    "@media only screen and (max-width: 415px)": {
      width: 280,
      fontSize: 16,
    },
  },
  icon: {
    fontSize: 50,
    color: colors.BLUE(1),
    height: 50,
    marginBottom: 10,
  },
  infinite: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    height: 45,
    "@media only screen and (max-width: 768px)": {
      marginTop: 15,
      marginBottom: 15,
    },
  },
  loadMoreButton: {
    fontSize: 14,
    border: `1px solid ${colors.BLUE()}`,
    boxSizing: "border-box",
    borderRadius: 4,
    height: 45,
    width: 155,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: colors.BLUE(),
    cursor: "pointer",
    userSelect: "none",
    ":hover": {
      color: "#FFF",
      backgroundColor: colors.BLUE(),
    },
  },
});

const mapStateToProps = (state) => ({
  transactions: state.transactions,
  auth: state.auth,
});

const mapDispatchToProps = {
  getWithdrawals: TransactionActions.getWithdrawals,
  updateState: TransactionActions.updateState,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserTransaction);
