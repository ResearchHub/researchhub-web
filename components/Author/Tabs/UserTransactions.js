import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import TransactionCard from "../../ResearchCoin/TransactionCard";
import Loader from "~/components/Loader/Loader";

// Redux
import { TransactionActions } from "~/redux/transaction";

// Config
import colors from "~/config/themes/colors";

class UserTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
    };
  }

  getWithdrawals = (nextPage) => {
    let prevState = this.props.transactions;
    if (this.props.auth.isLoggedIn) {
      this.props.getWithdrawals(nextPage, prevState);
    }
  };

  render() {
    let { transactions } = this.props;
    return (
      <ComponentWrapper>
        <InfiniteScroll
          pageStart={0}
          loadMore={(page) => this.getWithdrawals(page)}
          hasMore={transactions.next !== null}
          loader={<Loader loading={true} key={"transaction-loader"} />}
          className={css(styles.infinite)}
        >
          {transactions.withdrawals.map((transaction, i) => {
            return (
              <TransactionCard
                key={`transactionCard-${i}`}
                transaction={transaction}
              />
            );
          })}
        </InfiniteScroll>
      </ComponentWrapper>
    );
  }
}

var styles = StyleSheet.create({
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
});

const mapStateToProps = (state) => ({
  transactions: state.transactions,
  auth: state.auth,
});

const mapDispatchToProps = {
  getWithdrawals: TransactionActions.getWithdrawals,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTransaction);
