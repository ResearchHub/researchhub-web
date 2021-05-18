import React from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Component
import BaseModal from "./BaseModal";
import Button from "~/components/Form/Button";

// Redux
import { ModalActions } from "~/redux/modals";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

class NewPostModal extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      mobileView: false,
    };

    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount = () => {
    console.log("new post modal props", this.props);
  };

  saveAndCloseModal = (e) => {
    e && e.preventDefault();
    this.props.openNewPostModal(false);
    // this.saveAuthorChanges(null, true);
  };

  render() {
    const { modals } = this.props;
    return (
      <BaseModal
        isOpen={modals.openNewPostModal}
        closeModal={this.saveAndCloseModal}
        modalStyle={styles.modalStyle}
        title={"Select your post type"}
        textAlign={"left"}
        removeDefault={true}
        modalContentStyle={styles.modalContentStyles}
      >
        <div className={css(styles.rootContainer)}>
          <img
            src={"/static/icons/close.png"}
            className={css(styles.closeButton)}
            onClick={this.saveAndCloseModal}
            draggable={false}
            alt="Close Button"
          />
          <div className={css(styles.titleContainer)}>
            <div className={css(styles.title)}>{"Select your post type"}</div>
          </div>
          <form className={css(styles.form)} onSubmit={this.saveAndCloseModal}>
            <div className={css(styles.buttonContainer)}>
              <Button
                label={"Continue"}
                customButtonStyle={styles.buttonCustomStyle}
                rippleClass={styles.rippleClass}
                type={"submit"}
              />
            </div>
          </form>
        </div>
      </BaseModal>
    );
  }
}

const styles = StyleSheet.create({
  modalStyle: {
    maxHeight: "95vh",
    overflowY: "scroll",
    width: 600,
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 5,
    transition: "all ease-in-out 0.4s",
    boxSizing: "border-box",
    width: "100%",
    "@media only screen and (min-width: 768px)": {
      overflowY: "auto",
    },
    "@media only screen and (max-width: 767px)": {
      padding: 16,
    },
  },
  form: {
    width: "100%",
    position: "relative",
  },
  avatarContainer: {
    width: 120,
    height: 120,
    cursor: "pointer",
    position: "relative",
    borderRadius: "50%",
    marginTop: 5,
  },
  border: {
    border: "2px solid #F1F1F1",
  },
  profilePictureHover: {
    width: 120,
    height: 60,
    borderRadius: "0 0 100px 100px",
    display: "flex",
    justifyContent: "center",
    paddingTop: 5,
    boxSizing: "border-box",
    position: "absolute",
    background: "rgba(0, 0, 0, .3)",
    color: "#fff",
    bottom: 0,
  },
  titleHeader: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingTop: 30,
    paddingBottom: 10,
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginLeft: 30,
    "@media only screen and (max-width: 767px)": {
      marginLeft: 0,
    },
  },
  formInputContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 15,
  },
  formInput: {
    padding: 0,
    margin: 0,

    width: "100%",
  },

  formTextAreaContainer: {
    marginTop: 10,
  },
  formTextArea: {
    minHeight: 100,
  },
  marginBottom: {
    marginBottom: 24,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    background: "#FFF",
    zIndex: 2,
  },
  buttonCustomStyle: {
    padding: 16,
    width: "100%",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
    },
  },
  rippleClass: {
    width: "100%",
  },
  button: {
    width: 126,
    height: 45,
    border: "1px solid",
    borderColor: colors.BLUE(),
    borderRadius: 4,
    fontSize: 15,
    outline: "none",
    cursor: "pointer",
  },
  infoIcon: {
    cursor: "pointer",
    marginLeft: 5,
  },
  addmoreButton: {
    fontSize: 14,
    color: colors.BLUE(),
    marginTop: 5,
    marginBottom: 10,
    width: "max-content",
    cursor: "pointer",
    float: "right",
    ":hover": {
      textDecoration: "underline",
    },
  },
  universityContainer: {
    padding: 0,
    margin: 0,
    marginBottom: 10,
    width: "100%",
  },
  isPublicContainer: {
    position: "absolute",
    right: 0,
    // top: 0,
    bottom: -40,
    display: "flex",
    alignItems: "center",
  },
  isPublicLabel: {
    color: colors.BLACK(0.5),
    fontSize: 14,
    marginRight: 8,
    fontWeight: 400,
  },
  activeLabel: {
    color: colors.BLUE(),
  },
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 6,
    right: 0,
    padding: 16,
    cursor: "pointer",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    boxSizing: "border-box",
  },
  left: {
    textAlign: "left",
    alignItems: "left",
    width: "100%",
  },
  title: {
    fontWeight: "500",
    height: 30,
    width: "100%",
    fontSize: 26,
    color: "#232038",
    "@media only screen and (max-width: 557px)": {
      fontSize: 24,
    },
    "@media only screen and (max-width: 725px)": {
      width: 450,
    },
    "@media only screen and (max-width: 557px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 300,
      fontSize: 22,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  modalContentStyles: {
    padding: 25,
    overflowX: "hidden",
    "@media only screen and (max-width: 415px)": {
      padding: 25,
    },
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = {
  openNewPostModal: ModalActions.openNewPostModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewPostModal);
