import { BodyTypeVals, NEW_SOURCE_BODY_TYPES } from "./modalBodyTypes";
import { breakpoints } from "~/config/themes/screen";
import { ID } from "~/config/types/root_types";
import { ReactElement, SyntheticEvent, useState } from "react";
import { StyleSheet } from "aphrodite";
import AddNewSourceBodySearch, {
  ValidCitationType,
} from "./AddNewSourceBodySearch";
import AddNewSourceBodyStandBy from "./AddNewSourceBodyStandBy";
import BaseModal from "~/components/Modals/BaseModal";
import PaperUploadV2Create from "~/components/Paper/Upload/PaperUploadV2Create";

const { NEW_PAPER_UPLOAD, SEARCH, STAND_BY } = NEW_SOURCE_BODY_TYPES;

type ComponentProps = {
  citationType: ValidCitationType;
  hypothesisID: ID;
  isModalOpen: boolean;
  onCloseModal: (event: SyntheticEvent) => void;
  updateLastFetchTime: Function;
};

type GetModalBodyArgs = {
  bodyType: BodyTypeVals;
  hypothesisID: ID;
  onCloseModal: (event: SyntheticEvent) => void;
  selectedCitationType: ValidCitationType;
  setBodyType: (bodyType: BodyTypeVals) => void;
  setSelectedCitationType: (citationType: ValidCitationType) => void;
  updateLastFetchTime: Function;
};

function getModalBody({
  bodyType,
  hypothesisID,
  onCloseModal,
  selectedCitationType,
  setBodyType,
  setSelectedCitationType,
  updateLastFetchTime,
}: GetModalBodyArgs): ReactElement<typeof AddNewSourceBodyStandBy> | null {
  switch (bodyType) {
    case NEW_PAPER_UPLOAD:
      return (
        <PaperUploadV2Create
          hypothesisID={hypothesisID}
          onCancelComplete={onCloseModal}
          onSubmitComplete={(event: SyntheticEvent): void => {
            updateLastFetchTime();
            onCloseModal(event);
          }}
        />
      );
    case SEARCH:
      return (
        <AddNewSourceBodySearch
          hypothesisID={hypothesisID}
          onCancel={onCloseModal}
          onSubmitComplete={(event: SyntheticEvent): void => {
            updateLastFetchTime();
            onCloseModal(event);
          }}
          selectedCitationType={selectedCitationType}
          setBodyType={setBodyType}
          setSelectedCitationType={setSelectedCitationType}
        />
      );
    case STAND_BY:
      return <AddNewSourceBodyStandBy setBodyType={setBodyType} />;
    default:
      return null;
  }
}

export default function AddNewSourceModal({
  citationType,
  hypothesisID,
  isModalOpen,
  onCloseModal,
  updateLastFetchTime,
}: ComponentProps): ReactElement<typeof BaseModal> {
  const [bodyType, setBodyType] = useState<BodyTypeVals>(SEARCH);
  const [selectedCitationType, setSelectedCitationType] =
    useState<ValidCitationType>(citationType);

  const modalBody = getModalBody({
    bodyType,
    hypothesisID,
    onCloseModal: (event: SyntheticEvent) => {
      setBodyType(SEARCH);
      onCloseModal(event);
    },
    selectedCitationType,
    setSelectedCitationType,
    setBodyType: (bodyType: BodyTypeVals): void => setBodyType(bodyType),
    updateLastFetchTime,
  });

  return (
    <BaseModal
      children={modalBody}
      closeModal={(event: SyntheticEvent): void => {
        // logical ordering
        setBodyType(SEARCH);
        onCloseModal(event);
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
    overflow: "unset",
    position: "relative",
    backgroundColor: "#fff",
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
