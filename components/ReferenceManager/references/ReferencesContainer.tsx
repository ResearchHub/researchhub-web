import {
  Box,
  IconButton,
  InputAdornment,
  Typography,
  OutlinedInput,
} from "@mui/material";
import {
  DEFAULT_PROJECT_VALUES,
  useReferenceProjectUpsertContext,
} from "./reference_organizer/context/ReferenceProjectsUpsertContext";
import { Fragment, useState, ReactNode, useEffect } from "react";
import { connect } from "react-redux";
import {
  emptyFncWithMsg,
  isEmpty,
  isNullOrUndefined,
} from "~/config/utils/nullchecks";
import { fetchReferenceOrgProjects } from "./reference_organizer/api/fetchReferenceOrgProjects";
import { MessageActions } from "~/redux/message";
import { parseUserSuggestion } from "~/components/SearchSuggestion/lib/types";
import { removeReferenceCitations } from "./api/removeReferenceCitations";
import { StyleSheet } from "aphrodite";
import { toast } from "react-toastify";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { useReferenceTabContext } from "./reference_item/context/ReferenceItemDrawerContext";
import { useReferenceUploadDrawerContext } from "./reference_uploader/context/ReferenceUploadDrawerContext";
import { useRouter } from "next/router";
import BasicTogglableNavbarLeft, {
  LEFT_MAX_NAV_WIDTH,
  LEFT_MIN_NAV_WIDTH,
} from "../basic_page_layout/BasicTogglableNavbarLeft";
import api, { generateApiUrl } from "~/config/api";
import AddIcon from "@mui/icons-material/Add";
import DroppableZone from "~/components/DroppableZone";
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";
import ReferenceItemDrawer from "./reference_item/ReferenceItemDrawer";
import ReferenceManualUploadDrawer from "./reference_uploader/ReferenceManualUploadDrawer";
import ReferencesTable from "./reference_table/ReferencesTable";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import DropdownMenu from "../menu/DropdownMenu";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListIcon from "@mui/icons-material/List";
import withWebSocket from "~/components/withWebSocket";
import QuickModal from "../menu/QuickModal";
import ReferencesBibliographyModal from "./reference_bibliography/ReferencesBibliographyModal";
import { useReferenceActiveProjectContext } from "./reference_organizer/context/ReferenceActiveProjectContext";
import { ID } from "~/config/types/root_types";

interface Props {
  showMessage: ({ show, load }) => void;
  wsResponse: string;
  wsConnected: boolean;
  setMessage?: any;
}

type Preload = {
  citation_type: string;
  id: string;
  created: boolean;
};

const useEffectFetchOrgProjects = ({
  fetchTime,
  onError,
  onSuccess,
  orgID,
  setIsFethingProjects,
}) => {
  useEffect((): void => {
    if (!isEmpty(orgID)) {
      setIsFethingProjects(true);
      fetchReferenceOrgProjects({
        onError,
        onSuccess,
        payload: {
          organization: orgID,
        },
      });
    }
  }, [orgID, fetchTime]);
};

const useEffectSetActiveProject = ({
  currentOrgProjects,
  isFetchingProjects,
  router,
  setActiveProject,
}): void => {
  const urlProjectID = parseInt(router.query.project);
  const findNestedTargetProject = (allProjects: any[], targetProjectID: ID) => {
    for (const project of allProjects) {
      if (project.id === targetProjectID) {
        return project;
      }
      const projectChildren = project.children;
      if (!isEmpty(projectChildren)) {
        const childTarget = findNestedTargetProject(
          projectChildren,
          targetProjectID
        );
        if (!isNullOrUndefined(childTarget)) {
          return childTarget;
        }
      }
    }
  };

  useEffect((): void => {
    if (!isFetchingProjects) {
      const activeProject = findNestedTargetProject(
        currentOrgProjects,
        urlProjectID
      );
      if (isNullOrUndefined(activeProject)) {
        setActiveProject({ DEFAULT_PROJECT_VALUES });
      } else {
        const {
          collaborators: { editors, viewers },
          id,
          project_name,
          is_public,
        } = activeProject ?? { collaborators: { editors: [], viewers: [] } };
        setActiveProject({
          collaborators: [
            ...editors.map((rawUser: any) => {
              return {
                ...parseUserSuggestion(rawUser),
                role: "EDITOR",
              };
            }),
            ...viewers.map((rawUser: any) => {
              return {
                ...parseUserSuggestion(rawUser),
                role: "VIEWER",
              };
            }),
          ],
          projectID: id,
          projectName: project_name,
          isPublic: is_public,
        });
      }
    }
  }, [urlProjectID, isFetchingProjects]);
};

