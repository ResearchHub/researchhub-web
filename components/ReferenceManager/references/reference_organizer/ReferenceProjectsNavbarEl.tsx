import { Box, Typography } from "@mui/material";
import {
  DEFAULT_PROJECT_VALUES,
  useReferenceProjectUpsertContext,
} from "./context/ReferenceProjectsUpsertContext";
import { ID } from "~/config/types/root_types";
import { ReactElement, SyntheticEvent } from "react";
import { StyleSheet } from "aphrodite";
import { useReferenceUploadDrawerContext } from "../reference_uploader/context/ReferenceUploadDrawerContext";
import ALink from "~/components/ALink";
import FolderIcon from "@mui/icons-material/Folder";
import ReferenceProjectNavbarElOption from "./ReferenceProjectNavbarElOptions";
import { SuggestedUser } from "~/components/SearchSuggestion/lib/types";

type Props = {
  admins: SuggestedUser[];
  collaborators: SuggestedUser[];
  orgSlug: string;
  projectID: ID;
  projectName: string;
};

export default function ReferenceProjectsNavbarEl({
  collaborators,
  orgSlug,
  projectID,
  projectName,
}: Props): ReactElement {
  const {
    setIsDrawerOpen: setIsUploadDrawerOpen,
    setProjectID: setProjectIDRefUploader,
  } = useReferenceUploadDrawerContext();
  const {
    setIsModalOpen: setIsProjectUpsertModalOpen,
    setProjectValue: setProjectUpsertValue,
    setUpsertPurpose: setProjectUpsertPurpose,
  } = useReferenceProjectUpsertContext();

  return (
    <Box
      sx={{
        alignItems: "center",
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        maxHeight: 50,
        px: 2.5,
        margin: "8px",
        marginLeft: 0,
        marginRight: 0,
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <ALink
        href={`/reference-manager/${orgSlug}/?project=${projectID}&project_name=${projectName}`}
        overrideStyle={styles.linkOverride}
      >
        <Box
          sx={{ width: "100%", minWidth: "100%" }}
          onMouseDown={(event: SyntheticEvent): void => {
            event.preventDefault();
            setIsUploadDrawerOpen(false);
            setProjectIDRefUploader(null);
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FolderIcon fontSize="small" sx={{ color: "#7C7989" }} />
            <Typography
              component="div"
              fontSize={14}
              letterSpacing={"1.2px"}
              noWrap
              variant="h6"
              ml={"6px"}
              color={"#241F3A"}
            >
              {projectName}
            </Typography>
          </div>
        </Box>
      </ALink>
      <ReferenceProjectNavbarElOption
        onSelectAddNewReference={(event: SyntheticEvent): void => {
          event.preventDefault();
          setProjectIDRefUploader(projectID);
          setIsUploadDrawerOpen(true);
        }}
        onSelectCreateSubProject={(event: SyntheticEvent): void => {
          event.preventDefault();
          setProjectIDRefUploader(null);
          setIsUploadDrawerOpen(false);
          setProjectUpsertPurpose("create_sub_project");
          setProjectUpsertValue({ ...DEFAULT_PROJECT_VALUES, projectID });
          setIsProjectUpsertModalOpen(true);
        }}
        onSelectEditProject={(event: SyntheticEvent): void => {
          event.preventDefault();
          setProjectIDRefUploader(null);
          setIsUploadDrawerOpen(false);
          setProjectUpsertPurpose("update");
          setProjectUpsertValue({
            ...DEFAULT_PROJECT_VALUES,
            collaborators,
            projectID,
            projectName,
          });
          setIsProjectUpsertModalOpen(true);
        }}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  linkOverride: {
    width: "100%",
  },
});
