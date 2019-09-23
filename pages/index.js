import Link from "next/link";
import Router from "next/router";

import { StyleSheet, css } from "aphrodite";

class Index extends React.Component {
  render() {
    return (
      <div className="hero">
        <div onClick={() => Router.push(`/paper/[paperId]/summary`)}>
          summary
        </div>
      </div>
    );
  }
}

var styles = StyleSheet.create({});

export default Index;
