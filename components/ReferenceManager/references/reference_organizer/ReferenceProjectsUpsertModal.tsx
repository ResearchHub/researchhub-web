import { customModalStyle } from "./styles/projects_upsert_modal_style";
import { ID, NullableString } from "~/config/types/root_types";
import { isEmpty, nullthrows, silentEmptyFnc } from "~/config/utils/nullchecks";
import { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { upsertReferenceProject } from "./api/upsertReferenceProject";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import ReferenceItemFieldInput from "../../form/ReferenceItemFieldInput";
import ReferenceSwitchInput from "../../form/ReferenceSwitchInput";
import ReferenceUserInviteInput from "../../form/ReferenceUserInviteInput";
import { useRouter } from "next/router";
import { useOrgs } from "~/components/contexts/OrganizationContext";

const BaseModal = dynamic(() => import("~/components/Modals/BaseModal"));

type ComponentProps = {
  isModalOpen: boolean;
  onCloseModal: (event: SyntheticEvent) => void;
  onUpsertSuccess: () => void;
  projectID: ID;
};

type ProjectValues = {
  isPublic: boolean;
  projectID: ID;
  projectName: NullableString;
};

export default function ReferenceProjectsUpsertModal({
  isModalOpen,
  onCloseModal,
  onUpsertSuccess,
  projectID,
}: ComponentProps): ReactElement {
  // TODO: calvinhlee - clean up this mess around organization and other callsites like this
  const router = useRouter();
  const { orgs, setCurrentOrg, currentOrg } = useOrgs();
  const { organization } = router.query;

  useEffect(() => {
    if (organization && orgs.length) {
      // @ts-ignore
      const curOrg = orgs.find((org) => org.slug === organization);
      // @ts-ignore
      setCurrentOrg(curOrg);
    }
  }, [organization, orgs]);

  const isUpdate = !isEmpty(projectID);
  const [projectValues, setProjectValues] = useState<ProjectValues>({
    isPublic: true,
    projectID,
    projectName: null,
  });

  const handleSubmit = () => {
    const { projectID, projectName } = projectValues;
    const formattedPayload = {
      organization: currentOrg?.id,
      project: isUpdate ? projectID : undefined,
      project_name: nullthrows(projectName, "Project name may not be null"),
    };
    upsertReferenceProject({
      onSuccess: (result) => {
        onUpsertSuccess();
      },
      onError: (error) => {
        console.warn("error: ", error);
      },
      payload: formattedPayload,
    });
  };

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
                onCloseModal(event);
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
                {isUpdate ? "Update" : "Create"}
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
          <div>{`${isUpdate ? "Update" : "Create"} a project`}</div>
        </div>
      }
      closeModal={onCloseModal}
      isOpen={isModalOpen}
      modalContentStyle={customModalStyle.modalContentStyle}
      modalStyle={customModalStyle.modalStyle}
    />
  );
}
