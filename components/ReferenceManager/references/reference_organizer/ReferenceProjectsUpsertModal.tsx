import { customModalStyle } from "./styles/projects_upsert_modal_style";
import {
  emptyFncWithMsg,
  nullthrows,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";
import { getCurrentUserCurrentOrg } from "~/components/contexts/OrganizationContext";
import { ReactElement, SyntheticEvent } from "react";
import { Typography } from "@mui/material";
import { upsertReferenceProject } from "./api/upsertReferenceProject";
import { useReferenceProjectUpsertContext } from "./context/ReferenceProjectsUpsertContext";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import ReferenceItemFieldInput from "../../form/ReferenceItemFieldInput";
import ReferenceSwitchInput from "../../form/ReferenceSwitchInput";
import ReferenceUserInviteInput from "../../form/ReferenceUserInviteInput";

const BaseModal = dynamic(() => import("~/components/Modals/BaseModal"));

type ComponentProps = {
  onCloseModal?: (event?: SyntheticEvent) => void;
  onUpsertSuccess?: () => void;
};

export default function ReferenceProjectsUpsertModal({
  onCloseModal,
  onUpsertSuccess,
}: ComponentProps): ReactElement {
  const currentOrg = getCurrentUserCurrentOrg();
  const {
    isModalOpen,
    projectValue,
    resetContext,
    setProjectValue,
    upsertPurpose,
    resetProjectsFetchTime,
  } = useReferenceProjectUpsertContext();

  const handleCloseModal = (event?: SyntheticEvent) => {
    onCloseModal && onCloseModal(event);
    resetContext!();
  };

  const handleSubmit = () => {
    const { projectID, projectName } = projectValue;
    const formattedPayload = {
      organization: currentOrg?.id,
      project: projectID,
      project_name: nullthrows(projectName, "Project name may not be null"),
    };
    upsertReferenceProject({
      onSuccess: (result) => {
        resetProjectsFetchTime();
        onUpsertSuccess && onUpsertSuccess();
        handleCloseModal();
      },
      onError: emptyFncWithMsg,
      payload: formattedPayload,
      upsertPurpose,
    });
  };

  const modalTitle =
    upsertPurpose === "update"
      ? "Update project"
      : upsertPurpose === "create"
      ? "Create a project"
      : "Add a sub-project";

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
              setProjectValue({ ...projectValue, projectName });
            }}
            placeholder="Enter project name"
            required
            value={projectValue.projectName}
          />
          <ReferenceSwitchInput
            label={"Make it public"}
            isChecked={projectValue.isPublic}
            onSwitch={(isPublic: boolean): void => {
              setProjectValue({ ...projectValue, isPublic });
            }}
            required
          />
          <ReferenceUserInviteInput
            label={"Invite collaborators (optional)"}
            onInputChange={silentEmptyFnc}
            projectID={projectValue.projectID}
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
                handleCloseModal(event);
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
                handleSubmit();
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
                {"Submit"}
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
          <div>{modalTitle}</div>
        </div>
      }
      closeModal={handleCloseModal}
      isOpen={isModalOpen}
      modalContentStyle={customModalStyle.modalContentStyle}
      modalStyle={customModalStyle.modalStyle}
    />
  );
}
