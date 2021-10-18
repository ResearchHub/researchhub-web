import { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import FormInput from "~/components/Form/FormInput";
import Button from "~/components/Form/Button";
import { updateOrgDetails, updateOrgProfileImg } from "~/config/fetch";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import AvatarUpload from "~/components/AvatarUpload";
import OrgAvatar from "~/components/Org/OrgAvatar";

const ManageOrgDetails = ({ org, setMessage, showMessage, onOrgChange }) => {
  const [orgName, setOrgName] = useState(org.name);
  const [isAvatarUploadOpen, setIsAvatarUploadOpen] = useState(false);

  useEffect(() => {
    if (org.name !== orgName) {
      setOrgName(org.name);
    }
  }, [org]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedOrg = await updateOrgDetails({
        orgId: org.id,
        params: {
          name: orgName,
        },
      });

      setMessage("");
      showMessage({ show: true, error: false });

      if (typeof onOrgChange === "function") {
        onOrgChange(updatedOrg, "UPDATE");
      }
    } catch (err) {
      setMessage("Failed to update org.");
      showMessage({ show: true, error: true });
    }
  };

  const saveProfilePicture = async (picture) => {
    let formData = new FormData();
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

    formData.append("cover_image", blob);
    try {
      const updatedOrg = await updateOrgProfileImg({
        orgId: org.id,
        file: formData,
      });

      if (typeof onOrgChange === "function") {
        onOrgChange(updatedOrg, "UPDATE");
      }

      setMessage("");
      showMessage({ show: true, error: false });
      setIsAvatarUploadOpen(false);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update image");
      showMessage({ show: true, error: true });
    }
  };

  const renderSaveButton = (section, { picture }) => {
    return (
      <Button
        onClick={() => saveProfilePicture(picture)}
        label={"Save"}
        isWhite={true}
      ></Button>
    );
  };

  return (
    <div className={css(styles.container)}>
      <form
        className={css(styles.detailsForm)}
        onSubmit={(e) => handleSubmit(e)}
      >
        <FormInput
          label="Organization Name:"
          id="org-name-input"
          required={true}
          onChange={(id, val) => setOrgName(val)}
          containerStyle={styles.inputContainer}
          value={orgName}
          inputStyle={styles.inputStyle}
        />
        <Button
          type="submit"
          customButtonStyle={styles.button}
          label="Update Organization"
          rippleClass={styles.buttonWrapper}
          size={"small"}
        ></Button>
      </form>
      <form className={css(styles.avatarForm)}>
        <div
          className={css(hoverStyles.avatarWrapper)}
          onClick={() => setIsAvatarUploadOpen(true)}
        >
          <OrgAvatar org={org} size={110} fontSize={28} />
          <div className={css(styles.avatarOverlay)}>Change</div>
        </div>
        <AvatarUpload
          isOpen={isAvatarUploadOpen}
          closeModal={() => setIsAvatarUploadOpen(false)}
          saveButton={renderSaveButton}
          section={"pictures"}
        />
      </form>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
  },
  avatarOverlay: {
    display: "none",
    position: "absolute",
    width: "100%",
    height: "50%",
    borderRadius: "0 0 100px 100px",
    justifyContent: "center",
    paddingTop: 10,
    boxSizing: "border-box",
    position: "absolute",
    background: "rgba(0, 0, 0, .3)",
    color: "white",
    bottom: 0,
  },
  avatarForm: {
    marginLeft: 40,
    marginTop: 20,
  },
  detailsForm: {
    width: "100%",
  },
  button: {
    width: "auto",
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputContainer: {
    width: "100%",
  },
  buttonWrapper: {
    display: "flex",
  },
  inputStyle: {
    textAlign: "left",
  },
});

const hoverStyles = StyleSheet.create({
  avatarWrapper: {
    position: "relative",
    cursor: "pointer",
    [":hover ." + (process.browser ? css(styles.avatarOverlay) : "")]: {
      display: "flex",
    },
  },
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(null, mapDispatchToProps)(ManageOrgDetails);
