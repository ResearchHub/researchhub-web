import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import { ChangeEvent, ReactElement } from "react";
import { NullableString } from "~/config/types/root_types";

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
        background: "inherit",
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
        sx={{ background: "inherit" }}
        width="100%"
      >
        {label}
      </Typography>
      <OutlinedInput
        fullWidth
        id={formID}
        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
          onChange(event?.target?.value);
        }}
        placeholder={placeholder}
        required={required}
        size="small"
        value={value}
        sx={{
          background: "rgb(243 243 246)",
        }}
      />
    </Box>
  );
}
