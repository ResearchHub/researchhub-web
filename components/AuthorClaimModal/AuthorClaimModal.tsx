import { css, StyleSheet } from "aphrodite";
import { filterNull, isNullOrUndefined } from "../../config/utils/nullchecks";
import AuthorClaimPromptEmail, { AuthorDatum } from "./AuthorClaimPromptEmail";
import AuthorClaimPromptSuccess from "./AuthorClaimPromptSuccess";
import Modal from "react-modal";
import { ReactElement, SyntheticEvent, useState } from "react";

// Dynamic modules
import dynamic from "next/dynamic";
const BaseModal = dynamic(() => import("../Modals/BaseModal"));

export type AuthorClaimDataProps = {
  auth: any;
  authors: Array<any>;
  isOpen: boolean;
  setIsOpen: (flag: boolean) => void;
};

const getPrompt = ({
  auth,
  authors,
  onCloseModal,
  promptName,
  setOpenModalType,
}) => {
  switch (promptName) {
    case "enterEmail":
      return (
        <AuthorClaimPromptEmail
          authorData={authors.map(
            (author: any): AuthorDatum => {
              return {
                name: `${author.first_name} ${author.last_name}`,
                id: author.id,
              };
            }
          )}
          onSuccess={() => setOpenModalType("success")}
          userID={auth.user.id}
        />
      );
    case "success":
      return <AuthorClaimPromptSuccess handleContinue={onCloseModal} />;
    default:
      return null;
  }
};

export default function AuthorClaimModal({
  auth,
  authors,
  isOpen,
  setIsOpen,
}: AuthorClaimDataProps): ReactElement<typeof Modal> | null {
  const [openModalType, setOpenModalType] = useState<string>("enterEmail");

  if (
    isNullOrUndefined(authors) ||
    (Array.isArray(authors) && filterNull(authors).length === 0)
  ) {
    return null;
  }

  const onCloseModal = (e: SyntheticEvent): void => {
    e && e.preventDefault();
    setOpenModalType("enterEmail");
    setIsOpen(false);
  };

  const modalBody = getPrompt({
    auth,
    authors,
    onCloseModal,
    promptName: openModalType,
    setOpenModalType,
  });

  return (
    <BaseModal
      children={
        <div className={css(customModalStyle.bodyZIndex)}>
          <img
            alt="Close Button"
            className={css(customModalStyle.closeButton)}
            draggable={false}
            onClick={onCloseModal}
            src="/static/icons/close.png"
          />
          {modalBody}
        </div>
      }
      closeModal={onCloseModal}
      isOpen={isOpen}
      modalStyle={customModalStyle.modalStyle}
      removeDefault={true}
      modalContentStyle={customModalStyle.modalContentStyle}
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
  modalContentStyle: {
    overflowY: "visible",
    overflow: "visible",
  },
});
