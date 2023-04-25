import { Box, Switch, Typography } from "@mui/material";
import { ReactElement } from "react";

type Props = {
  isChecked: boolean;
  label: string;
  onSwitch: (flag: boolean) => void;
};

export default function ReferenceSwitchInput({
  isChecked,
  label,
  onSwitch,
}: Props): ReactElement {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-betweent",
        alignItems: "center",
        width: "100%",
        height: "100%",
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
