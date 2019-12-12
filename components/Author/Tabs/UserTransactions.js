import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";

// Config
import colors from "~/config/themes/colors";

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
        {papers.length > 0 ? (
          <div className={css(styles.container)}>{papers}</div>
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
