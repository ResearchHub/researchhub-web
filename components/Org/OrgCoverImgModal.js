import { useState } from "react";
import AvatarUpload from "~/components/AvatarUpload";
import { captureError } from "~/config/utils/error";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import Button from "~/components/Form/Button";
import { updateOrgProfileImg } from "~/config/fetch";

const OrgCoverImgModal = ({
  orgId,
  onSuccess,
  setMessage,
  showMessage,
  closeModal,
}) => {
  const saveCoverImage = async (picture) => {
    let formData = new FormData();
    let byteCharacters;

    if (picture.split(",")[0].indexOf("base64") >= 0) {
      byteCharacters = atob(picture.split(",")[1]);
    } else {
      byteCharacters = unescape(picture.split(",")[1]);
    }

    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    let byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpg" });

    formData.append("cover_image", blob);
    try {
      const updatedOrg = await updateOrgProfileImg({
        orgId,
        file: formData,
      });

      if (typeof onSuccess === "function") {
        onSuccess(updatedOrg);
      }

      setMessage("");
      showMessage({ show: true, error: false });
    } catch (error) {
      setMessage("Failed to set image");
      showMessage({ show: true, error: true });
      captureError({
        error,
        msg: "Failed to set org image",
        data: { picture, orgId },
      });
    }
  };

  const renderSaveButton = (section, { picture }) => {
    return (
      <Button
        onClick={() => saveCoverImage(picture)}
        label={"Save"}
        isWhite={true}
      ></Button>
    );
  };

  return (
    <AvatarUpload
      isOpen={true}
      closeModal={closeModal}
      saveButton={renderSaveButton}
      section={"pictures"}
    />
  );
};

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(null, mapDispatchToProps)(OrgCoverImgModal);
