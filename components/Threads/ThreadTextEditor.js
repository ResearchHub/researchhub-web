import React from "react";
import dynamic from "next/dynamic";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import TextEditor from "../../components/TextEditor";

import DiscussionActions from "~/redux/discussion";

import { doesNotExist } from "../../config/utils";

// const DynamicLoadedEditor = dynamic(import("../../components/TextEditor"), {
//   loading: () => <p>loading...</p>,
//   ssr: true,
// });

class ThreadTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  onSubmit = (text, plain_text) => {
    this.setState({ loading: true }, () => {
      this.props.onSubmit &&
        this.props.onSubmit(text, plain_text, () => {
          this.setState({ loading: false });
          setTimeout(() => {
            this.onCancel();
          }, 400);
        });
    });
  };

  onCancel = (e) => {
    this.props.onCancel && this.props.onCancel(e);
  };

  onChange = (e) => {
    this.props.onChange && this.props.onChange();
  };

  render() {
    if (!this.props.body) {
      return (
        <PermissionNotificationWrapper
          modalMessage="post a comment"
          permissionKey="CreateDiscussionComment"
          onClick={null}
          loginRequired={true}
          hideRipples={true}
        >
          <TextEditor
            readOnly={false}
            onSubmit={this.onSubmit}
            clearOnSubmit={true}
            hideCancelButton={false}
            commentEditor={true}
            smallToolBar={true}
            onCancel={this.onCancel}
            onChange={this.onChange}
            loading={this.state.loading}
          />
        </PermissionNotificationWrapper>
      );
    } else {
      return (
        <TextEditor
          readOnly={true}
          initialValue={this.props.initialValue && this.props.initialValue}
          commentStyles={styles.comment}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  loader: {},
  comment: {
    minHeight: "100%",
    padding: "0px",
    lineHeight: 1.6,
    fontSize: 14,
    color: "#000",
  },
});

export default ThreadTextEditor;
