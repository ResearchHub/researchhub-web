import { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

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
import { toTitleCase } from "~/config/utils/string";
import { Helpers } from "@quantfive/js-web-config";
import colors from "../../config/themes/colors";
import FormTextArea from "../Form/FormTextArea";

class EditHubModal extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      hubDescription: "",
      hubName: "",
      error: false,
    };
    this.state = {
      ...this.initialState,
    };
    this.descriptionLimit = 150;
    this.nameLimit = 50;
  }

  componentDidUpdate = (prevProps, prevState) => {
    let prevHub = prevProps.modals.editHubModal.hub;
    let currHub = this.props.modals.editHubModal.hub;
    if (prevHub !== currHub) {
      let hub = this.props.modals.editHubModal.hub;
      this.setState({
        originalHubName: hub ? toTitleCase(hub.name) : "",
        hubName: hub ? toTitleCase(hub.name) : "",
        hubDescription: hub ? hub.description : "",
      });
    }
  };

  hubNameFits = (text) => {
    if (text.length < this.props.modals.editHubModal.hub.name.length) {
      return true;
    }
    return text.length <= this.nameLimit;
  };

  hubDescriptionFits = (text) => {
    if (text.length < this.props.modals.editHubModal.hub.description.length) {
      return true;
    }
    return text.length <= this.descriptionLimit;
  };

  getMatchingCategory = (id) => {
    const categories = this.props.categories.map((elem) => {
      return { value: elem.id, label: elem.category_name };
    });
    for (const category of categories) {
      if (category.value === id) {
        return category.label;
      }
    }
  };

  handleInputChange = (id, value) => {
    if (
      (id === "hubDescription" && !this.hubDescriptionFits(value)) ||
      (id === "hubName" && !this.hubNameFits(value))
    ) {
      return;
    }
    this.setState({ [id]: id === "hubName" ? toTitleCase(value) : value });
  };

  UpdateHub = async (hub) => {
    this.props.showMessage({ show: true, load: true });
    const { hubName, hubDescription, hubImage, hubCategory } = this.state;
    let isUniqueOrCurrent = true;
    if (hubName) {
      isUniqueOrCurrent =
        hubName == this.state.originalHubName ||
        (await this.isHubNameUnique(hubName));
    }
    if (isUniqueOrCurrent) {
      const data = new FormData();
      data.append("id", hub.id);
      data.append("name", hubName ? hubName.toLowerCase() : hub.name);
      if (hubDescription) {
        data.append("description", hubDescription);
      }
      if (hubImage) {
        data.append("hub_image", hubImage);
      }
      if (hubCategory) {
        data.append("category", hubCategory.value);
      }
      return fetch(API.HUB({ hubId: hub.id }), API.PUT_FILE_CONFIG(data))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          setTimeout(() => {
            this.props.editHub && this.props.editHub(res, hub.category);
            this.props.showMessage({ show: false });
            this.props.setMessage("Hub successfully updated!");
            this.props.showMessage({ show: true });
            this.closeModal();
            setTimeout(() => {
              this.props.showMessage({ show: false });
            }, 1200);
          }, 400);
        })
        .catch((err) => {
          if (err.response.status === 429) {
            this.props.showMessage({ show: false });
            this.closeModal();
            return this.props.openRecaptchaPrompt(true);
          }
          setTimeout(() => {
            this.props.showMessage({ show: false });
            this.props.setMessage("Hmm something went wrong.");
            this.props.showMessage({ show: true, error: true });
            setTimeout(() => {
              this.props.showMessage({ show: false });
            }, 1200);
          }, 400);
        });
    } else {
      setTimeout(() => {
        this.props.showMessage({ show: false });
        this.props.setMessage("This hub name is already taken.");
        this.props.showMessage({ show: true, error: true });
        this.setState({ error: true });
        setTimeout(() => {
          this.props.showMessage({ show: false });
        }, 1200);
      }, 400);
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
    this.props.openEditHubModal(false);
    this.setState({
      ...this.initialState,
    });
  };

  render() {
    const { modals } = this.props;
    const hub = modals.editHubModal.hub;
    return (
      <BaseModal
        isOpen={modals.openEditHubModal}
        closeModal={this.closeModal}
        title={"Editing Hub"}
      >
        <form
          encType="multipart/form-data"
          className={css(styles.form)}
          onSubmit={(e) => {
            e.preventDefault();
            this.UpdateHub(hub);
          }}
        >
          <FormInput
            label={"Hub Name"}
            value={this.state.hubName}
            id={"hubName"}
            onChange={this.handleInputChange}
            containerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            inputStyle={this.state.error && styles.error}
            required={true}
          />
          <FormTextArea
            label={"Hub Description"}
            value={this.state.hubDescription}
            id={"hubDescription"}
            onChange={this.handleInputChange}
            containerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            inputStyle={this.state.error && styles.error}
            required={true}
          />
          <div className={css(styles.button)}>
            <Button
              label={"Update Hub"}
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
    marginTop: 16,
    marginBottom: 16,
    width: "100%",
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
  imageContainer: {
    textAlign: "left",
    width: "100%",
    fontWeight: "500",
    marginBottom: 10,
    color: "#232038",
  },
  image: {
    borderRadius: "8px",
    width: "364px",
    height: "200px",
    objectFit: "cover",
    pointerEvents: "none",
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = {
  openEditHubModal: ModalActions.openEditHubModal,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditHubModal);
