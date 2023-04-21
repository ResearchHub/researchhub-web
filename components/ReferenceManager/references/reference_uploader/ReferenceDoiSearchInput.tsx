import {
  ChangeEvent,
  KeyboardEventHandler,
  ReactElement,
  SyntheticEvent,
  useState,
} from "react";
import {
  emptyFncWithMsg,
  isEmpty,
  nullthrows,
} from "~/config/utils/nullchecks";
import { fetchReferenceFromDoi } from "../api/fetchReferenceFromDoi";
import { NullableString } from "~/config/types/root_types";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import { ClipLoader } from "react-spinners";
import colors from "~/config/themes/colors";

type Props = {
  onSearchSuccess: (searchMetaData: any) => void;
};

export default function ReferenceDoiSearchInput({
  onSearchSuccess,
}: Props): ReactElement {
  const [doi, setDoi] = useState<NullableString>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const executeSearch = (): void => {
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
  };

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
        {"Identifiers (doi)"}
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
          onKeyDown={(event): void => {
            if (event.key === "Enter" || event?.keyCode === 13) {
              executeSearch();
            }
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
            executeSearch();
          }}
        >
          {isLoading ? (
            <ClipLoader color={colors.NEW_BLUE(1)} size={14} />
          ) : (
            <SearchIcon />
          )}
        </Box>
      </Box>
    </Box>
  );
}
