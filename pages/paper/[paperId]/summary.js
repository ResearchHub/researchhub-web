import Link from "next/link";
import Router, { withRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";

// Components
import dynamic from "next/dynamic";
const DraftEditor = dynamic(
  () => import("../../../components/DraftEditor/DraftEditor"),
  { ssr: false }
);

class Summary extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange = editorState => {
    this.setState({ editorState });
  };

  render() {
    let { query } = this.props.router;
    return (
      <div className={css(styles.container)}>
        <DraftEditor />
      </div>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 500,
    padding: 50,
    display: "flex",
    boxSizing: "border-box"
  },
  megadraftContainer: {
    border: "1px solid",
    borderRadius: 8,
    flex: 1,
    boxSizing: "border-box",
    padding: 10,
    cursor: "text"
  }
});

export default withRouter(Summary);
