import { Component } from "react";
import { StyleSheet } from "aphrodite";

// Component
import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import TextEditor from "../../components/TextEditor";

// Config
import colors from "~/config/themes/colors";
import { convertToEditorValue } from "~/config/utils/editor";

class ThreadTextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      editorState:
        this.props.initialValue &&
        convertToEditorValue(this.props.initialValue),
    };
  }

  componentDidMount() {
    let editorState =
      this.props.initialValue && convertToEditorValue(this.props.initialValue);
    this.setState({
      editorState: editorState,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initialValue !== this.props.initialValue) {
      let editorState =
        this.props.initialValue &&
        convertToEditorValue(this.props.initialValue);
      this.setState({
        editorState: editorState,
      });
    }
  }

  onSubmit = ({ content, plainText, callback }) => {
    this.setState({ loading: true, editorState: content }, () => {
      this.props.onSubmit &&
        this.props.onSubmit({
          content,
          plainText,
          callback: () => {
            this.setState({ loading: false });
            this.onCancel();
            callback && callback();
          },
        });
    });
  };

  onCancel = (e) => {
    this.props.onCancel && this.props.onCancel(e);
  };

  onChange = (value) => {
    this.props.onChange && this.props.onChange();
  };

  onEditSubmit = ({ content, plainText, discussionType }) => {
    this.setState({ loading: true, editorState: content }, () => {
      this.props.onEditSubmit &&
        this.props
          .onEditSubmit({
            content,
            plainText,
            discussionType,
            callback: () => {
              this.setState({
                loading: false,
              });
            },
          })
          .catch((error) => {
            this.props.onError && this.props.onError(error);
            this.setState({
              loading: false,
            });
          });
    });
  };

  onEditCancel = (e) => {
    this.props.onEditCancel && this.props.onEditCancel();
  };

  render() {
    let { mediaOnly, placeholder, textEditorId } = this.props;
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
            clearOnSubmit={true}
            commentEditor={true}
            editing={this.props.editing}
            focusEditor={this.props.focusEditor}
            hasHeader={this.props.hasHeader}
            hideCancelButton={false}
            initialValue={this.state.editorState}
            isAcceptedAnswer={this.props.isAcceptedAnswer}
            isBounty={this.props.isBounty}
            loading={this.state.loading}
            quillContainerStyle={this.props.quillContainerStyle}
            mediaOnly={mediaOnly}
            onCancel={this.onCancel}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            placeholder={placeholder || "What are your thoughts?"}
            postType={this.props.postType}
            readOnly={false}
            smallToolBar={true}
            uid={textEditorId}
          />
        </PermissionNotificationWrapper>
      );
    } else {
      window.editorState = this.state.editorState;

      return (
        <TextEditor
          commentEditor={true}
          commentStyles={[
            styles.comment,
            this.props.textStyles && this.props.textStyles,
            this.props.editing && styles.edit,
          ]}
          commentEditorStyles={[
            styles.textContainer,
            this.props.editing && styles.editTextContainer,
          ]}
          quillContainerStyle={this.props.quillContainerStyle}
          editing={this.props.editing}
          focusEditor={this.props.focusEditor}
          initialValue={this.state.editorState}
          isAcceptedAnswer={this.props.isAcceptedAnswer}
          isBounty={this.props.isBounty}
          loading={this.state.loading}
          mediaOnly={mediaOnly}
          onCancel={this.onEditCancel}
          onChange={this.onChange}
          onSubmit={this.onEditSubmit}
          passedValue={this.state.editorState}
          placeholder={placeholder || "What are your thoughts?"}
          postType={this.props.postType}
          readOnly={!this.props.editing}
          smallToolBar={true}
          uid={textEditorId}
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
  editTextContainer: {},
  edit: {
    padding: 16,
    backgroundColor: colors.LIGHT_YELLOW(),
    // border: `1px solid ${colors.YELLOW()}`,
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