// TODO: @lightninglu10 - fix TS.
function ReferencesContainer({
  showMessage,
  setMessage,
  wsResponse,
  wsConnected,
}: Props): ReactNode {
  const userAllowed = gateKeepCurrentUser({
    application: "REFERENCE_MANAGER",
    shouldRedirect: true,
  });
  const { currentOrg } = useOrgs();
  const router = useRouter();

  const { activeProject, setActiveProject } =
    useReferenceActiveProjectContext();
  const { setReferencesFetchTime } = useReferenceTabContext();
  const {
    projectsFetchTime,
    setIsModalOpen: setIsProjectUpsertModalOpen,
    setProjectValue: setProjectUpsertValue,
    setUpsertPurpose: setProjectUpsertPurpose,
  } = useReferenceProjectUpsertContext();
  const { setIsDrawerOpen: setIsRefUploadDrawerOpen } =
    useReferenceUploadDrawerContext();

  const [currentOrgProjects, setCurrentOrgProjects] = useState<any[]>([]);
  const [isFetchingProjects, setIsFethingProjects] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [isLeftNavOpen, setIsLeftNavOpen] = useState<boolean>(true);
  const [createdReferences, setCreatedReferences] = useState<any[]>([]);
  const [selectedReferenceIDs, setSelectedReferenceIDs] = useState<any[]>([]);
  const [isRemoveRefModalOpen, setIsRemoveRefModalOpen] =
    useState<boolean>(false);
  const [isBibModalOpen, setIsBibModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const leftNavWidth = isLeftNavOpen ? LEFT_MAX_NAV_WIDTH : LEFT_MIN_NAV_WIDTH;
  const currentProjectName = activeProject?.projectName ?? null;
  const currentOrgID = currentOrg?.id ?? null;

  useEffectFetchOrgProjects({
    fetchTime: projectsFetchTime,
    onError: emptyFncWithMsg,
    onSuccess: (payload): void => {
      setCurrentOrgProjects(payload ?? []);
      setIsFethingProjects(false);
    },
    orgID: currentOrgID,
    setIsFethingProjects,
  });
  useEffectSetActiveProject({
    currentOrgProjects,
    router,
    setActiveProject,
    isFetchingProjects,
  });

  const handleFileDrop = async (acceptedFiles) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("pdfs[]", file);
    });
    // @ts-ignore TODO: fix
    formData.append("organization_id", currentOrg.id);
    if (router.query.project) {
      // @ts-ignore TODO: fix
      formData.append("project_id", router.query.project);
    }
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
      const wsJson = JSON.parse(wsResponse);
      const createdCitationJson = wsJson.created_citation;

      if (wsJson.dupe_citation) {
        newReferences.splice(ind, 1);
        toast(
          <div style={{ fontSize: 16, textAlign: "center" }}>
            Citation for <br />
            <br />
            <strong style={{ fontWeight: 600 }}>
              {createdCitationJson.fields.title}
            </strong>{" "}
            <br />
            <br />
            already exists!
          </div>,
          {
            position: "top-center",
            autoClose: 5000,
            progressStyle: { background: colors.NEW_BLUE() },
            hideProgressBar: false,
          }
        );
      } else {
        newReferences[ind] = createdCitationJson;
      }

      setCreatedReferences(newReferences);
    }
  }, [wsResponse]);

  if (!userAllowed) {
    return <Fragment />;
  } else {
    return (
      <>
        <QuickModal
          isOpen={isRemoveRefModalOpen}
          modalContent={
            <Box sx={{ height: "80px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography id="modal-modal-title" variant="h6">
                  {`Are you sure you want to remove selected reference${
                    selectedReferenceIDs.length > 1 ? "s" : ""
                  }?`}
                </Typography>
              </Box>
            </Box>
          }
          modalWidth="300px"
          onPrimaryButtonClick={(): void => {
            removeReferenceCitations({
              onError: emptyFncWithMsg,
              onSuccess: (): void => {
                setReferencesFetchTime(Date.now());
                setIsRemoveRefModalOpen(false);
              },
              payload: {
                citation_entry_ids: selectedReferenceIDs,
              },
            });
          }}
          onSecondaryButtonClick={(): void => setIsRemoveRefModalOpen(false)}
          onClose={(): void => setIsRemoveRefModalOpen(false)}
          primaryButtonConfig={{ label: "Remove" }}
        />
        <ReferencesBibliographyModal
          isOpen={isBibModalOpen}
          onClose={(): void => setIsBibModalOpen(false)}
          selectedReferenceIDs={selectedReferenceIDs}
        />
        <ReferenceManualUploadDrawer key="root-nav" />
        <ReferenceItemDrawer />
        <Box flexDirection="row" display="flex" maxWidth={"calc(100vw - 79px)"}>
          <BasicTogglableNavbarLeft
            currentOrgProjects={currentOrgProjects}
            isOpen={isLeftNavOpen}
            navWidth={leftNavWidth}
            setIsOpen={setIsLeftNavOpen}
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
              <div
                style={{
                  marginBottom: 32,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {currentProjectName ??
                    (!isEmpty(router.query?.org_refs)
                      ? "Organization References"
                      : `My References`)}
                </Typography>
                <div
                  style={{
                    marginLeft: 8,
                    background: colors.GREY(0.7),
                    borderRadius: "50%",
                    height: 24,
                    color: "#fff",
                    width: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => setIsRefUploadDrawerOpen(true)}
                >
                  <AddIcon fontSize="small" sx={{ color: "AAA8B4" }} />
                </div>
                {!isEmpty(router.query.project) && (
                  <Button
                    variant="outlined"
                    fontSize="small"
                    size="small"
                    customButtonStyle={styles.shareButton}
                    onClick={(): void => {
                      setProjectUpsertPurpose("update");
                      setProjectUpsertValue({
                        ...DEFAULT_PROJECT_VALUES,
                        ...activeProject,
                      });
                      setIsProjectUpsertModalOpen(true);
                    }}
                  >
                    <Typography variant="h6" fontSize={"16px"}>
                      {"Share"}
                    </Typography>
                  </Button>
                )}
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
                    style={
                      isEmpty(selectedReferenceIDs)
                        ? { visibility: "hidden" }
                        : undefined
                    }
                  >
                    <DropdownMenu
                      menuItemProps={[
                        {
                          itemLabel: `Export reference${
                            selectedReferenceIDs.length > 1 ? "s" : ""
                          }`,
                          onClick: () => {
                            setIsBibModalOpen(true);
                          },
                        },
                        {
                          itemLabel: (
                            <Typography color="red">{`Remove reference${
                              selectedReferenceIDs.length > 1 ? "s" : ""
                            }`}</Typography>
                          ),
                          onClick: () => {
                            setIsRemoveRefModalOpen(true);
                          },
                        },
                      ]}
                      menuLabel={
                        <div
                          style={{
                            alignItems: "center",
                            color: "rgba(170, 168, 180, 1)",
                            display: "flex",
                            justifyContent: "space-between",
                            width: 68,
                            height: 36,
                            padding: 6,
                            boxSizing: "border-box",
                          }}
                        >
                          <ListIcon
                            fontSize="medium"
                            sx={{ color: "#AAA8B4" }}
                          />
                          <ExpandMore
                            fontSize="medium"
                            sx={{ color: "#AAA8B4" }}
                          />
                        </div>
                      }
                      size="medium"
                    />
                  </div>
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
                </Box>
                <ReferencesTable
                  createdReferences={createdReferences}
                  // @ts-ignore TODO: @@lightninglu10 - fix TS.
                  handleFileDrop={handleFileDrop}
                  setSelectedReferenceIDs={setSelectedReferenceIDs}
                />
              </Box>
            </Box>
          </DroppableZone>
        </Box>
        {/* <ToastContainer
          autoClose={true}
          closeOnClick
          hideProgressBar={false}
          newestOnTop
          containerId={"reference-toast"}
          position="top-center"
          autoClose={5000}
          progressStyle={{ background: colors.NEW_BLUE() }}
        ></ToastContainer> */}
      </>
    );
  }
}

const styles = StyleSheet.create({
  shareButton: {
    marginLeft: "auto",
  },
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default withWebSocket(
  // @ts-ignore - faulty legacy connect hook
  connect(null, mapDispatchToProps)(ReferencesContainer)
);
