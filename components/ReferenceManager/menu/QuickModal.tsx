import { Box, Button, Modal } from "@mui/material";
import { Fragment, ReactElement, ReactNode } from "react";

type ButtonConfig = {
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  label?: ReactNode;
  remove?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "text" | "outlined" | "contained";
};

type Props = {
  isOpen: boolean;
  modalContent: ReactNode;
  onClose: () => void;
  onPrimaryButtonClick: () => void;
  onSecondaryButtonClick: () => void;
  primaryButtonConfig?: ButtonConfig;
  secondaryButtonConfig?: ButtonConfig;
  modalWidth?: string;
};

export default function QuickModal({
  isOpen,
  onClose,
  modalContent,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  primaryButtonConfig,
  secondaryButtonConfig,
  modalWidth,
}: Props): ReactElement {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: modalWidth ?? 400,
          // TODO: Test this. Is this MUI theme color? How does it look in dark mode?
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        {modalContent}
        <Box
          id="buttons-section"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {!secondaryButtonConfig?.remove && (
            <Button
              variant="text"
              color="info"
              {...secondaryButtonConfig}
              sx={{ marginRight: "16px" }}
              onClick={onSecondaryButtonClick}
            >
              {secondaryButtonConfig?.label ?? "Cancel"}
            </Button>
          )}
          <Button
            variant="contained"
            {...primaryButtonConfig}
            onClick={onPrimaryButtonClick}
          >
            {primaryButtonConfig?.label ?? "Confirm"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
