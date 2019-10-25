import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import { Reply } from "~/components/DiscussionComment";

class UserContributionsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { author } = this.props;
    let contributions = author.userContributions.contributions.map(
      (contribution, index) => {
        return (
          <div className={css(styles.contributionContainer)}>
            {contribution.type === "paper" ? (
              <PaperEntryCard paper={contribution} index={index} />
            ) : contribution.type === "comment" ? (
              <div className={css(styles.contributionContainer)}>
                <Reply data={contribution} />
              </div>
            ) : (
              <div className={css(styles.contributionContainer)}>
                <Reply data={contribution} />
              </div>
            )}
          </div>
        );
      }
    );
    return (
      <ComponentWrapper>
        <div className={css(styles.container)}>{contributions}</div>
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
});

const mapStateToProps = (state) => ({
  author: state.author,
});

export default connect(mapStateToProps)(UserContributionsTab);
