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
import UniversityInput from "../SearchSuggestion/UniversityInput";

import icons from "~/config/themes/icons";
import * as shims from "../../config/shims";

class AddAuthorModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      first_name: "",
      last_name: "",
      university: "",
      email: "",
      facebook: "",
      linkedin: "",
      twitter: "",
      showLinks: false,
      mobileView: false,
    };

    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    if (window.innerWidth < 436) {
      this.setState({
        mobileView: true,
      });
    } else {
      this.setState({
        mobileView: false,
      });
    }
  };

  /**
   * closes the modal on button click
   */
  closeModal = () => {
    let { modalActions } = this.props;
    this.setState({
      ...this.initialState,
    });
    this.enableParentScroll();
    modalActions.openAddAuthorModal(false);
  };

  handleInputChange = (id, value) => {
    this.setState({ [id]: value });
  };

  handleUniversity = (university) => {
    this.setState({ university: university.id });
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
    const params = shims.authorPost(this.state);
    this.props.addNewUser(params);
    this.closeModal();
  };

  /**
   * prevents scrolling of parent component when modal is open
   * & renables scrolling of parent component when modal is closed
   */
  disableParentScroll = () => {
    if (document.body.style) {
      document.body.style.overflow = "hidden";
    }
  };

  enableParentScroll = () => {
    if (document.body.style) {
      document.body.style.overflow = "scroll";
    }
  };

  render() {
    let {
      first_name,
      last_name,
      university,
      email,
      facebook,
      linked_in,
      twitter,
      showLinks,
      mobileView,
    } = this.state;
    let { modals } = this.props;
    return (
      <Modal
        isOpen={this.props.isOpen}
        closeModal={this.closeModal}
        className={css(styles.modal)}
        shouldCloseOnOverlayClick={true}
        style={mobileView ? mobileOverlayStyles : overlayStyles}
        onAfterOpen={this.disableParentScroll}
      >
        <div className={css(styles.modalContent)}>
          <img
            src={"/static/icons/close.png"}
            className={css(styles.closeButton)}
            onClick={this.closeModal}
            alt="Close Button"
          />
          <div className={css(styles.titleContainer)}>
            <div className={css(styles.title, styles.text)}>Add New Author</div>
            <div className={css(styles.subtitle, styles.text)}>
              {`Please enter the information ${
                mobileView ? "\n" : ""
              } about the user below`}
            </div>
          </div>
          <form className={css(styles.form)} onSubmit={this.addNewUser}>
            <div className={css(styles.row, styles.customMargins)}>
              <FormInput
                label={"First Name"}
                value={first_name}
                placeholder={"Enter first name"}
                required={true}
                id={"first_name"}
                onChange={this.handleInputChange}
                containerStyle={styles.halfWidth}
                labelStyle={styles.labelStyle}
              />
              <FormInput
                label={"Last Name"}
                value={last_name}
                placeholder={"Enter last name"}
                required={true}
                id={"last_name"}
                onChange={this.handleInputChange}
                containerStyle={styles.lastName}
                labelStyle={styles.labelStyle}
              />
            </div>
            <FormInput
              label={"Last Name"}
              value={last_name}
              placeholder={"Enter last name"}
              required={true}
              id={"last_name"}
              onChange={this.handleInputChange}
              containerStyle={styles.mobileLastName}
              labelStyle={styles.labelStyle}
            />
            <UniversityInput
              label={"University Affiliation"}
              onChange={this.handleAuthor}
              inputStyle={styles.inputStyle}
              labelStyle={styles.labelStyle}
              containerStyle={styles.universityContainer}
              handleUserClick={this.handleUniversity}
            />
            <FormInput
              label={"Email Address"}
              value={email}
              placeholder={"Enter email address"}
              id={"email"}
              type={"email"}
              onChange={this.handleInputChange}
              containerStyle={styles.emailInput}
              labelStyle={styles.labelStyle}
            />

            <div className={css(styles.socialMediaContainer)}>
              <div
                className={css(styles.inputLabel)}
                onClick={this.toggleShowLinks}
              >
                Social Media Links
                <div className={css(styles.dropdownIcon)}>
                  <span style={{ fontSize: "25px" }}>
                    {showLinks ? icons.angleDown : icons.angleUp}
                  </span>
                </div>
              </div>
              <span
                className={css(
                  styles.linksContainer,
                  showLinks && styles.reveal
                )}
              >
                <FormInput
                  value={facebook}
                  placeholder={"Paste Link Here"}
                  id={"facebook"}
                  onChange={this.handleInputChange}
                  inputStyle={styles.inputStyle}
                  containerStyle={styles.inputStyle}
                  iconStyles={styles.fb}
                  icon={"/static/icons/fb.png"}
                  labelStyle={styles.labelStyle}
                />
                <FormInput
                  value={linked_in}
                  placeholder={"Paste Link Here"}
                  id={"linked_in"}
                  onChange={this.handleInputChange}
                  inputStyle={styles.inputStyle}
                  containerStyle={styles.inputStyle}
                  iconStyles={styles.icon}
                  icon={"/static/icons/linked-in.png"}
                  labelStyle={styles.labelStyle}
                />
                <FormInput
                  value={twitter}
                  placeholder={"Paste Link Here"}
                  id={"twitter"}
                  onChange={this.handleInputChange}
                  inputStyle={styles.inputStyle}
                  containerStyle={styles.inputStyle}
                  iconStyles={styles.icon}
                  icon={icons.twitter}
                  labelStyle={styles.labelStyle}
                />
              </span>
            </div>
            <div className={css(styles.buttonWrapper)}>
              <Button
                label={"Add user"}
                type={"submit"}
                customButtonStyle={styles.button}
              />
            </div>
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

const mobileOverlayStyles = {
  overlay: {
    position: "fixed",
    top: 80,
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
    "@media only screen and (max-width: 665px)": {
      width: "90%",
    },
    "@media only screen and (max-width: 436px)": {
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      transform: "unset",
    },
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#fff",
    padding: 50,
    overflow: "scroll",
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
    "@media only screen and (max-width: 415px)": {
      padding: "50px 0px 0px 0px",
    },
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
    "@media only screen and (max-width: 665px)": {
      width: 360,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    height: 22,
    width: 484,
    fontWeight: "400",
    color: "#4f4d5f",
    "@media only screen and (max-width: 665px)": {
      width: 360,
      whiteSpace: "pre-wrap",
      marginBottom: 10,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  form: {
    display: "flex",
    flexDirection: "column",
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
    "@media only screen and (max-width: 665px)": {
      width: 360,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  lastName: {
    width: "48%",
    marginTop: 0,
    marginBottom: 0,
    "@media only screen and (max-width: 665px)": {
      display: "none",
    },
  },
  mobileLastName: {
    display: "none",
    "@media only screen and (max-width: 665px)": {
      display: "unset",
      width: 360,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  emailInput: {
    marginTop: 30,
    marginBottom: 0,
    "@media only screen and (max-width: 665px)": {
      width: 360,
      margin: 0,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
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
    "@media only screen and (max-width: 665px)": {
      width: 360,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  universityContainer: {
    marginTop: 30,
    "@media only screen and (max-width: 665px)": {
      width: 360,
      marginTop: 0,
      marginBottom: 15,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  socialMediaContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "flex-end",
    textAlign: "left",
    width: 527,
    marginTop: 30,
    "@media only screen and (max-width: 665px)": {
      width: 360,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  inputStyle: {
    height: 50,
    marginBottom: 5,
    marginTop: 5,
    "@media only screen and (max-width: 665px)": {
      width: 360,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
    },
  },
  labelStyle: {
    "@media only screen and (max-width: 665px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
  },
  fb: {
    width: 10,
    height: 20,
  },
  icon: {
    width: 20,
    height: 20,
  },
  buttonWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    minHeight: 55,
    maxHeight: 55,
    "@media only screen and (max-width: 436px)": {
      marginBottom: 40,
    },
  },
  button: {
    width: 240,
    height: 55,
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
    height: 175,
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  university: state.universities,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAuthorModal);
