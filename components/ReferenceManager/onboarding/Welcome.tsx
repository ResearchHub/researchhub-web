import { css, StyleSheet } from "aphrodite";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

import sharedOnboardingStyles from "./sharedOnboardingStyles";
import AuthorAvatar from "~/components/AuthorAvatar";
import AvatarUpload from "~/components/AvatarUpload";
import colors from "~/config/themes/colors";
import { AuthorActions } from "~/redux/author";
import { AuthActions } from "~/redux/auth";
import FormInput from "~/components/Form/FormInput";
import FormTextArea from "~/components/Form/FormTextArea";
import { faSpinnerThird } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Welcome({ saveAuthorChanges, user, updateUser }) {
  const [avatarUploadIsOpen, setAvatarUploadIsOpen] = useState(false);
  const [loading, setLoad] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    headline: "",
    about: "",
    description: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (user.author_profile) {
      setForm({
        firstName: user.author_profile.first_name,
        lastName: user.author_profile.last_name,
        headline: user.author_profile.headline.title,
        about: user.author_profile.about,
        description: user.author_profile.description,
      });
    }
  }, [user]);

  const saveProfilePicture = async (picture) => {
    const changes = new FormData();
    let byteCharacters;

    if (picture.split(",")[0].indexOf("base64") >= 0)
      byteCharacters = atob(picture.split(",")[1]);
    else byteCharacters = unescape(picture.split(",")[1]);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpg" });

    changes.append("profile_image", blob);

    const authorReturn = await saveAuthorChanges({
      changes,
      authorId: user.author_profile.id,
      file: true,
    });

    updateUser({ ...user, author_profile: authorReturn.payload });

    setAvatarUploadIsOpen(false);
  };

  const handleFormChange = (id, value) => {
    const _form = { ...form };
    _form[id] = value;
    setForm(_form);
  };

  const fin = async (e) => {
    e.preventDefault();
    try {
      setLoad(true);
      const changes = {
        first_name: form.firstName,
        last_name: form.lastName,
        description: form.description,
        headline: {
          title: form.headline,
          isPublic: user.author_profile.headline.isPublic,
        },
      };

      const authorReturn = await saveAuthorChanges({
        changes,
        authorId: user.author_profile.id,
        file: false,
      });
      updateUser({ ...user, author_profile: authorReturn.payload });
      router.push("/reference-manager/onboarding/lab");
    } catch (e) {
      console.log(e);
    }
    setLoad(false);
  };

  return (
    <div>
      <h1 className={css(sharedOnboardingStyles.h1)}>
        Welcome to the
        <br />
        ResearchHub Reference Manager
      </h1>
      <p className={css(sharedOnboardingStyles.subtext)}>
        Personalize your profile
      </p>
      <div
        className={css(styles.addPhotoSection)}
        onClick={() => setAvatarUploadIsOpen(true)}
      >
        <AuthorAvatar
          author={user.author_profile}
          disableLink={true}
          size={100}
        />
        <p className={css(styles.addPhotoText)}>
          {user.author_profile?.profile_image
            ? "Update your photo"
            : "Add a photo"}
        </p>
      </div>
      <AvatarUpload
        isOpen={avatarUploadIsOpen}
        overlayStyleOverride={{
          width: "calc(100% - 80px)",
          marginLeft: "auto",
        }}
        closeModal={() => setAvatarUploadIsOpen(false)}
        saveButton={(_, { picture }) => {
          return (
            <button
              className={css(styles.button)}
              onClick={() => saveProfilePicture(picture)}
            >
              Save
            </button>
          );
        }}
        section={"pictures"}
      />
      <form onSubmit={fin}>
        <div className={css(styles.row)}>
          <FormInput
            label={"First Name"}
            id={"firstName"}
            required
            onChange={handleFormChange}
            containerStyle={styles.formInput}
            inputStyle={sharedOnboardingStyles.input}
            value={form.firstName}
          />
          <FormInput
            label={"Last Name"}
            id={"lastName"}
            required
            onChange={handleFormChange}
            containerStyle={styles.formInput}
            inputStyle={sharedOnboardingStyles.input}
            value={form.lastName}
          />
        </div>
        <FormInput
          label={"Headline"}
          id={"headline"}
          required
          onChange={handleFormChange}
          subtitle={
            "This information will be displayed in comments below your name"
          }
          containerStyle={styles.formInput}
          inputStyle={sharedOnboardingStyles.input}
          value={form.headline}
        />
        <FormTextArea
          label={"About"}
          id={"description"}
          containerStyle={styles.formTextAreaContainer}
          inputStyle={sharedOnboardingStyles.input}
          value={form.description}
          onChange={handleFormChange}
        />
        <button
          className={css(sharedOnboardingStyles.continueButton)}
          type="submit"
        >
          {loading ? (
            <FontAwesomeIcon icon={faSpinnerThird} spin />
          ) : (
            "Continue"
          )}
        </button>
      </form>
      {/* <div className={css(sharedOnboardingStyles.spacer)}></div> */}
    </div>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 126,
    height: 45,
    border: "1px solid",
    borderColor: colors.NEW_BLUE(),
    borderRadius: 4,
    fontSize: 15,
    outline: "none",
    cursor: "pointer",
  },
  addPhotoSection: {
    cursor: "pointer",
  },
  addPhotoText: {
    marginTop: 8,
    color: colors.NEW_BLUE(),
  },
  row: {
    display: "flex",
    gap: 16,
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
