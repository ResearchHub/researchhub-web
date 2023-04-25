import { customModalStyle } from "./styles/projects_upsert_modal_style";
import { ID, NullableString } from "~/config/types/root_types";
import { ReactElement, SyntheticEvent, useState } from "react";
import dynamic from "next/dynamic";
import ReferenceItemFieldInput from "../../form/ReferenceItemFieldInput";
import ReferenceSwitchInput from "../../form/ReferenceSwitchInput";
import ReferenceUserInviteInput from "../../form/ReferenceUserInviteInput";
import { silentEmptyFnc } from "~/config/utils/nullchecks";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import colors from "~/config/themes/colors";

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
            placeholder="Enter project name"
            required
            value={projectValues.projectName}
          />
          <ReferenceSwitchInput
            label={"Make it public"}
            isChecked={projectValues.isPublic}
            onSwitch={(isPublic: boolean): void => {
              setProjectValues({ ...projectValues, isPublic });
            }}
            required
          />
          <ReferenceUserInviteInput
            label={"Invite collaborators (optional)"}
            onInputChange={silentEmptyFnc}
            projectID={projectID}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              margin: "16px 0 -16px",
              width: "100%",
            }}
          >
            <div
              onClick={(event: SyntheticEvent): void => {
                event.preventDefault();
              }}
              style={{
                width: "88px",
                marginLeft: "16px",
                alignItems: "center",
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                height: "40px",
                borderRadius: "4px",
              }}
            >
              <Typography
                fontSize="14px"
                fontWeight="400"
                color={colors.NEW_BLUE()}
              >
                {"Cancel"}
              </Typography>
            </div>
            <div
              onClick={(event: SyntheticEvent): void => {
                event.preventDefault();
              }}
              style={{
                width: "88px",
                marginLeft: "16px",
                background: colors.NEW_BLUE(),
                alignItems: "center",
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                height: "40px",
                borderRadius: "4px",
              }}
            >
              <Typography fontSize="14px" fontWeight="400" color="#fff">
                {"Create"}
              </Typography>
            </div>
          </div>
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
