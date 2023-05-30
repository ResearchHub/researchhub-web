import { Box, Typography } from "@mui/material";
import {
  DEFAULT_PROJECT_VALUES,
  useReferenceProjectUpsertContext,
} from "./context/ReferenceProjectsUpsertContext";
import { ID } from "~/config/types/root_types";
import { ReactElement, SyntheticEvent, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { SuggestedUser } from "~/components/SearchSuggestion/lib/types";
import { useReferenceUploadDrawerContext } from "../reference_uploader/context/ReferenceUploadDrawerContext";
import ALink from "~/components/ALink";
import colors from "~/config/themes/colors";
import FolderIcon from "@mui/icons-material/Folder";
import ReferenceProjectNavbarElOption from "./ReferenceProjectNavbarElOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from "@fortawesome/pro-light-svg-icons";

type Props = {
  active: boolean;
  collaborators: SuggestedUser[];
  isCurrentUserAdmin: boolean;
  isPublic: boolean;
  orgSlug: string;
  projectID: ID;
  projectName: string;
  child: boolean;
  depth: number;
  referenceProject: any;
  isOpen: boolean;
};

export default function ReferenceProjectsNavbarEl({
  active,
  collaborators,
  isCurrentUserAdmin,
  isPublic,
  orgSlug,
  projectID,
  projectName,
  child,
  depth,
  addChildrenOpen,
  isOpen,
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
        background: active ? colors.GREY(0.2) : "",
        margin: "8px",
        marginBottom: "0px",
        marginTop: "0px",
        borderRadius: "4px",
        padding: "8px",
        boxSizing: "border-box",
        marginLeft: child ? `${12 * depth}px` : "8px",
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
            {/* <FolderIcon fontSize="small" sx={{ color: "#7C7989" }} /> */}
            <FontAwesomeIcon
              icon={isOpen ? faAngleDown : faAngleRight}
              color={"rgba(55, 53, 47, 0.35)"}
              className={css(styles.arrowIcon)}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                addChildrenOpen({ key: projectID, value: !isOpen });
                const projectIdsOpen =
                  window.localStorage.getItem("projectIdsOpen") || "";

                window.localStorage.setItem(
                  "projectIdsOpen",
                  projectIdsOpen + `${projectID},`
                );
              }}
            />
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
        isCurrentUserAdmin={isCurrentUserAdmin}
        projectID={projectID}
        projectName={projectName}
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
            isPublic,
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
  arrowIcon: {
    fontSize: 16,
    padding: 8,

    ":hover": {
      background: "#ddd",
    },
  },
});
