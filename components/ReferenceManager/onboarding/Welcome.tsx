import { css, StyleSheet } from "aphrodite";
import { useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

import sharedOnboardingStyles from "./sharedOnboardingStyles";
import AuthorAvatar from "~/components/AuthorAvatar";
import AvatarUpload from "~/components/AvatarUpload";
import colors from "~/config/themes/colors";
import { AuthorActions } from "~/redux/author";
import { AuthActions } from "~/redux/auth";

function Welcome({ author, saveAuthorChanges, user, updateUser }) {
  const [avatarUploadIsOpen, setAvatarUploadIsOpen] = useState(false);
  const router = useRouter();

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

  return (
    <div>
      <h1 className={css(sharedOnboardingStyles.h1)}>
        Welcome to the
        <br />
        ResearchHub Citation Manager
      </h1>
      <p className={css(sharedOnboardingStyles.subtext)}>
        Personalize your profile
      </p>
      <div
        className={css(styles.addPhotoSection)}
        onClick={() => setAvatarUploadIsOpen(true)}
      >
        <AuthorAvatar author={author} disableLink={true} size={100} />
        <p className={css(styles.addPhotoText)}>Add a photo</p>
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
      <div className={css(sharedOnboardingStyles.spacer)}></div>
      <button
        className={css(sharedOnboardingStyles.continueButton)}
        onClick={() => router.push("/reference-manager/onboarding/lab")}
      >
        Continue
      </button>
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
