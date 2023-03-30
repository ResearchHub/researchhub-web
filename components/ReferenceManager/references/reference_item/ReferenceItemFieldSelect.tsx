import { ReactElement } from "react";
import Box from "@mui/material/Box";
import colors from "~/config/themes/colors";
import Typography from "@mui/material/Typography";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { isEmpty } from "~/config/utils/nullchecks";

type MenuItemProps = { label: string; value: string };
type Props = {
  formID: string;
  label: string;
  menuItemProps: MenuItemProps[];
  onChange: (value: any) => void;
  placeholder?: string;
  required?: boolean;
  value?: any;
};

export default function ReferenceItemFieldSelect({
  formID,
  label,
  required = false,
  placeholder,
  value = "",
  onChange,
  menuItemProps,
}: Props): ReactElement {
  let referenceTypeMenuEls = menuItemProps.map(
    ({ label, value }: MenuItemProps): ReactElement<typeof MenuItem> => (
      <MenuItem key={`ref-item-field-${value}-${label}`} value={value}>
        {label}
      </MenuItem>
    )
  );

  if (!isEmpty(placeholder)) {
    referenceTypeMenuEls = [
      <MenuItem key="ref-item-field-placeholder" value="">
        <em>{placeholder}</em>
      </MenuItem>,
      ...referenceTypeMenuEls,
    ];
  }

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
      <Select
        displayEmpty
        fullWidth
        id={formID}
        inputProps={{ "aria-label": "Without label" }}
        onChange={(event: SelectChangeEvent): void =>
          onChange(event.target.value)
        }
        sx={{ background: "#fff" }}
        value={value}
        MenuProps={{ MenuListProps: { sx: { height: "320px" } } }}
        size="small"
      >
        {referenceTypeMenuEls}
      </Select>
    </Box>
  );
}
