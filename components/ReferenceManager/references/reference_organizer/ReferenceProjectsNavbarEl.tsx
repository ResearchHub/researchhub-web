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
import { navContext } from "~/components/contexts/NavigationContext";
import { useReferencesTableContext } from "../reference_table/context/ReferencesTableContext";
import { faFolderPlus } from "@fortawesome/pro-regular-svg-icons";
import CheckBox from "~/components/Form/CheckBox";
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
  allowManage: boolean;
  depth: number;
  referenceProject: any;
  setActiveTab: (tab) => void;
  isOpen: boolean;
  slug: string;
  selectedProjectIds?: ID[];
  handleClick?: Function;
  handleSelectProject?: Function;
  allowSelection?: boolean;
  setIsDeleteModalOpen: () => void;
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
  referenceProject,
  orgSlug,
  projectID,
  projectName,
  slug,
  handleClick,
  selectedProjectIds,
  handleSelectProject,
  allowSelection = false,
  allowManage = false,
  setIsDeleteModalOpen,
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
  const { isRefManagerDisplayedAsDrawer, setIsRefManagerSidebarOpen } =
    navContext();

  const projectItemElement = (
    <Box
      sx={{
        width: "100%",
        minWidth: "100%",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
      onMouseDown={(event: SyntheticEvent): void => {
        event.preventDefault();
        setIsUploadDrawerOpen(false);
        setProjectIDRefUploader(null);
        if (isRefManagerDisplayedAsDrawer) {
          setIsRefManagerSidebarOpen(false);
        }
      }}
    >
      {allowSelection && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleSelectProject!({ id: projectID, name: projectName, slug });
          }}
        >
          {/* @ts-ignore */}
          <CheckBox
            active={selectedProjectIds!.includes(projectID)}
            isSquare={true}
            small={true}
          />
        </div>
      )}

      <div
        style={{ display: "flex", alignItems: "center", width: "100%" }}
        className={"reference-item-inner"}
      >
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
          style={{ marginLeft: 4, fontSize: 16, width: 16 }}
          color={"#AAA8B4"}
        />
        <Typography
          component="div"
          fontSize={14}
          noWrap
          // variant="span"
          ml={"6px"}
          sx={{ fontWeight: 400 }}
          color={"#241F3A"}
        >
          {projectName}
        </Typography>
      </div>
    </Box>
  );

  const canEdit =
    referenceProject?.status === "full_access" ||
    referenceProject?.current_user_is_admin;

  return (
    <Box
      onMouseEnter={(): void => {
        setShouldShowOptions(canEdit);
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
        justifyContent: "space-between",
        maxHeight: 50,
        px: 2.5,
        background:
          active || shouldShowOptions || fileDraggedOver
            ? colors.GREY(0.2)
            : "",
        marginBottom: "0px",
        marginTop: "0px",
        borderRadius: "4px",
        padding: "8px 10px",
        position: "relative",
        boxSizing: "border-box",
        marginLeft: child ? `${16 * depth}px` : "0px",
      }}
    >
      {handleClick ? (
        <div onClick={() => handleClick({ projectID, projectName, slug })}>
          {projectItemElement}
        </div>
      ) : (
        <ALink
          href={`/reference-manager/${orgSlug}/${slug}`}
          overrideStyle={styles.linkOverride}
        >
          {projectItemElement}
        </ALink>
      )}
      <div
        style={{ display: "flex", alignItems: "center" }}
        className={css(styles.options)}
      >
        {/* {shouldShowOptions && isCurrentUserAdmin && allowManage && (
          <div className={css(styles.moreOptionsIcon)}>
            <ReferenceProjectNavbarElOption
              isCurrentUserAdmin={isCurrentUserAdmin}
              projectID={projectID}
              projectName={projectName}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
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
          </div>
        )} */}
        {shouldShowOptions && (
          <FontAwesomeIcon
            icon={faFolderPlus}
            className={css(styles.folderIcon)}
            color={"#AAA8B4"}
            onClick={(e) => {
              e.stopPropagation();
              setProjectUpsertPurpose("create_sub_project");
              setProjectUpsertValue({ ...DEFAULT_PROJECT_VALUES, projectID });
              setIsProjectUpsertModalOpen(true);
            }}
          />
        )}
      </div>
    </Box>
  );
}

const styles = StyleSheet.create({
  options: {
    position: "absolute",
    right: 4,
  },
  folderIcon: {
    marginLeft: 4,
    fontSize: 16,
    width: 18,
    height: 18,
    padding: 4,
    borderRadius: 4,
    ":hover": {
      background: "#ddd",
    },
  },
  moreOptionsIcon: {
    fontSize: 16,
    width: 18,
    height: 16,
    padding: 4,
    borderRadius: 4,
    color: "#AAA8B4",
    ":hover": {
      background: "#ddd",
    },
  },
  linkOverride: {
    width: "calc(100%)",
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
