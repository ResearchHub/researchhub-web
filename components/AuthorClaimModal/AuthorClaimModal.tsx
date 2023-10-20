import { css, StyleSheet } from "aphrodite";
import { filterNull, isNullOrUndefined } from "../../config/utils/nullchecks";
import AuthorClaimPromptEmail, { AuthorDatum } from "./AuthorClaimPromptEmail";
import AuthorClaimPromptSuccess from "./AuthorClaimPromptSuccess";
import Modal from "react-modal";
import { ReactElement, SyntheticEvent, useState } from "react";

// Dynamic modules
import dynamic from "next/dynamic";
const BaseModal = dynamic(() => import("../Modals/BaseModal"));
import { breakpoints } from "../../config/themes/screen";
import { AuthorProfile } from "~/config/types/root_types";

export type AuthorClaimDataProps = {
  auth: any;
  authors: Array<AuthorProfile>;
  isOpen: boolean;
  setIsOpen: (flag: boolean) => void;
  removeProfileClick: () => void;
};

const getPrompt = ({
  auth,
  authors,
  onCloseModal,
  promptName,
  setOpenModalType,
  removeProfileClick,
}) => {
  switch (promptName) {
    case "enterEmail":
      return (
        <>
          <AuthorClaimPromptEmail
            authorData={authors.map((author: any): AuthorDatum => {
              return {
                name: `${author.firstName} ${author.lastName}`,
                id: author.id,
              };
            })}
            onSuccess={() => setOpenModalType("success")}
            userID={auth.user.id}
          />

          {removeProfileClick && (
            <div
              className={css(customModalStyle.requestToRemoveProfile)}
              onClick={() => removeProfileClick()}
            >
              Request to Remove Profile
            </div>
          )}
        </>
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
  removeProfileClick,
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
    removeProfileClick,
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

    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      overflowY: "auto",
    },
  },
  requestToRemoveProfile: {
    fontSize: 13,
    opacity: 0.6,
    letterSpacing: 0.4,
    marginTop: -16,
    cursor: "pointer",
    width: "100%",
    paddingBottom: 32,
    textAlign: "center",
    textDecoration: "underline",
  },
});
