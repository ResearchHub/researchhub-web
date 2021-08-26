import { BodyTypeVals, NEW_SOURCE_BODY_TYPES } from "./modalBodyTypes";
import { breakpoints } from "../../../../config/themes/screen";
import { ID } from "../../../../config/types/root_types";
import { StyleSheet } from "aphrodite";
import AddNewSourceBodySearch from "./AddNewSourceBodySearch";
import AddNewSourceBodyStandBy from "./AddNewSourceBodyStandBy";
import BaseModal from "../../../Modals/BaseModal";
import PaperUploadV2Create from "../../../Paper/Upload/PaperUploadV2Create";
import { ReactElement, useState } from "react";

const { NEW_PAPER_UPLOAD, SEARCH, STAND_BY } = NEW_SOURCE_BODY_TYPES;

type ComponentProps = {
  hypothesisID: ID;
  isModalOpen: boolean;
  onCloseModal: () => void;
  updateLastFetchTime: Function;
};

type GetModalBodyArgs = {
  bodyType: BodyTypeVals;
  hypothesisID: ID;
  onCloseModal: () => void;
  setBodyType: (bodyType: BodyTypeVals) => void;
  updateLastFetchTime: Function;
};

function getModalBody({
  bodyType,
  hypothesisID,
  onCloseModal,
  setBodyType,
  updateLastFetchTime,
}: GetModalBodyArgs): ReactElement<typeof AddNewSourceBodyStandBy> | null {
  switch (bodyType) {
    case NEW_PAPER_UPLOAD:
      return (
        <PaperUploadV2Create
          hypothesisID={hypothesisID}
          onCancelComplete={onCloseModal}
          onSubmitComplete={(): void => {
            updateLastFetchTime();
            onCloseModal();
          }}
        />
      );
    case SEARCH:
      return <AddNewSourceBodySearch />;
    case STAND_BY:
      return <AddNewSourceBodyStandBy setBodyType={setBodyType} />;
    default:
      return null;
  }
}

export default function AddNewSourceModal({
  hypothesisID,
  isModalOpen,
  onCloseModal,
  updateLastFetchTime,
}: ComponentProps): ReactElement<typeof BaseModal> {
  const [bodyType, setBodyType] = useState<BodyTypeVals>(STAND_BY);
  const modalBody = getModalBody({
    bodyType,
    hypothesisID,
    onCloseModal,
    setBodyType: (bodyType: BodyTypeVals): void => setBodyType(bodyType),
    updateLastFetchTime,
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
    // overflowY: 'visible',
    padding: 24,
    opacity: 0,
    borderRadius: 5,
    transition: "all ease-in-out 0.4s",
    boxSizing: "border-box",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 25,
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      padding: "50px 0px 0px 0px",
    },
  },
  titleStyle: { display: "none" },
});
