// NPM Modules
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StyleSheet, css } from "aphrodite";
import Modal from "react-modal";

// Redux
import { ModalActions } from "../../redux/modals";

// Component
import FormInput from "../Form/FormInput";
import Button from "../Form/Button";

class AddAuthorModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      first_name: "",
      last_name: "",
      // university: "",
      email: "",
      social_media: {
        facebook: "",
        linked_in: "",
        web: "",
      },
      showLinks: false,
    };

    this.state = {
      ...this.initialState,
    };
  }

  /**
   * closes the modal on button click
   */
  closeModal = () => {
    let { modalActions } = this.props;
    this.setState({
      ...this.initialState,
    });
    modalActions.openAddAuthorModal(false);
  };

  handleInputChange = (id, value) => {
    this.setState({ [id]: value });
  };

  toggleShowLinks = () => {
    this.setState({ showLinks: !this.state.showLinks });
  };

  /**
   * Adds a new user by posting form data. Uses HTML5's form onSubmit
   * @param { Event } e --javascript event
   */
  addNewUser = (e) => {
    e.preventDefault();
    let params = {
      ...this.state,
    };
    this.props.addNewUser(params);
    this.closeModal();
  };

  render() {
    let {
      first_name,
      last_name,
      university,
      email,
      social_media,
      showLinks,
    } = this.state;
    let { modals } = this.props;
    return (
      <Modal
        isOpen={this.props.isOpen}
        closeModal={this.closeModal}
        className={css(styles.modal)}
        shouldCloseOnOverlayClick={true}
        style={overlayStyles}
      >
        <div className={css(styles.modalContent)}>
          <img
            src={"/static/icons/close.png"}
            className={css(styles.closeButton)}
            onClick={this.closeModal}
          />
          <div className={css(styles.titleContainer)}>
            <div className={css(styles.title, styles.text)}>Add New Author</div>
            <div className={css(styles.subtitle, styles.text)}>
              Please enter the information about the user below
            </div>
          </div>
          <form onSubmit={this.addNewUser}>
            <div className={css(styles.row, styles.customMargins)}>
              <FormInput
                label={"First Name"}
                value={first_name}
                placeholder={"Enter first name"}
                required={true}
                id={"first_name"}
                onChange={this.handleInputChange}
                containerStyle={styles.halfWidth}
              />
              <FormInput
                label={"Last Name"}
                value={last_name}
                placeholder={"Enter last name"}
                required={true}
                id={"last_name"}
                onChange={this.handleInputChange}
                containerStyle={styles.halfWidth}
              />
            </div>
            {/* <FormInput
              label={"University Affiliation"}
              value={university}
              placeholder={"Enter university name"}
              id={"university"}
              onChange={this.handleInputChange}
              containerStyle={styles.customMargins}
            /> */}
            <FormInput
              label={"Email Address"}
              value={email}
              placeholder={"Enter email address"}
              id={"email"}
              type={"email"}
              onChange={this.handleInputChange}
              containerStyle={styles.customMargins}
            />

            <div className={css(styles.socialMediaContainer)}>
              <div className={css(styles.inputLabel)}>
                Social Media Links
                <div
                  className={css(styles.dropdownIcon)}
                  onClick={this.toggleShowLinks}
                >
                  {showLinks ? (
                    <i class="fal fa-angle-down" style={{ fontSize: "25px" }} />
                  ) : (
                    <i class="fal fa-angle-up" style={{ fontSize: "25px" }} />
                  )}
                </div>
              </div>
              <span
                className={css(
                  styles.linksContainer,
                  showLinks && styles.reveal
                )}
              >
                <FormInput
                  value={social_media.facebook}
                  placeholder={"Paste Link Here"}
                  id={"facebook"}
                  onChange={this.handleInputChange}
                  inputStyle={styles.inputStyle}
                  containerStyle={styles.inputStyle}
                  iconStyles={styles.fb}
                  icon={"/static/icons/fb.png"}
                />
                <FormInput
                  value={social_media.linked_in}
                  placeholder={"Paste Link Here"}
                  id={"linked_in"}
                  onChange={this.handleInputChange}
                  inputStyle={styles.inputStyle}
                  containerStyle={styles.inputStyle}
                  iconStyles={styles.icon}
                  icon={"/static/icons/linked-in.png"}
                />
                <FormInput
                  value={social_media.web}
                  placeholder={"Paste Link Here"}
                  id={"web"}
                  onChange={this.handleInputChange}
                  inputStyle={styles.inputStyle}
                  containerStyle={styles.inputStyle}
                  iconStyles={styles.icon}
                  icon={"/static/icons/web.png"}
                />
              </span>
            </div>
            <Button
              label={"Add user"}
              type={"submit"}
              customButtonStyle={styles.button}
            />
          </form>
        </div>
      </Modal>
    );
  }
}

const overlayStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: "11",
    borderRadius: 5,
  },
};

const styles = StyleSheet.create({
  modal: {
    background: "#fff",
    outline: "none",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#fff",
    padding: 50,
    // height: 600,
    // overflowY: "scroll",
  },
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 20,
    right: 20,
    cursor: "pointer",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    fontWeight: "500",
    height: 30,
    width: 426,
    fontSize: 26,
    color: "#232038",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    height: 22,
    width: 484,
    fontWeight: "400",
    color: "#4f4d5f",
  },
  text: {
    fontFamily: "Roboto",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  halfWidth: {
    width: "48%",
    marginTop: 0,
    marginBottom: 0,
  },
  inputLabel: {
    height: 19,
    fontWeight: "500",
    width: "100%",
    color: "#232038",
    display: "flex",
    justifyContent: "space-between",
    textAlign: "left",
    cursor: "pointer",
  },
  customMargins: {
    marginTop: 30,
    marginBottom: 0,
  },
  socialMediaContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "flex-end",
    textAlign: "left",
    width: 527,
    marginTop: 30,
  },
  inputStyle: {
    height: 50,
    marginBottom: 5,
    marginTop: 5,
  },
  fb: {
    width: 10,
    height: 20,
  },
  icon: {
    width: 20,
    height: 20,
  },
  button: {
    margin: "0 auto",
    marginTop: 30,
    minHeight: 55,
    maxHeight: 55,
    width: 240,
  },
  dropdownIcon: {
    marginRight: 5,
    width: 25,
    display: "flex",
    justifyContent: "flex-end",
  },
  linksContainer: {
    height: 0,
    transition: "all ease-in-out 0.3s",
    overflow: "hidden",
  },
  reveal: {
    height: 170,
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAuthorModal);
