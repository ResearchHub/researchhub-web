import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactPlaceholder from "react-placeholder";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import PaperPlaceholder from "../../Placeholders/PaperPlaceholder";

// Config
import colors from "~/config/themes/colors";

class AuthoredPapersTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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

  render() {
    let { papers } = this.state;
    let authoredPapers = papers.map((paper, index) => {
      return (
        <div className={css(styles.paperContainer)}>
          <PaperEntryCard
            paper={paper}
            index={index}
            voteCallback={this.voteCallback}
          />
        </div>
      );
    });
    return (
      <ComponentWrapper>
        <ReactPlaceholder
          ready={this.props.author.authorDoneFetching}
          showLoadingAnimation
          customPlaceholder={<PaperPlaceholder color="#efefef" />}
        >
          {authoredPapers.length > 0 ? (
            <div className={css(styles.container)}>{authoredPapers}</div>
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
});

const mapStateToProps = (state) => ({
  author: state.author,
});

export default connect(mapStateToProps)(AuthoredPapersTab);
