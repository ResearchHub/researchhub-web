import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactPlaceholder from "react-placeholder";
import Ripples from "react-ripples";

// Components
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import PaperPlaceholder from "../../Placeholders/PaperPlaceholder";

// Config
import colors from "~/config/themes/colors";
import Loader from "../../Loader/Loader";
import { AuthorActions } from "../../../redux/author";

class AuthoredPapersTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 2,
      papers:
        this.props.author.authoredPapers &&
        this.props.author.authoredPapers.papers
          ? this.props.author.authoredPapers.papers
          : [],
    };
  }

  voteCallback = (index, paper) => {
    let papers = [...this.state.papers];
    papers[index] = paper;

    this.setState({ papers });
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.author.authoredPapers.papers !==
      prevProps.author.authoredPapers.papers
    ) {
      this.setState({
        papers: this.props.author.authoredPapers.papers,
      });
    }
  }

  loadMore = () => {
    this.setState({ fetching: true }, async () => {
      let { getAuthoredPapers } = this.props;
      let { page } = this.state;
      const next = this.props.author.authoredPapers.next;
      await getAuthoredPapers({ page });
      this.setState({
        page: this.state.page + 1,
      });
      this.setState({ fetching: false });
    });
  };

  renderLoadMoreButton = () => {
    let { author } = this.props;

    if (author && author.authoredPapers) {
      let { next } = author.authoredPapers;

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
                key={"authored-loader"}
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
    let { papers } = this.state;
    let authoredPapers = papers.map((paper, index) => {
      return (
        <div className={css(styles.paperContainer)}>
          <PaperEntryCard
            paper={paper}
            index={index}
            style={[
              styles.paperEntryCard,
              index === papers.length - 1 && styles.noBorder,
            ]}
            voteCallback={this.voteCallback}
          />
        </div>
      );
    });
    return (
      <ReactPlaceholder
        ready={this.props.author.authorDoneFetching}
        showLoadingAnimation
        customPlaceholder={<PaperPlaceholder color="#efefef" />}
      >
        {authoredPapers.length > 0 ? (
          <div className={css(styles.container)}>
            {authoredPapers}
            {this.renderLoadMoreButton()}
          </div>
        ) : (
          <div className={css(styles.box)}>
            <div className={css(styles.icon)}>
              <i className="fad fa-file-alt" />
            </div>
            <h2 className={css(styles.noContent)}>
              User has not authored any papers.
            </h2>
          </div>
        )}
      </ReactPlaceholder>
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
  paperEntryCard: {
    border: 0,
    borderBottom: "1px solid rgba(36, 31, 58, 0.08)",
    marginBottom: 0,
    marginTop: 0,
    paddingTop: 24,
    paddingBottom: 24,
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
    border: 0,
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
  getAuthoredPapers: AuthorActions.getAuthoredPapers,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthoredPapersTab);
