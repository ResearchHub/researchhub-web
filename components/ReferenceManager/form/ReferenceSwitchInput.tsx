import { Box, Switch, Typography } from "@mui/material";
import { ReactElement } from "react";
import colors from "~/config/themes/colors";

type Props = {
  isChecked: boolean;
  label: string;
  onSwitch: (flag: boolean) => void;
  required?: boolean;
};

export default function ReferenceSwitchInput({
  isChecked,
  label,
  onSwitch,
  required,
}: Props): ReactElement {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        height: "100%",
        justifyContent: "space-betweent",
        marginBottom: "16px",
        width: "100%",
      }}
    >
      <Typography
        color={colors.BLACK(1)}
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
      <Switch
        checked={isChecked}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onSwitch(event.target.checked);
        }}
      />
    </div>
  );
}
