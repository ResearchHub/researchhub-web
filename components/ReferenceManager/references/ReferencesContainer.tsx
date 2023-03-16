import {
  Box,
  IconButton,
  InputAdornment,
  Typography,
  OutlinedInput,
} from "@mui/material";
import { useState } from "react";
import { ReferencesTabContextProvider } from "./context/ReferencesTabContext";
import DropdownMenu from "../shared/menu/DropdownMenu";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ReferenceItemTab from "./reference_item/ReferenceItemTab";
import ReferencesTable from "./ReferencesTable";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import type { ReactElement } from "react";

interface Props {}

export default function ReferencesContainer({}: Props): ReactElement {
  const [searchText, setSearchText] = useState<string | null>(null);
  return (
    <ReferencesTabContextProvider>
      <ReferenceItemTab />
      <Box
        sx={{ display: "flex", flexDirection: "column", padding: "16px 0 0" }}
      >
        <div style={{ marginBottom: 32 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {"All References"}
          </Typography>
        </div>
        <Box className="ReferencesContainerMain">
          <Box
            className="ReferencesContainerTitleSection"
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              height: 44,
              marginBottom: "20px",
            }}
          >
            <DropdownMenu
              menuItemProps={[
                { itemLabel: "File(s) from computer", onClick: () => {} },
                { itemLabel: "Import library", onClick: () => {} },
              ]}
              menuLabel={
                <div
                  style={{
                    alignItems: "center",
                    color: "rgba(170, 168, 180, 1)",
                    display: "flex",
                    justifyContent: "space-between",
                    width: 68,
                    height: 26,
                    boxSizing: "border-box",
                  }}
                >
                  <TableChartOutlinedIcon
                    fontSize="medium"
                    sx={{ color: "#7C7989" }}
                  />
                  <ExpandMore fontSize="medium" sx={{ color: "#AAA8B4" }} />
                </div>
              }
              size="medium"
            />
            <div
              className="ReferenceContainerSearchFieldWrap"
              style={{
                maxWidth: 400,
                width: "100%",
              }}
            >
              <OutlinedInput
                fullWidth
                label={searchText && "Search"}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  // TODO: calvinhlee - create a MUI convenience function for handling target values
                  setSearchText(event.target.value);
                }}
                placeholder="Search..."
                size="small"
                sx={{
                  borderColor: "#E9EAEF",
                  background: "rgba(250, 250, 252, 1)",
                  "&:hover": {
                    borderColor: "#E9EAEF",
                  },
                }}
                inputProps={{
                  sx: {
                    border: "0px !important",
                    "&:hover": {
                      border: "0px",
                    },
                  },
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                    >
                      <i
                        className="fa-regular fa-magnifying-glass"
                        style={{ fontSize: 16 }}
                      ></i>
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>
          </Box>
          <ReferencesTable />
        </Box>
      </Box>
    </ReferencesTabContextProvider>
  );
}
