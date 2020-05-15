import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { isAndroid, isMobile } from "react-device-detect";

// Component
import PermissionNotificationWrapper from "../PermissionNotificationWrapper";
import FormTextArea from "../../components/Form/FormTextArea";
import Button from "../../components/Form/Button";

// Config
import colors from "~/config/themes/colors";
import { convertToEditorValue } from "~/config/utils";

class AndroidTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      prevText: "",
    };
  }

  componentDidMount() {
    let text = this.props.initialValue && this.props.initialValue.document.text;
    this.setState({
      text,
      prevText: text,
    });
  }

  handleAndroidText = (id, value) => {
    this.setState({
      text: value,
    });
  };

  handleAndroidEdit = (id, value) => {
    this.setState({
      prevtext: value,
    });
  };

  onAndroidEditCancel = (e) => {
    this.setState(
      {
        text: this.state.prevtext,
      },
      () => {
        this.props.onEditCancel && this.props.onEditCancel();
      }
    );
  };

  submitAndroid = (e) => {
    if (this.state.text.trim() === "") {
      return;
    }
    let androidEditor = convertToEditorValue(this.state.text);

    let valueObj = androidEditor.toJSON({ preserveKeys: true });
    let plain_text = this.state.text;

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

  onCancel = () => {
    this.props.onCancel && this.props.onCancel();
  };

  render() {
    return (
      <Fragment>
        <FormTextArea
          containerStyle={[
            styles.androidContainer,
            this.props.editing && styles.editAndroidContainer,
          ]}
          placeholder={"What are your thoughts?"}
          inputStyle={styles.androidInput}
          value={this.state.text}
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
          <Button onClick={this.submitAndroid} label="Submit" size={"med"} />
        </div>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  androidContainer: {
    margin: 0,
    boxSizing: "border-box",
    height: 154,
  },
  editAndroidContainer: {
    backgroundColor: colors.LIGHT_YELLOW(),
    border: `1px solid ${colors.YELLOW()}`,
    ":hover": {
      backgroundColor: colors.LIGHT_YELLOW(),
    },
  },
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

export default AndroidTextEditor;
