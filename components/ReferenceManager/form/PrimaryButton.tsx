import { ReactElement, SyntheticEvent } from "react";
import { Box, Button } from "@mui/material";
import { isEmpty } from "~/config/utils/nullchecks";

interface Props {
  children: ReactElement | string;
  disabled: boolean;
  onClick: (event: SyntheticEvent) => void;
  margin?: string;
  size?: "small" | "medium" | "large";
}

export default function PrimaryButton({
  children,
  disabled,
  margin = undefined,
  onClick,
  size,
}: Props): ReactElement {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      size={size}
      sx={{
        background: "#3971FF",
        width: "100%",
        height: isEmpty(size) ? 50 : undefined,
        margin: margin,
        "&:hover": {
          background: "#3971FF",
          opacity: 0.8,
          transition: ".3s ease-in-out",
        },
      }}
    >
      <Box
        // component="span"
        sx={{
          color: colors.WHITE(),
          textTransform: "none",
          fontSize: 18,
          height: 20,
          lineHeight: "22px",
        }}
      >
        {children}
      </Box>
    </Button>
  );
}
