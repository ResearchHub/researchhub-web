import AuthorClaimPromptEmail from "./AuthorClaimPromptEmail";
import AuthorClaimPromptSuccess from "./AuthorClaimPromptSuccess";
import Modal from "react-modal";
import React, { Fragment, ReactElement, SyntheticEvent, useState } from "react";
import { css, StyleSheet } from "aphrodite";

// Dynamic modules
import dynamic from "next/dynamic";
const BaseModal = dynamic(() => import("../Modals/BaseModal"));

export type AuthorClaimDataProps = {
  auth: any;
  author: any;
  isOpen: boolean;
  setIsOpen: (flag: boolean) => void;
};

export default function AuthorClaimModal({
  auth,
  author,
  isOpen,
  setIsOpen,
}: AuthorClaimDataProps): ReactElement<typeof Modal> {
  const [openModalType, setOpenModalType] = useState<string>("enterEmail");

  const closeModal = (e: SyntheticEvent): void => {
    e && e.preventDefault();
    setOpenModalType("enterEmail");
    setIsOpen(false);
  };

  const getPrompt = (promptName) => {
    switch (promptName) {
      case "enterEmail":
        return (
          <AuthorClaimPromptEmail
            onSuccess={() => setOpenModalType("success")}
            targetAuthorID={author.id}
            userID={auth.user.id}
          />
        );
      case "success":
        return <AuthorClaimPromptSuccess handleContinue={closeModal} />;
      default:
        return null;
    }
  };

  const modalBody = getPrompt(openModalType);
  return (
    <BaseModal
      children={
        <div className={css(customModalStyle.bodyZIndex)}>
          <img
            alt="Close Button"
            className={css(customModalStyle.closeButton)}
            draggable={false}
            onClick={closeModal}
            src="/static/icons/close.png"
          />
          {modalBody}
        </div>
      }
      closeModal={closeModal}
      isOpen={isOpen}
      modalStyle={customModalStyle.modalStyle}
      removeDefault={true}
    />
  );
}

const customModalStyle = StyleSheet.create({
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 6,
    right: 0,
    padding: 16,
    cursor: "pointer",
  },
  modalStyle: {
    maxHeight: "95vh",
    width: "625px",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  bodyZIndex: {
    zIndex: 15 /* default overlay index is 11 */,
  },
});
