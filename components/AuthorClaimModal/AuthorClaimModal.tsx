import BaseModal from "../Modals/BaseModal";
import { css, StyleSheet } from "aphrodite";
import { createAuthorClaimCase } from "./api/authorClaimCaseCreate";
import Modal from "react-modal";
import AuthorClaimPromptEmail from "./AuthorClaimPromptEmail";
import AuthorClaimPromptSuccess from "./AuthorClaimPromptSuccess";
import React, { Fragment, ReactElement, SyntheticEvent, useState } from "react";

export type AuthorClaimDataProps = {
  auth: any;
  author: any;
  firstPrompt: "enterEmail" | "success";
  isOpen: boolean;
  setIsOpen: (flag: boolean) => void;
  user: any;
};

function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const splitted = email.split(".");
  return (
    re.test(String(email).toLowerCase()) &&
    splitted[splitted.length - 1] === ".edu"
  );
}

export default function AuthorClaimModal({
  auth,
  author,
  firstPrompt,
  isOpen,
  setIsOpen,
  user,
}: AuthorClaimDataProps): ReactElement<typeof Modal> {
  let [promptName, setPromptName] = useState<string>(firstPrompt);
  let [eduEmail, setEduEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [shouldDisplayError, setShouldDisplayError] = useState<boolean>(false);

  const onEmailChange = (fieldID: string, value: string): void => {
    setEduEmail(value);
    // TODO: briansantoso - hide or set/display form errors
  };

  const handleValidationAndSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    // TODO:  briansantoso - hide or set/display form errors
    setIsSubmitting(true);
    createAuthorClaimCase({
      eduEmail,
      onError: (): void => {
        setIsSubmitting(false);
      },
      onSuccess: (): void => {
        setIsSubmitting(false);
        setPromptName("success");
      },
      targetAuthorID: author.id,
      userID: auth.user.id,
    });
  };

  const closeModal = (e: SyntheticEvent): void => {
    e && e.preventDefault();
    setIsOpen(false);
  };

  const getPrompt = (promptName) => {
    switch (promptName) {
      case "enterEmail":
        return (
          <AuthorClaimPromptEmail
            handleValidationAndSubmit={handleValidationAndSubmit}
            isSubmitting={isSubmitting}
            onEmailChange={onEmailChange}
          />
        );
      case "success":
        return <AuthorClaimPromptSuccess handleContinue={closeModal} />;
      default:
        return null;
    }
  };

  return (
    <BaseModal
      children={
        <Fragment>
          <img
            src="/static/icons/close.png"
            className={css(customModalStyle.closeButton)}
            onClick={closeModal}
            draggable={false}
            alt="Close Button"
          />
          {getPrompt(promptName)}
        </Fragment>
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
});
