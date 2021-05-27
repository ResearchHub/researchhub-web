import BaseModal from "../Modals/BaseModal";
import prompts from "./AuthorClaimModalPrompts";
import Modal from "react-modal";
import React, { Fragment, ReactElement, SyntheticEvent, useState } from "react";
import { createAuthorClaimCase } from "./api/authorClaimCaseCreate";
import { css, StyleSheet } from "aphrodite";

export type AuthorClaimDataProps = {
  auth?: any;
  author?: any;
  firstPrompt: "enterEmail" | "success" | "rejectUser" | "acceptUser"; // TODO: temporary. move rejectUser + acceptUser into separate modal
  isOpen: boolean;
  setIsOpen: (flag: boolean) => void;
  user?: any;
  // For accept/reject claim case
  requestorName?: string;
  profileImg?: string;
  handleAcceptReject?: Function;
};

type FormFields = {
  eduEmail: null | string;
};

type FormError = {
  eduEmail: boolean;
};

function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const splitted = email.split(".");
  return (
    re.test(String(email).toLowerCase()) &&
    splitted[splitted.length - 1] === ".edu"
  );
}

function validateFormField(fieldID: string, value: any): boolean {
  let result: boolean = true;
  switch (fieldID) {
    case "eduEmail":
      return typeof value === "string" && validateEmail(value);
    default:
      return result;
  }
}

export default function AuthorClaimModal({
  auth,
  author,
  firstPrompt,
  isOpen,
  setIsOpen,
  user,
  // For accept/reject claim
  requestorName,
  profileImg,
  handleAcceptReject,
}: AuthorClaimDataProps): ReactElement<typeof Modal> {
  let [promptName, setPromptName] = useState<string>(firstPrompt);
  let [eduEmail, setEduEmail] = useState<string>("");
  let [isSpammer, setIsSpammer] = useState<boolean>(false); // For reject claim case modal
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // TODO: display loader animation
  const [shouldDisplayError, setShouldDisplayError] = useState<boolean>(false);

  const onEmailChange = (fieldID: string, value: string): void => {
    setEduEmail(value);
    // TODO: hide or set/display form errors
  };

  const handleValidationAndSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    // TODO: hide or set/display form errors
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

  const handleCheckboxSelect = (id, value) => {
    setIsSpammer(value);
  };

  const handleAcceptRejectClick = (e: SyntheticEvent) => {
    handleAcceptReject && handleAcceptReject(e);
    closeModal(e);
  };

  const closeModal = (e: SyntheticEvent): void => {
    e && e.preventDefault();
    setIsOpen(false);
  };

  const getPrompt = (promptName) => {
    const argsForPrompts = {
      enterEmail: [handleValidationAndSubmit, isSubmitting, onEmailChange],
      success: [closeModal],
      acceptUser: [
        "accept",
        handleAcceptRejectClick,
        handleCheckboxSelect,
        profileImg,
        requestorName,
      ],
      rejectUser: [
        "reject",
        handleAcceptRejectClick,
        handleCheckboxSelect,
        profileImg,
        requestorName,
        isSpammer,
      ],
    };
    const args = argsForPrompts[promptName];
    if (args) {
      return prompts[promptName](...args);
    } else {
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
  modalStyle: {
    maxHeight: "95vh",
    width: "625px",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 6,
    right: 0,
    padding: 16,
    cursor: "pointer",
  },
});
