import { ChangeEvent, ReactElement, SyntheticEvent, useState } from "react";
import {
  emptyFncWithMsg,
  isEmpty,
  nullthrows,
} from "~/config/utils/nullchecks";
import Box from "@mui/material/Box";
import colors from "~/config/themes/colors";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import { NullableString } from "~/config/types/root_types";
import SearchIcon from "@mui/icons-material/Search";
import { fetchReferenceFromDoi } from "../api/fetchReferenceFromDoi";

type Props = {
  onSearchSuccess: (searchMetaData: any) => void;
};

export default function ReferenceDoiSearchInput({
  onSearchSuccess,
}: Props): ReactElement {
  const [doi, setDoi] = useState<NullableString>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        {"Identifiers"}
      </Typography>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <OutlinedInput
          disabled={isLoading}
          fullWidth
          onChange={(event: ChangeEvent<HTMLInputElement>): void => {
            setDoi(event?.target?.value);
          }}
          placeholder="Enter identifiers (doi)"
          size="small"
          value={doi}
          sx={{
            background: "#fff",
          }}
        />

        <Box
          sx={{
            alignItems: "center",
            cursor: "pointer",
            display: "flex",
            flexDirection: "row",
            width: "40px",
            justifyContent: "flex-end",
            height: "100%",
          }}
          onClick={(event: SyntheticEvent): void => {
            event.preventDefault();
            if (!isEmpty(doi)) {
              setIsLoading(true);
              fetchReferenceFromDoi({
                doi: nullthrows(doi),
                onSuccess: (payload) => {
                  onSearchSuccess(payload);
                  setIsLoading(false);
                },
                onError: (error) => {
                  emptyFncWithMsg(error);
                  setIsLoading(false);
                },
              });
            }
          }}
        >
          {isLoading ? "spin" : <SearchIcon />}
        </Box>
      </Box>
    </Box>
  );
}
