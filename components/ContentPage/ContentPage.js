import { StyleSheet, css } from "aphrodite";

class ContentPage extends React.Component {
  render() {
    return (
      <div className={css(styles.content, styles.column)}>
        {this.props.banner && (
          <div className={css(styles.banner)}>{this.props.banner}</div>
        )}
        <div className={css(styles.row, styles.body)}>
          <div className={css(styles.column, styles.sidebar)}>
            <div className={css(styles.sticky)}>{this.props.sidebar}</div>
          </div>
          <div className={css(styles.column, styles.mainFeed)}>
            {this.props.mainFeed}
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#FFF",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  body: {
    backgroundColor: "#FCFCFC",
    width: "100vw",
    height: "100%",
    display: "table",
    position: "relative",
    boxSizing: "border-box",
  },
  sidebar: {
    display: "table-cell",
    position: "relative",
    paddingTop: 15,
    paddingLeft: 20,
    width: 255,
    minWidth: 230,
    maxWidth: 255,
    minHeight: "inherit",
    paddingBottom: 30,
    "@media only screen and (min-width: 1920px)": {
      minWidth: 280,
    },
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  sticky: {
    position: "sticky",
    top: 110,
  },
  banner: {
    width: "100%",
  },
  /**
   * MAIN FEED STYLES
   */
  mainFeed: {
    display: "table-cell",
    maxWidth: 1200,
    height: "100%",
    backgroundColor: "#FCFCFC",
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 768px)": {
      width: "100%",
    },
  },
});

export default ContentPage;
