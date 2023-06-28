import { Box, Typography } from "@mui/material";
import {
  DEFAULT_PROJECT_VALUES,
  useReferenceProjectUpsertContext,
} from "./context/ReferenceProjectsUpsertContext";
import { faAngleDown, faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ID } from "~/config/types/root_types";
import { LookupSuggestedUser } from "../../form/ReferenceItemRhUserLookupInputTag";
import { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { useReferenceUploadDrawerContext } from "../reference_uploader/context/ReferenceUploadDrawerContext";
import ALink from "~/components/ALink";
import colors from "~/config/themes/colors";
import ReferenceProjectNavbarElOption from "./ReferenceProjectNavbarElOptions";
import { faFolder, faFolders } from "@fortawesome/pro-solid-svg-icons";
import { useReferencesTableContext } from "../reference_table/context/ReferencesTableContext";

type Props = {
  active: boolean;
  addChildrenOpen: ({ key, value }) => void;
  collaborators: LookupSuggestedUser[];
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
  addChildrenOpen,
  child,
  collaborators,
  depth,
  isCurrentUserAdmin,
  isOpen,
  isPublic,
  orgSlug,
  projectID,
  projectName,
  slug,
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
  const [shouldShowOptions, setShouldShowOptions] = useState<boolean>(false);
  const [fileDraggedOver, setFileDraggedOver] = useState<boolean>(false);

  const { rowDropped } = useReferencesTableContext();

  return (
    <Box
      onMouseEnter={(): void => {
        setShouldShowOptions(true);
      }}
      onMouseLeave={(): void => {
        setShouldShowOptions(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setFileDraggedOver(true);
      }}
      onDragLeave={() => {
        setFileDraggedOver(false);
      }}
      onDrop={() => {
        setFileDraggedOver(false);
        rowDropped({ id: projectID });
      }}
      sx={{
        alignItems: "center",
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        maxHeight: 50,
        px: 2.5,
        background: active || fileDraggedOver ? colors.GREY(0.2) : "",
        margin: "8px",
        marginBottom: "0px",
        marginTop: "0px",
        borderRadius: "4px",
        padding: "8px",
        boxSizing: "border-box",
        marginLeft: child ? `${16 * depth}px` : "8px",
      }}
    >
      <ALink
        href={`/reference-manager/${orgSlug}/${slug}`}
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
                const projectIdsOpenv2 =
                  window.localStorage.getItem("projectIdsOpenv2") || "{}";

                const projectIdsJson = JSON.parse(projectIdsOpenv2);

                if (isOpen) {
                  projectIdsJson[projectID] = false;
                } else {
                  projectIdsJson[projectID] = true;
                }

                window.localStorage.setItem(
                  "projectIdsOpenv2",
                  JSON.stringify(projectIdsJson)
                );
              }}
            />
            <FontAwesomeIcon
              icon={faFolder}
              color="#7BD3F9"
              style={{ fontSize: 14, paddingLeft: 4 }}
            />
            <Typography
              component="div"
              fontSize={child ? 13 : 14}
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
      {true && (
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
          setShouldShowOptions={setShouldShowOptions}
        />
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  linkOverride: {
    width: "calc(100% - 20px)",
  },
  arrowIcon: {
    fontSize: 16,
    padding: 4,
    borderRadius: 4,

    ":hover": {
      background: "#ddd",
    },
  },
});
