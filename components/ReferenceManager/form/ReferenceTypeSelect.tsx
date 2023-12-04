import { emptyFncWithMsg, isEmpty } from "~/config/utils/nullchecks";
import { fetchReferenceCitationTypes } from "./api/fetchReferenceCitationTypes";
import { NullableString } from "~/config/types/root_types";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { snakeCaseToNormalCase } from "~/config/utils/string";
import Box from "@mui/material/Box";
import colors from "~/config/themes/colors";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";

type Props = {
  formID: string;
  label: string;
  onChange: (value: NullableString) => void;
  placeholder?: string;
  required?: boolean;
  value?: any;
};

export default function ReferenceTypeSelect({
  formID,
  label,
  required = false,
  placeholder,
  value = "",
  onChange,
}: Props): ReactElement {
  const [isFetching, setIsfetching] = useState<boolean>(false);
  const [referenceTypes, setReferenceTypes] = useState<string[]>([]);

  useEffect((): void => {
    setIsfetching(true);
    fetchReferenceCitationTypes({
      onError: emptyFncWithMsg,
      onSuccess: (result: string[]): void => {
        setReferenceTypes(result);
        setIsfetching(false);
      },
    });
  }, [setReferenceTypes, setIsfetching]);

  const referenceTypesSet = useMemo(
    (): Set<string> => new Set(referenceTypes),
    [referenceTypes]
  );
  /* For some instances, value is forcibly given an arbitrary string from parent 
     to override select. We need to sanity check this.*/
  const sanityCheckAndGetValue = (): string => {
    return value;
  };
  const sanityCheckedSelectedRefType = useMemo(
    (): string => sanityCheckAndGetValue(),
    [value]
  );

  const referenceTypeMenuEls = referenceTypes.map(
    (refType: string): ReactElement<typeof MenuItem> => {
      return (
        <MenuItem key={`ref-item-field-${value}-${label}`} value={refType}>
          {snakeCaseToNormalCase(refType)}
        </MenuItem>
      );
    }
  );

  if (!isEmpty(placeholder)) {
    referenceTypeMenuEls.unshift(
      <MenuItem key="ref-item-field-placeholder" value="">
        <em>{placeholder}</em>
      </MenuItem>
    );
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
      {isFetching || isEmpty(referenceTypes) ? null : (
        <Select
          disabled={isFetching}
          displayEmpty
          fullWidth
          id={formID}
          inputProps={{ "aria-label": "Without label" }}
          onChange={(event: SelectChangeEvent): void => {
            onChange(event.target.value ?? "");
          }}
          sx={{ background: "#fff" }}
          value={isFetching ? "" : sanityCheckedSelectedRefType}
          MenuProps={{ MenuListProps: { sx: { height: "320px" } } }}
          size="small"
        >
          {referenceTypeMenuEls}
        </Select>
      )}
    </Box>
  );
}
