import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect, useDispatch, useStore } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { Value } from "slate";
import Plain from "slate-plain-serializer";
import InfiniteScroll from "react-infinite-scroller";
import Ripples from "react-ripples";

// Components
import ComponentWrapper from "../../ComponentWrapper";
import PermissionNotificationWrapper from "../../PermissionNotificationWrapper";
import AddDiscussionModal from "~/components/modal/AddDiscussionModal";
import TextEditor from "~/components/TextEditor";
import Message from "~/components/Loader/Message";
import FormSelect from "~/components/Form/FormSelect";
import Loader from "~/components/Loader/Loader";
import DiscussionEntry from "../../Threads/DiscussionEntry";

class CitationCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    <div className={css(styles.card)}></div>;
  }
}

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  preview: {},
});
