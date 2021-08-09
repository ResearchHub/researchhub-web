import { ID, ValueOf } from "../../../../config/types/root_types";
import { NEW_SOURCE_BODY_TYPES } from "./modalBodyTypes";
import AddNewSourceBodyStandBy from "./AddNewSourceBodyStandBy";
import BaseModal from "../../../Modals/BaseModal";
import React, { ReactElement, useState } from "react";

const { NEW_PAPAER_UPLOAD, SEARCH, STAND_BY } = NEW_SOURCE_BODY_TYPES;

type BodyTypeVals = ValueOf<typeof NEW_SOURCE_BODY_TYPES>;
type ComponentProps = { isModalOpen: boolean; onCloseModal: () => void };
type GetModalBodyArgs = {
  bodyType: BodyTypeVals;
  onBodyTypeChage: (bodyType: BodyTypeVals) => void;
  hypothesisID: ID;
};

function getModalBody({
  bodyType,
}: GetModalBodyArgs): ReactElement<typeof AddNewSourceBodyStandBy> {
  switch (bodyType) {
    case STAND_BY:
    default:
      return <AddNewSourceBodyStandBy />;
  }
}

export default function AddNewSourceModal({
  isModalOpen,
  onCloseModal,
}: ComponentProps): ReactElement<typeof BaseModal> {
  const [bodyType, setBodyType] = useState<BodyTypeVals>(STAND_BY);
  const modalBody = getModalBody({
    bodyType,
    hypothesisID: null,
    onBodyTypeChage: (bodyType: BodyTypeVals): void => setBodyType(bodyType),
  });
  return (
    <BaseModal
      children={modalBody}
      closeModal={onCloseModal}
      isOpen={isModalOpen}
    />
  );
}
