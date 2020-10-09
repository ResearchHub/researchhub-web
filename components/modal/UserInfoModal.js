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
import EducationModal from "./EducationModal";
import EducationSummaryCard from "~/components/Form/EducationSummaryCard";
import Toggle from "react-toggle";
import "~/components/TextEditor/stylesheets/ReactToggle.css";

// Redux
import { AuthActions } from "~/redux/auth";
import { AuthorActions } from "~/redux/author";
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

class UserInfoModal extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = this.mapStateFromProps();
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
      mainIndex: 0,
    };
  }

  componentDidMount = async () => {
    if (this.props.auth.isLoggedIn) {
      if (!this.props.author) {
        await this.props.getAuthor({
          authorId: this.props.user.author_profile.id,
        });
        this.props.author && this.setState({ ...this.mapStateFromProps() });
      } else {
        this.setState({ ...this.mapStateFromProps() });
      }
    }
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps.author.id !== this.props.author.id) {
      this.setState({ ...this.mapStateFromProps() });
    }
    if (
      !prevProps.modals.openUserInfoModal &&
      this.props.modals.openUserInfoModal
    ) {
      this.props.author
        ? this.setState({ ...this.mapStateFromProps() })
        : this.props.getAuthor({ authorId: this.props.user.author_profile.id });
    }
  };

  closeModal = () => {
    this.props.openUserInfoModal(false);
    document.body.style.overflow = "scroll";
  };

  saveAndCloseModal = () => {
    this.props.openUserInfoModal(false);
    this.saveAuthorChanges(null, true);
  };

  mapStateFromProps = () => {
    return {
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
          : { title: "", isPublic: true },
    };
  };

  onMouseEnterAvatar = () => {
    !this.state.hoverAvatar && this.setState({ hoverAvatar: true });
  };

  onMouseLeaveAvatar = () => {
    this.state.hoverAvatar && this.setState({ hoverAvatar: false });
  };

  openEducationModal = (activeIndex) => {
    this.setState({ activeIndex });
    this.props.openEducationModal(true);
  };

  onEducationModalSave = (educationSummary) => {
    let education = [...this.state.education];
    education[this.state.activeIndex] = {
      ...educationSummary,
    };
    this.setState({ education });
    this.saveAuthorEducationChanges(education);
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

  handleFormChange = (id, value) => {
    this.setState({ [id]: value });
  };

  handleHeadlineChange = (id, value) => {
    let headline = { ...this.state.headline };
    headline.title = value;
    this.setState({ headline });
  };

  handleIsPublic = (e) => {
    e && e.stopPropagation();
    let headline = { ...this.state.headline };
    headline.isPublic = e.target.checked;
    this.setState({ headline });
  };

  setEducationActive = (index) => {
    let education = this.state.education.map((school, i) => {
      if (index !== i) {
        school.is_public = false;
      } else {
        school.is_public = true;
      }
      return school;
    });
    this.setState({ education });
  };

  toggleAvatarModal = (state) => {
    this.setState({ avatarUploadIsOpen: state });
  };

  saveAuthorChanges = (e, silent = false) => {
    const { setMessage, showMessage } = this.props;
    e && e.preventDefault();
    !silent && showMessage({ show: true, load: true });

    const education = this.state.education.filter((el) => el.summary);

    const params = {
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
        if (!silent) {
          showMessage({ show: false });
          setMessage("Updates made successfully");
          showMessage({ show: true });
        }
        const { updateUser, updateAuthor, user } = this.props;
        const updatedAuthorProfile = { ...res };

        updateUser({ ...user, author_profile: updatedAuthorProfile });
        updateAuthor(updatedAuthorProfile);
        !silent && this.closeModal();
      });
  };

  saveAuthorEducationChanges = (education) => {
    fetch(
      API.AUTHOR({ authorId: this.props.author.id }),
      API.PATCH_CONFIG({ education })
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        const { updateUser, updateAuthor, user } = this.props;
        const updatedAuthorProfile = { ...res };
        updateUser({ ...user, author_profile: updatedAuthorProfile });
        updateAuthor(updatedAuthorProfile);
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

    let activeIndex = null;

    return (
      <div
        className={css(styles.formInputContainer, styles.educationContainer)}
        onMouseEnter={this.onMouseEnterEducation}
      >
        {this.state.education &&
          this.state.education.length &&
          this.state.education.map((education, index) => {
            if (education.is_public && activeIndex === null) {
              activeIndex = index;
            }

            return (
              <EducationSummaryCard
                key={`eduSummaryCard-${education.id}`}
                index={index}
                label={index === 0 && "Education"}
                activeIndex={true}
                value={education}
                onClick={() => this.openEducationModal(index)}
                onRemove={() => this.removeEducation(index)}
                onActive={this.setEducationActive}
              />
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

  renderFormInput = ({ id, label, subtitle, required, value }) => {
    let classNames = [styles.formInputContainer];

    if (label === "Headline") {
      classNames.push(styles.marginBottom);
    }

    if (label === "About") {
      return (
        <FormTextArea
          label={label}
          id={id}
          containerStyle={styles.formTextAreaContainer}
          inputStyle={styles.formTextArea}
          value={value}
          onChange={this.handleFormChange}
        />
      );
    }

    return (
      <div className={css(classNames)}>
        <FormInput
          label={label}
          subtitle={subtitle}
          id={id}
          required={required}
          onChange={
            label === "Headline"
              ? this.handleHeadlineChange
              : this.handleFormChange
          }
          containerStyle={styles.formInput}
          value={label === "Headline" ? value.title : value}
        />
        {/* {label === "Headline" && (
          <div className={css(styles.isPublicContainer)}>
            <h3
              className={css(
                styles.isPublicLabel,
                value.isPublic && styles.activeLabel
              )}
            >
              {value.isPublic ? "Public" : "Private"}
            </h3>
            <Toggle
              className={"react-toggle"}
              height={15}
              value={value.isPublic}
              checked={value.isPublic}
              onChange={this.handleIsPublic}
            />
          </div>
        )} */}
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
        closeModal={this.saveAndCloseModal}
        modalStyle={styles.modalStyle}
        title={"Edit your personal information"}
        textAlign={"left"}
        removeDefault={true}
      >
        <div className={css(styles.rootContainer)}>
          <EducationModal
            education={this.state.education[this.state.activeIndex]}
            currentIndex={this.state.activeIndex}
            onSave={this.onEducationModalSave}
            onActive={this.setEducationActive}
          />
          <img
            src={"/static/icons/close.png"}
            className={css(styles.closeButton)}
            onClick={this.closeModal}
            draggable={false}
          />
          <div className={css(styles.titleContainer, styles.left)}>
            <div className={css(styles.title)}>
              {"Edit your personal information"}
            </div>
          </div>
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
                  id: "first_name",
                  required: true,
                  value: this.state.first_name,
                })}
                {this.renderFormInput({
                  label: "Last Name",
                  id: "last_name",
                  required: true,
                  value: this.state.last_name,
                })}
              </div>
            </div>
            {this.renderFormInput({
              label: "Headline",
              id: "headline",
              subtitle:
                "This information will be displayed in comments below your name",
              value: this.state.headline,
            })}
            {this.renderEducationList()}
            {this.renderFormInput({
              label: "About",
              id: "description",
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
  },
  column: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginLeft: 30,
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
  updateAuthor: AuthorActions.updateAuthor,
  updateUser: AuthActions.updateUser,
  openUserInfoModal: ModalActions.openUserInfoModal,
  openEducationModal: ModalActions.openEducationModal,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfoModal);
