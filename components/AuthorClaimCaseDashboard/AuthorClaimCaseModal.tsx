import BaseModal from "../Modals/BaseModal";
import prompts from "./AuthorClaimCasePrompts";
import Modal from "react-modal";
import React, { Fragment, ReactElement, SyntheticEvent, useState } from "react";
import { updateCaseStatus } from "./api/AuthorClaimCaseUpdateCase";
import { css, StyleSheet } from "aphrodite";
import { AUTHOR_CLAIM_STATUS } from "./constants/AuthorClaimStatus";

export type AuthorClaimCaseProps = {
  caseID: any;
  firstPrompt: "approveUser" | "rejectUser";
  isOpen: boolean;
  profileImg: string;
  requestorName: string;
  setIsOpen: (flag: boolean) => void;
  setLastFetchTime: Function;
};

export default function AuthorClaimModal({
  caseID,
  firstPrompt,
  isOpen,
  profileImg,
  requestorName,
  setIsOpen,
  setLastFetchTime,
}: AuthorClaimCaseProps): ReactElement<typeof Modal> {
  let [promptName, setPromptName] = useState<string>(firstPrompt);
  let [isSpammer, setIsSpammer] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [shouldDisplayError, setShouldDisplayError] = useState<boolean>(false);

  const handleCheckboxSelect = (id, value) => {
    setIsSpammer(value);
  };

  const createAcceptReject = (actionType) => {
    return (event: SyntheticEvent) => {
      event.stopPropagation(); /* prevents card collapse */
      setIsSubmitting(true);
      updateCaseStatus({
        payload: { caseID, updateStatus: actionType }, // Note: "Mark As Spammer" not implemented yet.
        onSuccess: () => {
          setIsSubmitting(false);
          setLastFetchTime(Date.now());
          closeModal(event);
        },
      });
    };
  };

  const closeModal = (e: SyntheticEvent): void => {
    e && e.preventDefault();
    setIsOpen(false);
  };

  const getPrompt = (promptName) => {
    const verb = {
      approveUser: "approve",
      rejectUser: "reject",
    }[promptName];
    const actionType = {
      approveUser: AUTHOR_CLAIM_STATUS.APPROVED,
      rejectUser: AUTHOR_CLAIM_STATUS.DENIED,
    }[promptName];
    return prompts.acceptRejectUser(
      verb,
      createAcceptReject(actionType),
      handleCheckboxSelect,
      profileImg,
      requestorName,
      isSubmitting,
      isSpammer
    );
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
