import { ID } from "~/config/types/root_types";
import { ListItemButton, Typography } from "@mui/material";
import { ReactElement } from "react";
import ALink from "~/components/ALink";
import FolderIcon from "@mui/icons-material/Folder";

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
  return (
    <ALink href={`/reference-manager/${orgSlug}/?project=${projectID}`}>
      <ListItemButton
        sx={{
          minHeight: 48,
          px: 2.5,
          maxHeight: 50,
        }}
      >
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
      </ListItemButton>
    </ALink>
  );
}
