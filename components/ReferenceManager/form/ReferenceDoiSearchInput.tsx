import { ChangeEvent, ReactElement, SyntheticEvent, useState } from "react";
import { ClipLoader } from "react-spinners";
import {
  emptyFncWithMsg,
  isEmpty,
  nullthrows,
} from "~/config/utils/nullchecks";
import { fetchReferenceFromDoi } from "./api/fetchReferenceFromDoi";
import { isStringURL } from "~/config/utils/isStringURL";
import { NullableString } from "~/config/types/root_types";
import Box from "@mui/material/Box";
import colors from "~/config/themes/colors";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import { fetchReferenceFromUrl } from "./api/fetchReferenceFromUrl";

type Props = {
  onSearchSuccess: (searchMetaData: any) => void;
};

export default function ReferenceDoiSearchInput({
  onSearchSuccess,
}: Props): ReactElement {
  const [doiOrUrl, setDoiOrUrl] = useState<NullableString>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const executeSearch = (): void => {
    if (!isEmpty(doiOrUrl)) {
      const isUrl = isStringURL(doiOrUrl ?? "");
      setIsLoading(true);
      if (isUrl) {
        fetchReferenceFromUrl({
          onSuccess: (payload) => {
            onSearchSuccess(payload);
            setIsLoading(false);
          },
          onError: (error) => {
            emptyFncWithMsg(error);
            setIsLoading(false);
          },
          url: nullthrows(doiOrUrl),
        });
      } else {
        fetchReferenceFromDoi({
          doi: nullthrows(doiOrUrl),
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
        {"Identifiers (doi or url)"}
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
            setDoiOrUrl(event?.target?.value);
          }}
          onKeyDown={(event): void => {
            if (event.key === "Enter" || event?.keyCode === 13) {
              executeSearch();
            }
          }}
          placeholder="Enter identifiers (doi)"
          size="small"
          value={doiOrUrl}
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
