import React from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Components
import BaseModal from "./BaseModal";
import Button from "../Form/Button";
import FormInput from "../Form/FormInput";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "../../config/themes/colors";

class AddHubModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      hubName: "",
      error: false,
    };
    this.state = {
      ...this.initialState,
    };
  }

  handleInputChange = (id, value) => {
    this.setState({ [id]: value });
  };

  createHub = async () => {
    this.props.showMessage({ show: true, load: true });
    let userSubmission = this.state.hubName.toLowerCase();
    let isUnique = await this.isHubNameUnique(userSubmission);
    if (isUnique) {
      let param = {
        name: userSubmission,
      };
      return fetch(API.HUB({}), API.POST_CONFIG(param))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let newHub = res;
          setTimeout(() => {
            this.props.addHub && this.props.addHub(newHub);
            this.props.showMessage({ show: false });
            this.props.setMessage("Hub successfully added!");
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
    this.props.openAddHubModal(false);
    this.setState({
      ...this.initialState,
    });
    document.body.style.overflow = "scroll";
  };

  render() {
    const { modals, openAddHubModal } = this.props;
    return (
      <BaseModal
        isOpen={modals.openAddHubModal}
        closeModal={this.closeModal}
        title={"Create a New Hub"}
        subtitle={"All newly created hubs will be locked."}
      >
        <form
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
            inputStyle={this.state.error && styles.error}
            required={true}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddHubModal);
