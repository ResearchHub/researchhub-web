import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";

// Component
import AuthorAvatar from "~/components/AuthorAvatar";
import BaseModal from "./BaseModal";
import FormInput from "~/components/Form/FormInput";
import AvatarUpload from "~/components/AvatarUpload";
import FormTextArea from "~/components/Form/FormTextArea";
import Button from "~/components/Form/Button";
import UniversityInput from "../SearchSuggestion/UniversityInput";
import EducationModal from "./EducationModal";

// Redux
import { AuthActions } from "~/redux/auth";
import { AuthorActions } from "~/redux/author";
import { ModalActions } from "~/redux/modals";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

class UserInfoModal extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      first_name:
        this.props.author && this.props.author.first_name
          ? this.props.author.first_name
          : "",
      last_name:
        this.props.author && this.props.author.last_name
          ? this.props.author.last_name
          : "",
      description:
        this.props.author && this.props.author.description
          ? this.props.author.description
          : "",
      facebook:
        this.props.author && this.props.author.facebook
          ? this.props.author.facebook
          : "",
      linkedin:
        this.props.author && this.props.author.linkedin
          ? this.props.author.linkedin
          : "",
      twitter:
        this.props.author && this.props.author.twitter
          ? this.props.author.twitter
          : "",
      education:
        this.props.author && this.props.author.education
          ? this.props.author.education
          : [],
      headline:
        this.props.author && this.props.author.headline
          ? this.props.author.headline
          : "",
    };
    this.state = {
      ...this.initialState,
      hoverAvatar: false,
      hoverEducation: false,
      allowEdit: true,
      avatarUploadIsOpen: false,
      activeIndex:
        this.props.author &&
        this.props.author.education &&
        this.props.author.education.length - 1,
    };
  }

  componentDidMount = async () => {
    if (this.props.auth.isLoggedIn) {
      console.log("MOUNT this.props.author", this.props.author);

      if (!this.props.author) {
        this.props.getAuthor({ authorId: this.props.user.author_profile.id });
        this.props.author && this.setState({ ...this.initialState });
      } else {
        this.setState({ ...this.initialState });
      }
    }
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps.author.id !== this.props.author.id) {
      this.setState({
        first_name:
          this.props.author && this.props.author.first_name
            ? this.props.author.first_name
            : "",
        last_name:
          this.props.author && this.props.author.last_name
            ? this.props.author.last_name
            : "",
        description:
          this.props.author && this.props.author.description
            ? this.props.author.description
            : "",
        facebook:
          this.props.author && this.props.author.facebook
            ? this.props.author.facebook
            : "",
        linkedin:
          this.props.author && this.props.author.linkedin
            ? this.props.author.linkedin
            : "",
        twitter:
          this.props.author && this.props.author.twitter
            ? this.props.author.twitter
            : "",
        education:
          this.props.author && this.props.author.education
            ? this.props.author.education
            : [],
        headline:
          this.props.author && this.props.author.headline
            ? this.props.author.headline
            : "",
      });
    }
    if (
      !prevProps.modals.openUserInfoModal &&
      this.props.modals.openUserInfoModal
    ) {
      console.log("MODAL this.props.author", this.props.author);
      this.props.author
        ? this.setState({ ...this.initialState })
        : this.props.getAuthor({ authorId: this.props.user.author_profile.id });
    }
  };

  closeModal = () => {
    this.props.openUserInfoModal(false);
  };

  onMouseEnterAvatar = () => {
    !this.state.hoverAvatar && this.setState({ hoverAvatar: true });
  };

  onMouseLeaveAvatar = () => {
    this.state.hoverAvatar && this.setState({ hoverAvatar: false });
  };

  onMouseEnterEducation = () => {
    !this.state.hoverEducation && this.setState({ hoverEducation: true });
  };

  onMouseLeaveEducation = () => {
    this.state.hoverEducation && this.setState({ hoverEducation: false });
  };

  openEducationModal = (activeIndex) => {
    this.setState({ activeIndex });
    this.props.openEducationModal(true);
  };

  addEducation = (activeIndex) => {
    let education = [...this.state.education];
    education.push({});
    this.setState({ education });
    this.openEducationModal(activeIndex);
  };

  removeEducation = (index) => {
    let education = [...this.state.education];
    education.splice(index, 1);
    this.setState({ education });
  };

  handleEducationInput = (value, index) => {
    let education = [...this.state.education];
    education[index] = value;
    this.setState({ education });
  };

  onEducationModalSave = (educationSummary) => {
    const { school, degree, year } = educationSummary;
    //TODO: create summary string here.

    let education = [...this.state.education];
    education[this.state.activeIndex] = { ...school, degree, is_public: false };
    this.setState({ education });
  };

  handleFormChange = (id, value) => {
    this.setState({ [id]: value });
  };

  toggleAvatarModal = (state) => {
    this.setState({ avatarUploadIsOpen: state });
  };

  saveAuthorChanges = (e) => {
    e.preventDefault();

    let education = this.state.education.map((education) => {
      education.degree = education.degree.value;
      return education;
    });

    let params = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      description: this.state.description,
      education,
      headline: this.state.headline,
    };

    fetch(
      API.AUTHOR({ authorId: this.props.author.id }),
      API.PATCH_CONFIG(params)
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let { updateUser, user } = this.props;
        updateUser({ ...user, author_profile: res });
      });
  };

  saveProfilePicture = async (picture) => {
    let changes = new FormData();
    let byteCharacters;

    if (picture.split(",")[0].indexOf("base64") >= 0)
      byteCharacters = atob(picture.split(",")[1]);
    else byteCharacters = unescape(picture.split(",")[1]);

    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpg" });

    changes.append("profile_image", blob);

    let authorReturn = await this.props.saveAuthorChanges({
      changes,
      authorId: this.props.author.id,
      file: true,
    });

    let { updateUser, user } = this.props;
    updateUser({ ...user, author_profile: authorReturn.payload });

    this.toggleAvatarModal(false);
  };

  renderEducationList = () => {
    if (!this.state.education.length) {
      let education = [...this.state.education];
      education.push({});
      this.setState({ education });
    }
    return (
      <div
        className={css(styles.formInputContainer, styles.educationContainer)}
        onMouseEnter={this.onMouseEnterEducation}
      >
        {this.state.education.map((education, index) => {
          return (
            <div className={css(styles.educationRow)}>
              <FormInput
                label={index === 0 && "Education"}
                containerStyle={styles.formEducationInput}
                value={education.name}
                onClick={() => this.openEducationModal(index)}
              />
              {
                <div
                  className={css(
                    styles.trashIcon,
                    index === 0 && styles.indexZero
                  )}
                  onClick={() => this.removeEducation(index)}
                  onMouseEnter={this.onMouseEnterEducation}
                >
                  {icons.trash}
                </div>
              }
            </div>
          );
        })}
        <div
          className={css(styles.addmoreButton)}
          onClick={() => this.addEducation(this.state.education.length)}
        >
          Add more
        </div>
      </div>
    );
  };

  renderFormInput = ({ label, subtitle, required, value }) => {
    let classNames = [styles.formInputContainer];
    let id =
      typeof label === "string" &&
      label
        .split(" ")
        .join("_")
        .toLowerCase();

    if (label === "About") {
      return (
        <FormTextArea
          label={label}
          id={id}
          containerStyle={styles.formTextAreaContainer}
          inputStyle={styles.formTextArea}
          value={value}
        />
      );
    }

    return (
      <div className={css(classNames)}>
        <FormInput
          label={label}
          subtitle={subtitle}
          id={id ? id : "tagline"}
          required={required}
          onChange={this.handleFormChange}
          containerStyle={styles.formInput}
          value={value}
        />
      </div>
    );
  };

  renderSaveButton = (section, { picture }) => {
    return (
      <button
        className={css(styles.button, styles.saveButton)}
        onClick={() => this.saveProfilePicture(picture)}
      >
        Save
      </button>
    );
  };

  render() {
    const { hoverAvatar, allowEdit, avatarUploadIsOpen } = this.state;
    const { author, modals } = this.props;
    if (!this.props.auth.isLoggedIn) return null;
    return (
      <BaseModal
        isOpen={modals.openUserInfoModal}
        closeModal={this.closeModal}
        modalStyle={styles.modalStyle}
        title={"Edit your personal information"}
        textAlign={"left"}
      >
        <EducationModal
          education={this.state.education[this.state.activeIndex]}
          onSave={this.onEducationModalSave}
        />
        <form className={css(styles.form)} onSubmit={this.saveAuthorChanges}>
          <div className={css(styles.titleHeader)}>
            <div
              className={css(
                styles.avatarContainer,
                author.profile_image && styles.border
              )}
              onClick={() => this.toggleAvatarModal(true)}
              onMouseEnter={this.onMouseEnterAvatar}
              onMouseLeave={this.onMouseLeaveAvatar}
              draggable={false}
            >
              <AuthorAvatar author={author} disableLink={true} size={120} />
              {allowEdit && hoverAvatar && (
                <div className={css(styles.profilePictureHover)}>Update</div>
              )}
            </div>
            <div className={css(styles.column)}>
              {this.renderFormInput({
                label: "First Name",
                required: true,
                value: this.state.first_name,
              })}
              {this.renderFormInput({
                label: "Last Name",
                required: true,
                value: this.state.last_name,
              })}
            </div>
          </div>
          {this.renderFormInput({
            label: "Headline",
            subtitle:
              "This information will be displayed in comments below your name",
            value: this.state.headline,
          })}
          {this.renderEducationList()}
          {this.renderFormInput({
            label: "About",
            value: this.state.description,
          })}
          <AvatarUpload
            isOpen={avatarUploadIsOpen}
            closeModal={() => this.toggleAvatarModal(false)}
            saveButton={this.renderSaveButton}
            section={"pictures"}
          />
          <div className={css(styles.buttonContainer)}>
            <Button
              label={"Save Changes"}
              customButtonStyle={styles.buttonCustomStyle}
              type={"submit"}
            />
          </div>
        </form>
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
      width: 550,
    },
    "@media only screen and (max-width: 415px)": {
      width: 350,
    },
  },
  form: {
    width: "100%",
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
  },
  column: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginLeft: 30,
  },
  formInputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  formInput: {
    padding: 0,
    margin: 0,

    width: "100%",
  },
  formEducationInput: {
    padding: 0,
    margin: 0,
    marginBottom: 10,
    width: "100%",
    minHeight: "unset",
  },
  formTextAreaContainer: {
    marginTop: 10,
  },
  formTextArea: {
    minHeight: 100,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
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
  trashIcon: {
    position: "absolute",
    cursor: "pointer",
    color: colors.BLACK(0.3),
    top: 15,
    right: -20,
    ":hover": {
      color: colors.BLACK(0.7),
    },
  },
  indexZero: {
    top: 45,
  },
  educationRow: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },

  universityContainer: {
    padding: 0,
    margin: 0,
    marginBottom: 10,
    width: "100%",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  author: state.author,
  user: state.auth.user,
  modals: state.modals,
});

const mapDispatchToProps = {
  getAuthor: AuthorActions.getAuthor,
  saveAuthorChanges: AuthorActions.saveAuthorChanges,
  updateUser: AuthActions.updateUser,
  openUserInfoModal: ModalActions.openUserInfoModal,
  openEducationModal: ModalActions.openEducationModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfoModal);
