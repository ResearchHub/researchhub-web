import { StyleSheet, css } from "aphrodite";
import "react-placeholder/lib/reactPlaceholder.css";

class ContentPage extends React.Component {
  render() {
    return (
      <div className={css(styles.content, styles.column)}>
        {this.props.banner && (
          <div className={css(styles.banner)}>{this.props.banner}</div>
        )}
        <div className={css(styles.row, styles.body)}>
          <div className={css(styles.sidebar, styles.column)}>
            {this.props.sidebar}
          </div>
          <div className={css(styles.mainFeed, styles.column)}>
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
    width: "100%",
    alignItems: "flex-start",
  },
  sidebar: {
    width: "18%",
    minHeight: "100vh",
    minWidth: 220,
    position: "relative",
    position: "sticky",
    top: 80,
    borderRight: "1px solid #ededed",
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 769px)": {
      display: "none",
    },
  },
  banner: {
    width: "100%",
  },
  /**
   * MAIN FEED STYLES
   */
  mainFeed: {
    height: "100%",
    width: "82%",
    backgroundColor: "#FCFCFC",
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 768px)": {
      width: "100%",
    },
  },
});

export default ContentPage;
