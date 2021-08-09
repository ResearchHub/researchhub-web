import { ID } from "../../../../config/types/root_types";
import { BodyTypeVals, NEW_SOURCE_BODY_TYPES } from "./modalBodyTypes";
import AddNewSourceBodyStandBy from "./AddNewSourceBodyStandBy";
import BaseModal from "../../../Modals/BaseModal";
import React, { ReactElement, useState } from "react";

const { NEW_PAPAER_UPLOAD, SEARCH, STAND_BY } = NEW_SOURCE_BODY_TYPES;

type ComponentProps = { isModalOpen: boolean; onCloseModal: () => void };
type GetModalBodyArgs = {
  bodyType: BodyTypeVals;
  setBodyType: (bodyType: BodyTypeVals) => void;
  hypothesisID: ID;
};

function getModalBody({
  bodyType,
  setBodyType,
}: GetModalBodyArgs): ReactElement<typeof AddNewSourceBodyStandBy> | null {
  switch (bodyType) {
    case NEW_PAPAER_UPLOAD:
    case SEARCH:
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
  const [bodyType, setBodyType] = useState<BodyTypeVals>(STAND_BY);
  const modalBody = getModalBody({
    bodyType,
    setBodyType: (bodyType: BodyTypeVals): void => setBodyType(bodyType),
    hypothesisID: null,
  });
  return (
    <BaseModal
      children={modalBody}
      closeModal={onCloseModal}
      isOpen={isModalOpen}
    />
  );
}
