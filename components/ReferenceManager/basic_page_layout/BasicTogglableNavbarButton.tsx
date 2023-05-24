import { Box, ListItem, ListItemIcon, Typography } from "@mui/material";
import { ReactElement, ReactNode } from "react";
import ALink from "~/components/ALink";
import colors from "~/config/themes/colors";

type Props = {
  icon: ReactNode;
  isActive: boolean;
  label: string;
  link: string;
  option?: ReactNode;
};

export default function BasicTogglableNavbarButton({
  icon,
  isActive,
  label,
  link,
  option,
}: Props): ReactElement {
  return (
    <Box
      key={"org-references"}
      sx={{
        alignItems: "center",
        background: isActive ? colors.GREY(0.2) : "inherit",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "space-between",
        padding: "0 16px",
        width: "100%",
      }}
    >
      <span style={{ width: "100%" }}>
        <ALink href={link} disableTextDeco>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              minHeight: 48,
              textDecoration: "none",
              width: "100%",
            }}
          >
            {icon}
            <Typography>{label}</Typography>
          </Box>
        </ALink>
      </span>
      {option}
    </Box>
  );
}
