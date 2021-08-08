import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactPlaceholder from "react-placeholder";
import Ripples from "react-ripples";

// Components
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import Loader from "~/components/Loader/Loader";
import EmptyState from "./EmptyState";

// Redux
import { AuthorActions } from "~/redux/author";

// Config
import icons from "~/config/themes/icons";
import colors, { genericCardColors } from "~/config/themes/colors";
import PaperPlaceholder from "../../Placeholders/PaperPlaceholder";

class UserContributionsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contributions:
        this.props.author.userContributions &&
        this.props.author.userContributions.contributions
          ? this.props.author.userContributions.contributions
          : [],
      fetching: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.author.userContributions !== prevProps.author.userContributions
    ) {
      this.setState({
        contributions: this.props.author.userContributions.contributions,
      });
    }
  }

  voteCallback = (index, paper) => {
    const contributions = [...this.state.contributions];
    contributions[index] = paper;
    this.setState({ contributions });
  };

  loadMore = () => {
    this.setState({ fetching: true }, async () => {
      const next = this.props.author.userContributions.next;
      await this.props.getUserContributions({ next });
      this.setState({ fetching: false });
    });
  };

  renderLoadMoreButton = () => {
    const { author } = this.props;

    if (author && author.userContributions) {
      const { next } = author.userContributions;

      if (next) {
        return (
          <div className={css(styles.buttonContainer)}>
            {!this.state.fetching ? (
              <Ripples
                className={css(styles.loadMoreButton)}
                onClick={this.loadMore}
              >
                Load More
              </Ripples>
            ) : (
              <Loader
                key={"userContributionLoader"}
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
    const { maxCardsToRender } = this.props;
    const contributions = [];

    for (let i = 0; i < this.state.contributions.length; i++) {
      if (i === maxCardsToRender) break;

      const current = this.state.contributions[i];
      contributions.push(
        <PaperEntryCard
          paper={current}
          key={`userContribution-${current.id}-${i}`}
          index={i}
          styleVariation="noBorderVariation"
          voteCallback={this.voteCallback}
          mobileView={this.props.mobileView}
        />
      );
    }

    return (
      <ReactPlaceholder
        ready={
          this.props.author.contributionsDoneFetching && !this.props.fetching
        }
        showLoadingAnimation
        customPlaceholder={<PaperPlaceholder color="#efefef" />}
      >
        {contributions.length > 0 ? (
          <div className={css(styles.container)}>
            {contributions}
            {!maxCardsToRender && this.renderLoadMoreButton()}
          </div>
        ) : (
          <EmptyState
            message={"User has not submitted any papers"}
            icon={icons.file}
          />
        )}
      </ReactPlaceholder>
    );
  }
}

var styles = StyleSheet.create({
  title: {
    fontWeight: 500,
  },
  contributionContainer: {
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
  noBorder: {
    border: "none",
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
  author: state.author,
});

const mapDispatchToProps = {
  getUserContributions: AuthorActions.getUserContributions,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserContributionsTab);
