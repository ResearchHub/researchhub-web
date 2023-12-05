import { Box, Modal } from "@mui/material";
import { StyleSheet } from "aphrodite";
import { Fragment, ReactElement, ReactNode } from "react";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";

type ButtonConfig = {
  label?: ReactNode;
  remove?: boolean;
  size?: "small" | "med" | "large";
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
            gap: "16px",
          }}
        >
          {!secondaryButtonConfig?.remove && (
            <Button
              variant="text"
              {...secondaryButtonConfig}
              label={null}
              customLabelStyle={secondaryButtonStyles.button}
              onClick={onSecondaryButtonClick}
            >
              {secondaryButtonConfig?.label ?? "Cancel"}
            </Button>
          )}
          <Button
            variant="contained"
            {...primaryButtonConfig}
            label={null}
            onClick={onPrimaryButtonClick}
          >
            {primaryButtonConfig?.label ?? "Confirm"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

const secondaryButtonStyles = StyleSheet.create({
  button: {
    color: colors.NEW_BLUE(),
  },
});
