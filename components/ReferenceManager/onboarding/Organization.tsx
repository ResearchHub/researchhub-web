import { css, StyleSheet } from "aphrodite";
import { useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

import sharedOnboardingStyles from "./sharedOnboardingStyles";
import AvatarUpload from "~/components/AvatarUpload";
import colors from "~/config/themes/colors";
import FormInput from "~/components/Form/FormInput";
import OrgAvatar from "~/components/Org/OrgAvatar";
import { createOrg, updateOrgProfileImg } from "~/config/fetch";
import { MessageActions } from "~/redux/message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-duotone-svg-icons";

function Organization({ showMessage, setMessage }) {
  const [avatarUploadIsOpen, setAvatarUploadIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [org, setOrg] = useState({
    name: "researchhub",
    cover_image: "",
  });
  const [orgPhoto, setOrgPhoto] = useState<FormData | null>(null);
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

    setOrg({ ...org, cover_image: picture });

    changes.append("cover_image", blob);

    setOrgPhoto(changes);

    setAvatarUploadIsOpen(false);
  };

  const organizationNameChange = (id, value) => {
    setOrg({ ...org, name: value });
  };

  const createOrgFin = async () => {
    try {
      setLoading(true);
      const response = await createOrg({
        name: org.name,
      });

      const respJson = await response.json();

      const updatedOrg = await updateOrgProfileImg({
        orgId: respJson.id,
        file: orgPhoto,
      });

      if (response.status >= 200 && response.status < 300) {
        router.push("/reference-manager/onboarding/teammates");
      }
    } catch (e) {
      setMessage("Something went wrong creating an org!");
      showMessage({ show: true, error: true });
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className={css(sharedOnboardingStyles.h1)}>Create an Organization</h1>
      <p className={css(sharedOnboardingStyles.subtext)}>
        Add details for your teammates
      </p>
      <div
        className={css(styles.addPhotoSection)}
        onClick={() => setAvatarUploadIsOpen(true)}
      >
        <OrgAvatar org={org} size={100} />
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
      <FormInput
        inputStyle={sharedOnboardingStyles.input}
        onChange={organizationNameChange}
        placeholder={"Organization Name"}
      />
      {/* <div className={css(sharedOnboardingStyles.spacer)}></div> */}
      <button
        className={css(sharedOnboardingStyles.continueButton)}
        onClick={createOrgFin}
      >
        {loading ? <FontAwesomeIcon icon={faSpinnerThird} spin /> : "Continue"}
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
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotoText: {
    marginTop: 8,
    color: colors.NEW_BLUE(),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Organization);
