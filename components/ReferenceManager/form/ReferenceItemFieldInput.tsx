import { ChangeEvent, ReactElement } from "react";
import {
  isNullOrUndefined,
  nullthrows,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";
import Box from "@mui/material/Box";
import colors from "~/config/themes/colors";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";

export type InputProps = {
  disabled?: boolean;
  formID: string;
  label: string;
  onChange?: (value: any) => void;
  placeholder?: string;
  required?: boolean;
  value?: any;
};

export default function ReferenceItemFieldInput({
  disabled,
  formID,
  label,
  onChange,
  placeholder,
  required = false,
  value = "",
}: InputProps): ReactElement {
  return (
    <Box
      sx={{
        background: "transparent",
        height: "72px",
        marginBottom: "16px",
        width: "100%",
      }}
    >
      <Typography
        color="rgba(36, 31, 58, 1)"
        fontSize="14px"
        fontWeight={600}
        lineHeight="22px"
        letterSpacing={0}
        mb="4px"
        sx={{ background: "transparent" }}
        width="100%"
      >
        {label}
        {required ? <span style={{ color: colors.BLUE() }}>{"*"}</span> : null}
      </Typography>
      <OutlinedInput
        disabled={Boolean(disabled)}
        fullWidth
        onClick={silentEmptyFnc}
        id={formID}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange && onChange(event?.target?.value);
        }}
        placeholder={placeholder}
        required={required}
        size="small"
        value={value}
        sx={{
          background: "#fff",
        }}
      />
    </Box>
  );
}
