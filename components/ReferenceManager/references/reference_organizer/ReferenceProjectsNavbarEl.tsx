import { Box, Typography } from "@mui/material";
import { ID } from "~/config/types/root_types";
import { ReactElement, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ALink from "~/components/ALink";
import FolderIcon from "@mui/icons-material/Folder";
import ReferenceManualUploadDrawer from "../reference_uploader/ReferenceManualUploadDrawer";

type Props = {
  orgSlug: string;
  projectID: ID;
  projectName: string;
};

export default function ReferenceProjectsNavbarEl({
  orgSlug,
  projectID,
  projectName,
}: Props): ReactElement {
  const [isManualUploadDrawerOpen, setIsManualUploadDrawerOpen] =
    useState<boolean>(false);
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
      }}
    >
      {/* TODO: calvinhlee - move this to context */}
      <ReferenceManualUploadDrawer
        drawerProps={{
          isDrawerOpen: isManualUploadDrawerOpen,
          setIsDrawerOpen: setIsManualUploadDrawerOpen,
        }}
        projectID={projectID}
        key={`upload-${orgSlug}-${projectName}`}
      />
      <ALink href={`/reference-manager/${orgSlug}/?project=${projectID}`}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FolderIcon fontSize="small" />
          <Typography
            component="div"
            fontSize={14}
            letterSpacing={"1.2px"}
            noWrap
            variant="h6"
            ml={"6px"}
          >
            {projectName}
          </Typography>
        </div>
      </ALink>
      <AddCircleOutlineIcon
        fontSize="small"
        onClick={() => {
          setIsManualUploadDrawerOpen(true);
        }}
      />
    </Box>
  );
}
