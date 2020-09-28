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

class AddHubModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      hubName: "",
      categories:
        this.props.categories && this.props.categories.results
          ? this.props.categories.results
          : [],
      error: {
        upload: false,
        category: true,
        changed: false,
      },
    };
    this.state = {
      ...this.initialState,
    };
  }

  handleInputChange = (id, value) => {
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
      if (hubImage) {
        data.append("hub_image", hubImage);
      }
      data.append("category", hubCategory.value);
      return fetch(API.HUB({}), API.POST_FILE_CONFIG(data))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let newHub = res;
          this.props.addHub && this.props.addHub(newHub);
          this.props.showMessage({ show: false });
          this.props.setMessage("Hub successfully added!");
          this.props.showMessage({ show: true });
          this.closeModal();
        })
        .catch((err) => {
          if (err.response.status === 429) {
            this.props.showMessage({ show: false });
            this.closeModal();
            return this.props.openRecaptchaPrompt(true);
          }
          this.props.showMessage({ show: false });
          this.props.setMessage("Hmm something went wrong.");
          this.props.showMessage({ show: true, error: true });
        });
    } else {
      this.props.showMessage({ show: false });
      this.props.setMessage("This hub name is already taken.");
      this.props.showMessage({ show: true, error: true });
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
    document.body.style.overflow = "scroll";
  };

  render() {
    const { modals, openAddHubModal } = this.props;
    const categories = this.props.categories.map((elem) => {
      return { value: elem.id, label: elem.category_name };
    });
    return (
      <BaseModal
        isOpen={modals.openAddHubModal}
        closeModal={this.closeModal}
        title={"Create a New Hub"}
        subtitle={"All newly created hubs will be locked."}
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
            placeholder={"Enter the name of hub"}
            id={"hubName"}
            onChange={this.handleInputChange}
            containerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            inputStyle={this.state.error.upload && styles.error.upload}
            required={true}
          />
          <FormInput
            label={"Hub Description"}
            placeholder={"Enter a short description for the hub"}
            id={"hubDescription"}
            onChange={this.handleInputChange}
            containerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            inputStyle={this.state.error.upload && styles.error.upload}
            required={true}
          />
          <FormSelect
            label={"Category"}
            maxMenuHeight={200}
            placeholder="Search Hub Categories"
            required={true}
            containerStyle={styles.container}
            inputStyle={styles.input}
            labelStyle={styles.labelStyle}
            isMulti={false}
            id={"hubCategory"}
            options={categories}
            onChange={this.handleCategoryChange}
            error={this.state.error.category && this.state.error.changed}
          />
          <FormInput
            label={"Hub Image (Optional)"}
            type="file"
            accept="image/*"
            id={"hubImage"}
            onChange={this.handleInputChange}
            containerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            inputStyle={this.state.error.upload && styles.error}
            required={false}
          />
          <div className={css(styles.button)}>
            <Button
              label={"Create New Hub"}
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
  dndContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  categories: state.hubs.categories,
});

const mapDispatchToProps = {
  openAddHubModal: ModalActions.openAddHubModal,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddHubModal);
