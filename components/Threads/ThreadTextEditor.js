import React from "react";
import { StyleSheet, css } from "aphrodite";
import { isAndroid, isMobile } from "react-device-detect";
import Plain from "slate-plain-serializer";

// Component
import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import TextEditor from "../../components/TextEditor";
import FormTextArea from "../../components/Form/FormTextArea";
import Button from "../../components/Form/Button";

// Config
import colors from "~/config/themes/colors";
import { convertToEditorValue } from "~/config/utils";

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
      //
      androidText: "",
      prevAndroidText: "",
    };
  }

  componentDidMount() {
    let editorState =
      this.props.initialValue && convertToEditorValue(this.props.initialValue);
    let androidText = editorState && editorState.document.text;

    this.setState({
      editorState: editorState,
      prevEditorState: this.props.initialValue,
      androidText: androidText ? androidText : "",
      prevAndroidText: androidText ? androidText : "",
    });
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

  handleAndroidText = (id, value) => {
    this.setState({
      androidText: value,
    });
  };

  handleAndroidEdit = (id, value) => {
    this.setState({
      androidText: value,
    });
  };

  onAndroidEditCancel = (e) => {
    this.setState(
      {
        androidText: this.state.prevAndroidText,
      },
      () => {
        this.props.onEditCancel && this.props.onEditCancel();
      }
    );
  };

  submitAndroid = (e) => {
    let androidEditor = convertToEditorValue(this.state.androidText);

    let valueObj = androidEditor.toJSON({ preserveKeys: true });
    let plain_text = this.state.androidText;

    this.setState({ loading: true }, () => {
      this.props.onSubmit &&
        this.props.onSubmit(valueObj, plain_text, () => {
          this.setState({ loading: false });
          setTimeout(() => {
            this.onCancel();
          }, 400);
        });
    });
  };

  onEditSubmitAndroid = () => {
    let androidEditor = convertToEditorValue(this.state.androidText);

    let valueObj = androidEditor.toJSON({ preserveKeys: true });
    let plain_text = this.state.androidText;

    this.setState({ loading: true }, () => {
      this.props.onEditSubmit &&
        this.props.onEditSubmit(valueObj, plain_text, () => {
          this.setState(
            {
              prevAndroidText: this.state.androidText,
              editorState: convertToEditorValue(this.state.androidText),
              loading: false,
            },
            () => {
              console.log("thistate", this.state);
            }
          );
        });
    });
  };

  renderAndroidEditor = () => {
    return (
      <PermissionNotificationWrapper
        modalMessage="post a comment"
        permissionKey="CreateDiscussionComment"
        onClick={null}
        loginRequired={true}
        hideRipples={true}
      >
        <FormTextArea
          containerStyle={[
            styles.androidContainer,
            this.props.editing && styles.editAndroidContainer,
          ]}
          placeholder={"What are your thoughts?"}
          inputStyle={styles.androidInput}
          value={this.state.androidText}
          onChange={this.handleAndroidText}
        />
        <div className={css(styles.buttonRow)}>
          <Button
            isWhite={true}
            onClick={
              this.props.editing ? this.onAndroidEditCancel : this.onCancel
            }
            label={"Hide"}
            size={"med"}
          />
          <span className={css(styles.divider)} />
          <Button
            onClick={
              this.props.editing ? this.onEditSubmitAndroid : this.submitAndroid
            }
            label="Submit"
            size={"med"}
          />
        </div>
      </PermissionNotificationWrapper>
    );
  };

  render() {
    if (!this.props.body) {
      if (isAndroid) {
        return this.renderAndroidEditor();
      } else {
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
      }
    } else {
      if (isAndroid && this.props.editing) {
        return this.renderAndroidEditor();
      } else {
        return (
          <TextEditor
            readOnly={!this.props.editing}
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
            commentEditorStyles={[styles.textContainer]}
            passedValue={this.state.editorState}
          />
        );
      }
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
  androidContainer: {
    margin: 0,
    boxSizing: "border-box",
    height: 154,
  },
  editAndroidContainer: {},
  androidInput: {
    minHeight: "100%",
    width: "100%",
    lineHeight: 1.6,
    fontSize: 14,
    color: "#000",
    boxSizing: "border-box",
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: 16,
    borderTop: "1px solid rgb(235, 235, 235)",
    background: "#FFF",
  },
  divider: {
    width: 10,
  },
});

export default ThreadTextEditor;
