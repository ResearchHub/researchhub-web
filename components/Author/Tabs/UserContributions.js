import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactPlaceholder from "react-placeholder";
import Ripples from "react-ripples";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import Loader from "~/components/Loader/Loader";

// Redux
import { AuthorActions } from "~/redux/author";

// Config
import colors from "~/config/themes/colors";
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

  componentDidMount() {
    let { author } = this.props;
    this.setState({
      // contributions: author.userContributions.contributions,
    });
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
    let contributions = [...this.state.contributions];
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
    let { author } = this.props;

    if (author && author.userContributions) {
      let { next } = author.userContributions;

      if (next !== null) {
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
    let contributions = this.state.contributions.map((contribution, index) => {
      return (
        <div className={css(styles.contributionContainer)}>
          <PaperEntryCard
            key={`userContribution-${contribution.id}-${index}`}
            paper={contribution}
            index={index}
            voteCallback={this.voteCallback}
          />
        </div>
      );
    });
    return (
      <ComponentWrapper>
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
              {this.renderLoadMoreButton()}
            </div>
          ) : (
            <div className={css(styles.box)}>
              <div className={css(styles.icon)}>
                <i className="fad fa-comment-alt-edit"></i>
              </div>
              <h2 className={css(styles.noContent)}>
                User has no contributions.
              </h2>
            </div>
          )}
        </ReactPlaceholder>
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
