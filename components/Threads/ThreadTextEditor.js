import React from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Plain from "slate-plain-serializer";

import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import TextEditor from "../../components/TextEditor";

import DiscussionActions from "~/redux/discussion";

import { doesNotExist } from "../../config/utils";

import colors from "~/config/themes/colors";
import { convertToEditorValue } from "~/config/utils";

// const DynamicLoadedEditor = dynamic(import("../../components/TextEditor"), {
//   loading: () => <p>loading...</p>,
//   ssr: true,
// });

class ThreadTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      editorState:
        this.props.initialValue &&
        convertToEditorValue(this.props.initialValue),
      prevEditorState: this.props.initialValue && this.props.initialValue,
      newEditorState: {},
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

  onChange = (value) => {
    this.setState(
      {
        newEditorState: value,
        editorState: value,
      },
      () => {
        this.props.onChange && this.props.onChange(value);
      }
    );
  };

  onEditSubmit = (e) => {
    let value = this.state.editorState;
    let text = value.toJSON({ preserveKeys: true });
    let plain_text = Plain.serialize(value);
    this.setState({ loading: true }, () => {
      this.props.onEditSubmit &&
        this.props.onEditSubmit(text, plain_text, () => {
          this.setState({
            editorState: convertToEditorValue(this.state.newEditorState),
            loading: false,
          });
        });
    });
  };

  onEditCancel = (e) => {
    this.props.onEditCancel && this.props.onEditCancel();
    this.setState({
      editorState: convertToEditorValue(this.state.prevEditorState),
    });
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
          readOnly={!this.props.editing}
          // initialValue={this.props.initialValue && this.props.initialValue}
          initialValue={this.state.editorState}
          onSubmit={this.onEditSubmit}
          onCancel={this.onEditCancel}
          onChange={this.onChange}
          smallToolBar={true}
          commentEditor={true}
          loading={this.state.loading}
          commentStyles={[
            styles.comment,
            this.props.textStyles && this.props.textStyles,
            this.props.editing && styles.edit,
          ]}
          commentEditorStyles={[
            styles.textContainer,
            // this.props.editing && styles.edit
          ]}
          passedValue={this.state.editorState}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  loader: {},
  comment: {
    minHeight: "100%",
    padding: 0,
    lineHeight: 1.6,
    fontSize: 14,
    color: "#000",
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  textContainer: {
    background: "unset",
    border: "unset",
    ":hover": {
      backgroundColor: "unset",
      border: "unset",
    },
  },
  edit: {
    padding: 16,
    backgroundColor: colors.LIGHT_YELLOW(),
    border: `1px solid ${colors.YELLOW()}`,
    ":hover": {
      backgroundColor: colors.LIGHT_YELLOW(),
    },
  },
});

export default ThreadTextEditor;
