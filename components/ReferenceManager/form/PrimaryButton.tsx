import { ReactElement } from "react";
import { Container, Box, Button } from "@mui/material";
import Image from "next/image";

interface Props {
  children: ReactElement | string;
}

export default function PrimaryButton({ children }: Props): ReactElement {
  return (
    <Button
      sx={{
        background: "#3971FF",
        maxWidth: 440,
        width: "100%",
        height: 50,
        "&:hover": {
          background: "#3971FF",
          opacity: 0.8,
          transition: ".3s ease-in-out",
        },
      }}
    >
      <Box
        component="span"
        sx={{
          color: "#fff",
          textTransform: "none",
          fontSize: 18,
          lineHeight: "22px",
        }}
      >
        {children}
      </Box>
    </Button>
  );
}
