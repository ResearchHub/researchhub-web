import { customModalStyle } from "./styles/projects_upsert_modal_style";
import { ID, NullableString } from "~/config/types/root_types";
import { ReactElement, SyntheticEvent, useState } from "react";
import dynamic from "next/dynamic";
import ReferenceItemFieldInput from "../../form/ReferenceItemFieldInput";
import ReferenceSwitchInput from "../../form/ReferenceSwitchInput";

const BaseModal = dynamic(() => import("~/components/Modals/BaseModal"));

type ComponentProps = {
  projectID: ID;
  isModalOpen: boolean;
  onCloseModal: (event: SyntheticEvent) => void;
};

type ProjectValues = {
  projectID: ID;
  projectName: NullableString;
  isPublic: boolean;
};

export default function ReferenceProjectsUpsertModal({
  projectID,
  isModalOpen,
  onCloseModal,
}: ComponentProps): ReactElement {
  const [projectValues, setProjectValues] = useState<ProjectValues>({
    projectID,
    projectName: null,
    isPublic: true,
  });
  return (
    <BaseModal
      children={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <ReferenceItemFieldInput
            formID="project-name"
            label="Project name"
            onChange={(projectName: string) => {
              setProjectValues({ ...projectValues, projectName });
            }}
            required
            value={projectValues.projectName}
          />
          <ReferenceSwitchInput
            label={"Make it public"}
            isChecked={projectValues.isPublic}
            onSwitch={(isPublic: boolean): void => {
              setProjectValues({ ...projectValues, isPublic });
            }}
          />
        </div>
      }
      title={
        <div
          style={{
            display: "flex",
            marginTop: "-24px",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>{"Create a project"}</div>
        </div>
      }
      closeModal={onCloseModal}
      isOpen={isModalOpen}
      modalContentStyle={customModalStyle.modalContentStyle}
      modalStyle={customModalStyle.modalStyle}
    />
  );
}
