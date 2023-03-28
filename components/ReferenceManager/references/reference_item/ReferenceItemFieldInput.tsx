import { ChangeEvent, ReactElement } from "react";
import { silentEmptyFnc } from "~/config/utils/nullchecks";
import Box from "@mui/material/Box";
import colors from "~/config/themes/colors";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";

type Props = {
  formID: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: any;
  onChange: (value: any) => void;
};

export default function ReferenceItemFieldInput({
  formID,
  label,
  required = false,
  placeholder,
  value = "",
  onChange,
}: Props): ReactElement {
  return (
    <Box
      sx={{
        background: "transparent",
        height: "78px",
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
        fullWidth
        onClick={silentEmptyFnc}
        id={formID}
        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
          onChange(event?.target?.value);
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
