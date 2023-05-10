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
import ReferenceManualUploadDrawer from "./reference_uploader/ReferenceManualUploadDrawer";
import DroppableZone from "~/components/DroppableZone";
import api, { generateApiUrl } from "~/config/api";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { connect } from "react-redux";
import { MessageActions } from "~/redux/message";

interface Props {
  showMessage: ({ show, load }) => void;
}

function ReferencesContainer({ showMessage }: Props): ReactNode {
  const userAllowed = gateKeepCurrentUser({
    application: "REFERENCE_MANAGER",
    shouldRedirect: true,
  });
  const [searchText, setSearchText] = useState<string | null>(null);
  const [isLeftNavOpen, setIsLeftNavOpen] = useState<boolean>(true);
  const [createdReferences, setCreatedReferences] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isManualUploadDrawerOpen, setIsManualUploadDrawerOpen] =
    useState<boolean>(false);
  const leftNavWidth = isLeftNavOpen ? LEFT_MAX_NAV_WIDTH : LEFT_MIN_NAV_WIDTH;
  const { currentOrg } = useOrgs();

  const handleFileDrop = async (acceptedFiles) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("pdfs[]", file);
    });
    formData.append("organization_id", currentOrg.id);
    // formData.append('project_id', )
    const url = generateApiUrl("citation_entry/pdf_uploads");
    const preload = [];

    acceptedFiles.map(() => {
      const uuid = window.URL.createObjectURL(new Blob([])).substring(31);
      preload.push({
        citation_type: "LOADING",
        id: uuid,
      });
    });

    setCreatedReferences(preload);
    const resp = await fetch(url, api.POST_FILE_CONFIG(formData));
    const json = await resp.json();
    setLoading(false);
    setCreatedReferences(json.created);
  };

  if (!userAllowed) {
    return <Fragment />;
  } else {
    return (
      <Fragment>
        {/* TODO: calvinhlee - move this to context */}
        <ReferenceManualUploadDrawer
          drawerProps={{
            isDrawerOpen: isManualUploadDrawerOpen,
            setIsDrawerOpen: setIsManualUploadDrawerOpen,
          }}
          key="root-nav"
        />

        <ReferenceItemDrawer />
        <Box flexDirection="row" display="flex" maxWidth={"calc(100vw - 79px)"}>
          <BasicTogglableNavbarLeft
            isOpen={isLeftNavOpen}
            navWidth={leftNavWidth}
            setIsOpen={setIsLeftNavOpen}
            setIsManualUploadDrawerOpen={setIsManualUploadDrawerOpen}
            // theme={theme}
          />
          <DroppableZone
            multiple
            noClick
            handleFileDrop={handleFileDrop}
            accept=".pdf"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "32px 32px",
                width: "100%",
                overflow: "auto",
                boxSizing: "border-box",
                flex: 1,
              }}
              className={"references-section"}
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
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
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
                <ReferencesTable createdReferences={createdReferences} />
              </Box>
            </Box>
          </DroppableZone>
        </Box>
      </Fragment>
    );
  }
}

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
};

export default connect(null, mapDispatchToProps)(ReferencesContainer);
