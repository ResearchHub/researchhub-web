import { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import FormInput from "~/components/Form/FormInput";
import Button from "~/components/Form/Button";
import { updateOrgDetails } from "~/config/fetch";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import OrgAvatar from "~/components/Org/OrgAvatar";
import OrgCoverImgModal from "~/components/Org/OrgCoverImgModal";
import { captureEvent } from "~/config/utils/events";
import { Helpers } from "@quantfive/js-web-config";

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
      const response = await updateOrgDetails({
        orgId: org.id,
        params: {
          name: orgName,
        },
      });

      if (response.ok) {
        const updatedOrg = await Helpers.parseJSON(response);
        setMessage("");
        showMessage({ show: true, error: false });

        if (typeof onOrgChange === "function") {
          onOrgChange(updatedOrg, "UPDATE");
        }
      } else {
        setMessage("Failed to update org");
        showMessage({ show: true, error: true });
        captureEvent({
          msg: "Could not update organization",
          data: { org, orgName },
        });
      }
    } catch (error) {
      setMessage("Failed to update org");
      showMessage({ show: true, error: true });
      captureEvent({
        error,
        msg: "Failed to update organization",
        data: { org, orgName },
      });
    }
  };

  const onImgSaveSuccess = (updatedOrg) => {
    if (typeof onOrgChange === "function") {
      onOrgChange(updatedOrg, "UPDATE");
    }
    setIsAvatarUploadOpen(false);
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
        {isAvatarUploadOpen && (
          <OrgCoverImgModal
            onSuccess={onImgSaveSuccess}
            orgId={org.id}
            closeModal={() => setIsAvatarUploadOpen(false)}
          />
        )}
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
