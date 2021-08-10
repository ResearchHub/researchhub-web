import { BodyTypeVals, NEW_SOURCE_BODY_TYPES } from "./modalBodyTypes";
import { ID } from "../../../../config/types/root_types";
import { StyleSheet } from "aphrodite";
import AddNewSourceBodySearch from "./AddNewSourceBodySearch";
import AddNewSourceBodyStandBy from "./AddNewSourceBodyStandBy";
import BaseModal from "../../../Modals/BaseModal";
import PaperUploadV2Create from "../../../Paper/Upload/PaperUploadV2Create";
import React, { ReactElement, useState } from "react";
import { useRouter } from "next/router";

const { NEW_PAPER_UPLOAD, SEARCH, STAND_BY } = NEW_SOURCE_BODY_TYPES;

type ComponentProps = { isModalOpen: boolean; onCloseModal: () => void };
type GetModalBodyArgs = {
  bodyType: BodyTypeVals;
  setBodyType: (bodyType: BodyTypeVals) => void;
  hypothesisID: ID;
};

function getModalBody({
  bodyType,
  setBodyType,
  hypothesisID,
}: GetModalBodyArgs): ReactElement<typeof AddNewSourceBodyStandBy> | null {
  switch (bodyType) {
    case NEW_PAPER_UPLOAD:
      return <AddNewSourceBodyNewPaper />;
    case SEARCH:
      return <AddNewSourceBodySearch />;
    case STAND_BY:
      return <AddNewSourceBodyStandBy setBodyType={setBodyType} />;
    default:
      return null;
  }
}

export default function AddNewSourceModal({
  isModalOpen,
  onCloseModal,
}: ComponentProps): ReactElement<typeof BaseModal> {
  const router = useRouter();
  const hypothesisID = Array.isArray(router.query.documentId)
    ? parseInt(router.query.documentId[0])
    : // @ts-ignore implied that this is a string / int
      parseInt(router.query.documentId);

  const [bodyType, setBodyType] = useState<BodyTypeVals>(STAND_BY);
  const modalBody = getModalBody({
    bodyType,
    setBodyType: (bodyType: BodyTypeVals): void => setBodyType(bodyType),
    hypothesisID,
  });

  return (
    <BaseModal
      children={modalBody}
      closeModal={(): void => {
        // logical ordering
        setBodyType(STAND_BY);
        onCloseModal();
      }}
      isOpen={isModalOpen}
      modalContentStyle={styles.modalContentStyle}
      titleStyle={styles.titleStyle}
    />
  );
}

const styles = StyleSheet.create({
  modalContentStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#fff",
    padding: 24,
    overflowY: "auto",
    opacity: 0,
    borderRadius: 5,
    transition: "all ease-in-out 0.4s",
    boxSizing: "border-box",
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
    "@media only screen and (max-width: 415px)": {
      padding: "50px 0px 0px 0px",
    },
  },
  titleStyle: {
    display: "none",
  },
});
