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
import { useOrgs } from "~/components/contexts/OrganizationContext";

type OrganizationProps = {
  setCreatedOrg: ({}) => void;
  setMessage: (string: string) => void;
  showMessage: ({ show, error }) => void;
};

function Organization({
  showMessage,
  setMessage,
  setCreatedOrg,
}: OrganizationProps) {
  const [avatarUploadIsOpen, setAvatarUploadIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [org, setOrg] = useState({
    id: null,
    name: "researchhub",
    cover_image: "",
  });
  const [orgPhoto, setOrgPhoto] = useState<FormData | null>(null);
  const router = useRouter();

  const { fetchAndSetUserOrgs } = useOrgs();

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

  const fin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let respJson;
      if (!org.id) {
        const response = await createOrg({
          name: org.name,
        });

        respJson = await response.json();
        setOrg({ ...org, ...respJson, cover_image: org.cover_image });
      }

      const updatedOrg = await updateOrgProfileImg({
        orgId: respJson?.id || org.id,
        file: orgPhoto,
      });

      setCreatedOrg(updatedOrg);
      fetchAndSetUserOrgs && fetchAndSetUserOrgs();

      if (updatedOrg.id) {
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
        Invite your lab, or other collaborators to an organization
        <br />
        You can also skip this step to continue with your personal Reference
        Manager
      </p>
      <div
        className={css(styles.addPhotoSection)}
        onClick={() => setAvatarUploadIsOpen(true)}
      >
        <OrgAvatar org={org} size={100} fontSize={50} />
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
      <form onSubmit={fin}>
        <FormInput
          inputStyle={sharedOnboardingStyles.input}
          onChange={organizationNameChange}
          placeholder={"Organization Name"}
          required={true}
        />
        {/* <div className={css(sharedOnboardingStyles.spacer)}></div> */}
        <button
          className={css(sharedOnboardingStyles.continueButton)}
          type={"submit"}
        >
          {loading ? (
            <FontAwesomeIcon icon={faSpinnerThird} spin />
          ) : (
            "Continue"
          )}
        </button>
      </form>
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
