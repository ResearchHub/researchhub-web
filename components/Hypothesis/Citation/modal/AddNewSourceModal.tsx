import { css, StyleSheet } from "aphrodite";
import BaseModal from "../../../Modals/BaseModal";
import React, { ReactElement } from "react";

type Props = { isModalOpen: boolean; onCloseModal: () => void };

export default function AddNewSourceModal({
  isModalOpen,
  onCloseModal,
}: Props): ReactElement<typeof BaseModal> {
  return (
    <BaseModal
      children={<div>This is Modal Body</div>}
      closeModal={onCloseModal}
      isOpen={isModalOpen}
    />
  );
}
