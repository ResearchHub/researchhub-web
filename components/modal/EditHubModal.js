import React from "react";
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
import { HubActions } from "~/redux/hub";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "../../config/themes/colors";

class EditHubModal extends React.Component {
  constructor(props) {
    super(props);
    const categories = this.props.categories.map((elem) => {
      return { value: elem.id, label: elem.category_name };
    });
    this.initialState = {
      hubName: "",
      error: false,
      changed: false,
      categories: categories,
    };
    this.state = {
      ...this.initialState,
    };
  }

  getMatchingCategory = (id) => {
    for (const category of this.state.categories) {
      if (category.value === id) {
        return category.label;
      }
    }
  };

  handleInputChange = (id, value) => {
    this.setState({ [id]: value });
    this.setState({ changed: true });
  };

  UpdateHub = async (hub) => {
    this.props.showMessage({ show: true, load: true });
    const { hubName, hubDescription, hubImage, hubCategory } = this.state;
    let isUnique = true;
    if (hubName) {
      isUnique = await this.isHubNameUnique(hubName);
    }
    if (isUnique) {
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
        .then((_res) => {
          setTimeout(() => {
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
    document.body.style.overflow = "scroll";
    this.props.closeModal();
  };

  // Thank you stackoverflow :)
  toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  render() {
    const { modals } = this.props;
    const hub = modals.editHubModal.hub;
    let image;
    let name;
    let description;
    if (hub) {
      image = hub.hub_image
        ? hub.hub_image
        : "/static/background/twitter-banner.jpg";
    } else {
      image = null;
    }
    if (this.state.changed) {
      if (this.state.hubName) {
        name = this.toTitleCase(this.state.hubName);
      }
      if (this.state.hubDescription) {
        description = this.state.hubDescription;
      }
    } else {
      name = hub ? this.toTitleCase(hub.name) : null;
      description = hub ? hub.description : null;
    }

    return (
      <BaseModal
        isOpen={modals.openEditHubModal}
        closeModal={this.closeModal}
        title={"Edit the Hub"}
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
            value={name}
            id={"hubName"}
            onChange={this.handleInputChange}
            containerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            inputStyle={this.state.error && styles.error}
            required={false}
          />
          <FormInput
            label={"Hub Description"}
            value={description}
            id={"hubDescription"}
            onChange={this.handleInputChange}
            containerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            inputStyle={this.state.error && styles.error}
            required={false}
          />
          <FormSelect
            label={"Category"}
            placeholder={hub ? this.getMatchingCategory(hub.category) : null}
            required={false}
            containerStyle={styles.container}
            inputStyle={styles.input}
            labelStyle={styles.labelStyle}
            isMulti={false}
            id={"hubCategory"}
            options={this.state.categories}
            onChange={this.handleInputChange}
            error={this.state.error && this.state.error}
          />
          <div className={css(styles.imageContainer)}>
            <p>Existing Image:</p>
          </div>
          <img
            className={css(styles.image)}
            src={image}
            alt={"Existing Hub Image"}
          ></img>
          <FormInput
            label={"Upload New Hub Image"}
            type="file"
            accept="image/*"
            id={"hubImage"}
            onChange={this.handleInputChange}
            containerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            inputStyle={this.state.error && styles.error}
            required={false}
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
  },
  button: {
    marginTop: 20,
  },
  buttonStyle: {
    height: 45,
    width: 140,
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
    borderRadius: "8px 8px 8px 8px",
    width: "364px",
    height: "200px",
    objectFit: "cover",
    pointerEvents: "none",
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  categories: state.hubs.categories,
});

const mapDispatchToProps = {
  getCategories: HubActions.getCategories,
  openEditHubModal: ModalActions.openEditHubModal,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditHubModal);
