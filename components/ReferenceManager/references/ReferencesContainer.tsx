import {
  Box,
  IconButton,
  InputAdornment,
  Typography,
  OutlinedInput,
} from "@mui/material";
import { connect } from "react-redux";
import { Fragment, useState, ReactNode, useEffect } from "react";
import { MessageActions } from "~/redux/message";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { useRouter } from "next/router";
import api, { generateApiUrl } from "~/config/api";
import BasicTogglableNavbarLeft, {
  LEFT_MAX_NAV_WIDTH,
  LEFT_MIN_NAV_WIDTH,
} from "../basic_page_layout/BasicTogglableNavbarLeft";
import DroppableZone from "~/components/DroppableZone";
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";
import ReferenceItemDrawer from "./reference_item/ReferenceItemDrawer";
import ReferenceManualUploadDrawer from "./reference_uploader/ReferenceManualUploadDrawer";
import ReferencesTable from "./reference_table/ReferencesTable";
import withWebSocket from "~/components/withWebSocket";

interface Props {
  showMessage: ({ show, load }) => void;
  wsResponse: {};
  wsConnected: boolean;
}

type Preload = {
  citation_type: string;
  id: string;
  created: boolean;
};

function ReferencesContainer({
  showMessage,
  wsResponse,
  wsConnected,
}: Props): ReactNode {
  const userAllowed = gateKeepCurrentUser({
    application: "REFERENCE_MANAGER",
    shouldRedirect: true,
  });
  const router = useRouter();
  const currentProjectName = router.query.project_name;
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
    formData.append("organization_id", currentOrg?.id);
    formData.append("project_id", router?.query?.project);
    const url = generateApiUrl("citation_entry/pdf_uploads");
    const preload: Array<Preload> = [];
    acceptedFiles.map(() => {
      const uuid = window.URL.createObjectURL(new Blob([])).substring(31);
      preload.push({
        citation_type: "LOADING",
        id: uuid,
        created: true,
      });
    });

    setCreatedReferences(preload);
    const resp = fetch(url, api.POST_FILE_CONFIG(formData));
    setLoading(false);
  };

  useEffect(() => {
    if (wsResponse) {
      const newReferences = [...createdReferences];
      const ind = newReferences.findIndex((reference) => {
        return reference.citation_type === "LOADING";
      });
      const createdCitationJson = JSON.parse(wsResponse).created_citation;
      newReferences[ind] = createdCitationJson;
      setCreatedReferences(newReferences);
    }
  }, [wsResponse]);

  if (!userAllowed) {
    return <Fragment />;
  } else {
    return (
      <Fragment>
        {/* TODO: calvinhlee - move this to context */}
        <ReferenceManualUploadDrawer key="root-nav" />
        <ReferenceItemDrawer />
        <Box flexDirection="row" display="flex" maxWidth={"calc(100vw - 79px)"}>
          <BasicTogglableNavbarLeft
            isOpen={isLeftNavOpen}
            navWidth={leftNavWidth}
            setIsOpen={setIsLeftNavOpen}
            // theme={theme}
          />
          <DroppableZone
            multiple
            noClick
            handleFileDrop={handleFileDrop}
            accept=".pdf"
          >
            <div style={{ marginBottom: 32 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {currentProjectName ?? "All References"}
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
                          <IconButton edge="end">
                            <i
                              className="fa-regular fa-magnifying-glass"
                              style={{ fontSize: 16 }}
                            ></i>
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </div>
                  <ReferencesTable createdReferences={createdReferences} />
                </div>
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

export default withWebSocket(
  connect(null, mapDispatchToProps)(ReferencesContainer)
);
