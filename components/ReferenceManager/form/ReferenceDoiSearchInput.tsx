import { ChangeEvent, ReactElement, SyntheticEvent, useState } from "react";
import { ClipLoader } from "react-spinners";
import { fetchReferenceFromDoi } from "./api/fetchReferenceFromDoi";
import { fetchReferenceFromUrl } from "./api/fetchReferenceFromUrl";
import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import { isStringURL } from "~/config/utils/isStringURL";
import { NullableString } from "~/config/types/root_types";
import Box from "@mui/material/Box";
import colors from "~/config/themes/colors";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";

type Props = {
  onSearchSuccess: (searchMetaData: any) => void;
};

export default function ReferenceDoiSearchInput({
  onSearchSuccess,
}: Props): ReactElement {
  const [doiOrUrl, setDoiOrUrl] = useState<NullableString>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchFailMsg, setSearchFailMsg] = useState<NullableString>(null);

  const executeSearch = (inputtedDoiOrURL): void => {
    const doi = inputtedDoiOrURL || doiOrUrl;
    if (!isEmpty(doi)) {
      const isUrl = isStringURL(doi ?? "");
      setIsLoading(true);
      if (isUrl) {
        fetchReferenceFromUrl({
          onSuccess: (payload) => {
            onSearchSuccess(payload);
            setIsLoading(false);
            setSearchFailMsg(null);
          },
          onError: (error) => {
            setSearchFailMsg(
              "URL not found. Try different url or update manually below"
            );
            setIsLoading(false);
          },
          url: nullthrows(doi),
        });
      } else {
        fetchReferenceFromDoi({
          doi: nullthrows(doi),
          onError: (error) => {
            setSearchFailMsg(
              "DOI not found. Try different doi or update manually below"
            );
            setIsLoading(false);
          },
          onSuccess: (payload) => {
            onSearchSuccess(payload);
            setIsLoading(false);
            setSearchFailMsg(null);
          },
        });
      }
    }
  };

  return (
    <Box
      sx={{
        background: "transparent",
        minHeight: "72px",
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
        {"Identifiers (doi / url)"}
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
          onPaste={(e) => {
            const pastedText = e.clipboardData.getData("Text");
            setDoiOrUrl(pastedText);
            if (pastedText) {
              executeSearch(pastedText);
            }
          }}
          onKeyDown={(event): void => {
            if (event.key === "Enter" || event?.keyCode === 13) {
              executeSearch();
            }
          }}
          placeholder="Enter identifiers (doi or url)"
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
      {!isEmpty(searchFailMsg) && (
        <div
          style={{
            color: colors.RED(),
            width: "100%",
            fontSize: 14,
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          {searchFailMsg}
        </div>
      )}
    </Box>
  );
}
