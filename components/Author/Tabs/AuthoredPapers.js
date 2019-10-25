import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";

class AuthoredPapersTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { author } = this.props;
    let papers = author.authoredPapers.papers.map((paper, index) => {
      return (
        <div className={css(styles.paperContainer)}>
          <PaperEntryCard paper={paper} index={index} />
        </div>
      );
    });
    return (
      <ComponentWrapper>
        <div className={css(styles.container)}>{papers}</div>
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
});

const mapStateToProps = (state) => ({
  author: state.author,
});

export default connect(mapStateToProps)(AuthoredPapersTab);
