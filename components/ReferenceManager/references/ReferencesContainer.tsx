import {
  Box,
  IconButton,
  InputAdornment,
  Typography,
  OutlinedInput,
} from "@mui/material";
import { Fragment, useState, ReactNode } from "react";
import BasicTogglableNavbarLeft, {
  LEFT_MAX_NAV_WIDTH,
  LEFT_MIN_NAV_WIDTH,
} from "../basic_page_layout/BasicTogglableNavbarLeft";
import ReferenceItemDrawer from "./reference_item/ReferenceItemDrawer";
import ReferencesTable from "./reference_table/ReferencesTable";
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";

interface Props {}

export default function ReferencesContainer({}: Props): ReactNode {
  const userAllowed = gateKeepCurrentUser({
    application: "REFERENCE_MANAGER",
    shouldRedirect: true,
  });
  const [searchText, setSearchText] = useState<string | null>(null);
  const [isLeftNavOpen, setIsLeftNavOpen] = useState<boolean>(true);

  const leftNavWidth = isLeftNavOpen ? LEFT_MAX_NAV_WIDTH : LEFT_MIN_NAV_WIDTH;
  if (!userAllowed) {
    return null;
  } else {
    return (
      <Fragment>
        <ReferenceItemDrawer />
        <Box flexDirection="row" display="flex">
          <BasicTogglableNavbarLeft
            isOpen={isLeftNavOpen}
            navWidth={leftNavWidth}
            setIsOpen={setIsLeftNavOpen}
            // theme={theme}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "32px 32px",
              width: "100%",
            }}
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
        </Box>
      </Fragment>
    );
  }
}
