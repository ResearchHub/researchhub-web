import { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Router from "next/router";

// Components
import BaseModal from "./BaseModal";
import Button from "../Form/Button";
import FormInput from "../Form/FormInput";
import FormSelect from "../Form/FormSelect";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "../../config/themes/colors";
import FormTextArea from "../Form/FormTextArea";
import { parseHub } from "~/config/types/hub";

class AddHubModal extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      hubDescription: "",
      hubName: "",
      error: {
        upload: false,
        changed: false,
      },
    };
    this.state = {
      ...this.initialState,
    };
    // rough estimates
    this.descriptionLimit = 150;
    this.nameLimit = 50;
  }

  hubNameFits = (text) => {
    return text.length <= this.nameLimit;
  };

  hubDescriptionFits = (text) => {
    return text.length <= this.descriptionLimit;
  };

  handleInputChange = (id, value) => {
    if (
      (id === "hubDescription" && !this.hubDescriptionFits(value)) ||
      (id === "hubName" && !this.hubNameFits(value))
    ) {
      return;
    }
    this.setState({ [id]: value });
  };

  handleCategoryChange = (id, value) => {
    const error = { ...this.state.error };
    if (value) {
      error.category = false;
    }
    this.setState({ [id]: value });
    this.setState({ error: error });
  };

  createHub = async () => {
    if (this.state.error.category) {
      this.props.setMessage("Required fields must be filled.");
      this.props.showMessage({
        load: false,
        show: true,
        error: true,
      });
      const error = { ...this.state.error };
      error.category = true;
      error.changed = true;
      this.setState({ error: error });

      return;
    }

    this.props.showMessage({ show: true, load: true });
    const { hubName, hubDescription, hubImage, hubCategory } = this.state;
    const isUnique = await this.isHubNameUnique(hubName);
    if (isUnique) {
      const data = new FormData();
      data.append("name", hubName.toLowerCase());
      data.append("description", hubDescription);
      return fetch(API.HUB({}), API.POST_FILE_CONFIG(data))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let newHub = res;
          this.props.addHub && this.props.addHub(newHub);
          this.props.setMessage("Hub successfully added!");
          this.props.showMessage({
            show: true,
            error: false,
            load: false,
            clickoff: false,
          });
          setTimeout(() => {
            this.props.showMessage({ show: false });
          }, 2000);
          this.closeModal();
        })
        .catch((err) => {
          if (err.response.status === 429) {
            this.props.showMessage({ show: false });
            this.closeModal();
            return this.props.openRecaptchaPrompt(true);
          }
          this.props.setMessage("Hmm something went wrong.");
          this.props.showMessage({ show: true, error: true });
          setTimeout(() => {
            this.props.showMessage({ show: false });
          }, 2000);
        });
    } else {
      this.props.setMessage("This hub name is already taken.");
      this.props.showMessage({ show: true, error: true });
      setTimeout(() => {
        this.props.showMessage({ show: false });
      }, 2000);
      const error = { ...this.state.error };
      error.upload = true;
      this.setState({ error: error });
    }
  };

  isHubNameUnique = (name) => {
    return fetch(API.HUB({ name }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        return resp.count === 0;
      });
  };

  closeModal = () => {
    this.props.openAddHubModal(false);
  };

  render() {
    const { modals } = this.props;
    return (
      <BaseModal
        isOpen={modals.openAddHubModal}
        closeModal={this.closeModal}
        title={"Create a Hub"}
        modalContentStyle={styles.modalContentStyle}
        subtitleStyle={styles.subtitleStyle}
        subtitle={
          "Make sure the hub you wish to create is not duplicative of any existing hub."
        }
      >
        <form
          encType="multipart/form-data"
          className={css(styles.form)}
          onSubmit={(e) => {
            e.preventDefault();
            this.createHub();
          }}
        >
          <FormInput
            label={"Hub Name"}
            placeholder={"Enter the name of the hub"}
            id={"hubName"}
            onChange={this.handleInputChange}
            containerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            inputStyle={this.state.error.upload && styles.error.upload}
            required={true}
            value={this.state.hubName}
          />
          <FormTextArea
            label={"Hub Description"}
            placeholder={"Enter a short description for the hub"}
            id={"hubDescription"}
            onChange={this.handleInputChange}
            containerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            inputStyle={this.state.error.upload && styles.error.upload}
            required={true}
            value={this.state.hubDescription}
          />
          <div className={css(styles.button)}>
            <Button
              label={"Create Hub"}
              type={"submit"}
              customButtonStyle={styles.buttonStyle}
            />
          </div>
        </form>
      </BaseModal>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    maxHeight: "70vh",
    overflowY: "auto",
    paddingRight: 15,
    width: "100%",
    "@media only screen and (min-width: 1024px)": {
      width: 500,
    },
  },
  buttonStyle: {
    height: 50,
    width: "100%",
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
  modalContentStyle: {
    padding: 50,
  },
  containerStyle: {
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
      marginBottom: 5,
    },
  },
  labelStyle: {
    "@media only screen and (max-width: 321px)": {
      fontSize: 13,
    },
  },
  error: {
    border: `1px solid ${colors.RED(1)}`,
  },
  subtitleStyle: {
    width: "70%",
  },
  dndContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = {
  openAddHubModal: ModalActions.openAddHubModal,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddHubModal);
