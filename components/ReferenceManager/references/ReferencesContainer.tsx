import { Box, Typography } from "@mui/material";
import ReactTooltip from "react-tooltip";
import {
  DEFAULT_PROJECT_VALUES,
  useReferenceProjectUpsertContext,
} from "./reference_organizer/context/ReferenceProjectsUpsertContext";
import { Fragment, useState, ReactNode, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  emptyFncWithMsg,
  isEmpty,
  isNullOrUndefined,
  nullthrows,
} from "~/config/utils/nullchecks";
import { fetchReferenceOrgProjects } from "./reference_organizer/api/fetchReferenceOrgProjects";
import { MessageActions } from "~/redux/message";
import { parseUserSuggestion } from "~/components/SearchSuggestion/lib/types";
import { removeReferenceCitations } from "./api/removeReferenceCitations";
import { StyleSheet, css } from "aphrodite";
import { toast } from "react-toastify";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { useReferenceTabContext } from "./reference_item/context/ReferenceItemDrawerContext";
import { useReferenceUploadDrawerContext } from "./reference_uploader/context/ReferenceUploadDrawerContext";
import { useRouter } from "next/router";
import api, { generateApiUrl } from "~/config/api";
import BasicTogglableNavbarLeft, {
  LEFT_MAX_NAV_WIDTH,
  LEFT_MIN_NAV_WIDTH,
} from "../basic_page_layout/BasicTogglableNavbarLeft";
import DropdownMenu from "../menu/DropdownMenu";
import DroppableZone from "~/components/DroppableZone";
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";
import ReferenceItemDrawer from "./reference_item/ReferenceItemDrawer";
import ReferenceManualUploadDrawer from "./reference_uploader/ReferenceManualUploadDrawer";
import ReferencesBibliographyModal from "./reference_bibliography/ReferencesBibliographyModal";
import ReferencesTable from "./reference_table/ReferencesTable";
import Button from "~/components/Form/Button";
import withWebSocket from "~/components/withWebSocket";
import QuickModal from "../menu/QuickModal";
import { useReferenceActiveProjectContext } from "./reference_organizer/context/ReferenceActiveProjectContext";
import { ID } from "~/config/types/root_types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faFolderPlus,
  faPlus,
  faTrashXmark,
} from "@fortawesome/pro-light-svg-icons";

import colors from "~/config/themes/colors";
import AuthorFacePile from "~/components/shared/AuthorFacePile";
import ManageOrgModal from "~/components/Org/ManageOrgModal";
import { removeReferenceProject } from "./reference_organizer/api/removeReferenceProject";
import { pluralize } from "~/config/utils/misc";
import Link from "next/link";

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
  const { currentOrg, refetchOrgs } = useOrgs();
  const router = useRouter();

  const { activeProject, currentOrgProjects } =
    useReferenceActiveProjectContext();
  const { setReferencesFetchTime } = useReferenceTabContext();
  const {
    resetProjectsFetchTime,
    projectsFetchTime,
    setIsModalOpen: setIsProjectUpsertModalOpen,
    setProjectValue: setProjectUpsertValue,
    setUpsertPurpose: setProjectUpsertPurpose,
  } = useReferenceProjectUpsertContext();
  const {
    setIsDrawerOpen: setIsRefUploadDrawerOpen,
    setProjectID: setProjectIDForUploadDrawer,
  } = useReferenceUploadDrawerContext();

  const [isOrgModalOpen, setIsOrgModalOpen] = useState<boolean>(false);
  const [isLeftNavOpen, setIsLeftNavOpen] = useState<boolean>(true);
  const [createdReferences, setCreatedReferences] = useState<any[]>([]);
  const [selectedReferenceIDs, setSelectedReferenceIDs] = useState<any[]>([]);
  const [selectedFolderIds, setSelectedFolderIds] = useState<any[]>([]);
  const [isRemoveRefModalOpen, setIsRemoveRefModalOpen] =
    useState<boolean>(false);
  const [isBibModalOpen, setIsBibModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const leftNavWidth = isLeftNavOpen ? LEFT_MAX_NAV_WIDTH : LEFT_MIN_NAV_WIDTH;
  const currentOrgID = currentOrg?.id ?? null;
  const isOnOrgTab = !isEmpty(router.query?.org_refs);
  const onOrgUpdate = (): void => {
    refetchOrgs();
    setIsOrgModalOpen(false);
  };
  const onShareClick = (): void => {
    setProjectUpsertPurpose("update");
    setProjectUpsertValue({
      ...DEFAULT_PROJECT_VALUES,
      ...activeProject,
    });
    setIsProjectUpsertModalOpen(true);
  };
  const inputRef = useRef();

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [selectedReferenceIDs]);

  const getPresignedUrl = async (fileName, organizationID, projectID) => {
    const url = generateApiUrl("citation_entry/upload_pdfs");
    const resp = await fetch(
      url,
      api.POST_CONFIG({
        filename: fileName,
        organization_id: organizationID,
        project_id: projectID,
      })
    );

    return await resp.json();
  };

  const handleFileDrop = async (acceptedFiles) => {
    const fileNames = [];
    acceptedFiles.forEach(async (file) => {
      const preSignedUrl = await getPresignedUrl(
        file.name,
        nullthrows(currentOrg).id,
        nullthrows(activeProject).projectID
      );
      const fileBlob = new Blob([await file.arrayBuffer()], {
        type: "application/pdf",
      });
      const result = fetch(preSignedUrl, {
        method: "PUT",
        body: fileBlob,
      });
    });
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

  const refRemoveModalText = () => {
    if (!selectedFolderIds.length) {
      return `Are you sure you want to remove the selected reference${
        selectedReferenceIDs.length > 1 ? "s" : ""
      }?`;
    }

    if (!selectedReferenceIDs.length) {
      return `Are you sure you want to remove the selected folders${
        selectedFolderIds.length > 1 ? "s" : ""
      }?`;
    }

    return `Are you sure you want to remove the selected items?`;
  };

  // TODO: needs cleanup
  const collaborators = [
    ...(activeProject?.collaborators ?? { editors: [] }).editors.map(
      (rawUser: any) => {
        return {
          ...parseUserSuggestion(rawUser),
          role: "EDITOR",
        };
      }
    ),
    ...(activeProject?.collaborators ?? { viewers: [] }).viewers.map(
      (rawUser: any) => {
        return {
          ...parseUserSuggestion(rawUser),
          role: "VIEWER",
        };
      }
    ),
  ];

  if (!userAllowed) {
    return <Fragment />;
  } else {
    return (
      <>
        <ManageOrgModal
          org={currentOrg}
          isOpen={isOrgModalOpen}
          closeModal={(): void => setIsOrgModalOpen(false)}
          onOrgChange={onOrgUpdate}
        />
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
                  {refRemoveModalText()}
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

            selectedFolderIds.forEach((projectId) => {
              const intId = parseInt(projectId.split("-folder")[0], 10);
              removeReferenceProject({
                projectID: intId,
                onSuccess: () => {
                  resetProjectsFetchTime();
                  setIsRemoveRefModalOpen(false);
                },
                onError: emptyFncWithMsg,
              });
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
                <Typography variant="h5">
                  {router.query.slug ? (
                    <Box sx={{ display: "flex" }}>
                      {router.query.slug.map((name, index) => {
                        const slugsTilNow = router.query.slug
                          .slice(0, index + 1)
                          .map((slug) => encodeURIComponent(slug))
                          .join("/");
                        const isActiveProject =
                          index + 1 === router.query.slug?.length;
                        return (
                          <div>
                            <Link
                              href={`/reference-manager/${currentOrg.slug}/${slugsTilNow}`}
                              className={css(
                                styles.projectLink,
                                isActiveProject && styles.activeProjectLink
                              )}
                            >
                              {name}
                            </Link>
                            {index !== router.query.slug?.length - 1 && (
                              <span
                                style={{
                                  margin: 8,
                                  color: "rgb(115, 108, 100)",
                                }}
                              >
                                /
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </Box>
                  ) : isOnOrgTab ? (
                    "Organization References"
                  ) : (
                    `My References`
                  )}
                </Typography>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => {
                    handleFileDrop(Array.from(e.target.files));
                  }}
                />

                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {activeProject?.collaborators && (
                    <AuthorFacePile
                      horizontal
                      margin={-10}
                      imgSize={40}
                      authorProfiles={collaborators.map((collaborator) => {
                        collaborator.authorProfile.user = collaborator;
                        return collaborator.authorProfile;
                      })}
                    />
                  )}
                  {(isOnOrgTab || !isEmpty(router.query.slug)) && (
                    <Button
                      variant="outlined"
                      fontSize="small"
                      size="small"
                      customButtonStyle={styles.shareButton}
                      onClick={
                        isOnOrgTab
                          ? () => setIsOrgModalOpen(true)
                          : onShareClick
                      }
                    >
                      <Typography variant="h6" fontSize={"16px"}>
                        {isOnOrgTab ? "Update Organization" : "Share"}
                      </Typography>
                    </Button>
                  )}
                </div>
              </div>
              <Box className="ReferencesContainerMain">
                <Box
                  className="ReferencesContainerTitleSection"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "row",
                    height: 44,
                    marginBottom: "20px",
                    width: "100%",
                  }}
                >
                  <DropdownMenu
                    menuItemProps={[
                      {
                        itemLabel: "Upload PDF(s)",
                        onClick: (): void =>
                          // @ts-ignore unnecessary never handling
                          nullthrows(inputRef?.current).click(),
                      },
                      {
                        itemLabel: "Manual Entry",
                        onClick: (): void => {
                          setProjectIDForUploadDrawer(
                            activeProject?.projectID ?? null
                          );
                          setIsRefUploadDrawerOpen(true);
                        },
                      },
                    ]}
                    menuLabel={
                      <div className={css(styles.button)}>
                        <FontAwesomeIcon
                          icon={faPlus}
                          color="#fff"
                          fontSize="20px"
                          style={{ marginRight: 8 }}
                        />
                        Add a Reference
                      </div>
                    }
                    size={"small"}
                  />

                  <div
                    className={css(styles.button, styles.secondary)}
                    onClick={(e) => {
                      e.preventDefault();
                      setProjectUpsertPurpose("create_sub_project");
                      setProjectUpsertValue({
                        ...DEFAULT_PROJECT_VALUES,
                        projectID: activeProject.projectID,
                      });
                      setIsProjectUpsertModalOpen(true);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faFolderPlus}
                      color={colors.NEW_BLUE(1)}
                      fontSize="20px"
                      style={{ marginRight: 8 }}
                    />
                    Create Folder
                  </div>
                  {(!isEmpty(selectedReferenceIDs) ||
                    !isEmpty(selectedFolderIds)) && (
                    <>
                      <div
                        className={css(styles.trashContainer)}
                        data-for="button-tooltips"
                        data-tip={`Remove ${
                          selectedFolderIds.length
                            ? "Items"
                            : pluralize({
                                text: "Reference",
                                length: selectedReferenceIDs.length,
                              })
                        }`}
                        onClick={() => setIsRemoveRefModalOpen(true)}
                      >
                        <FontAwesomeIcon
                          icon={faTrashXmark}
                          style={{ fontSize: 18 }}
                        />
                      </div>
                      <div
                        className={css(styles.trashContainer)}
                        onClick={() => setIsBibModalOpen(true)}
                        data-tip={`Export Reference${
                          selectedReferenceIDs.length > 1 ? "s" : ""
                        }`}
                        data-for="button-tooltips"
                      >
                        <FontAwesomeIcon
                          icon={faArrowUpFromBracket}
                          style={{ fontSize: 18 }}
                        />
                      </div>
                    </>
                  )}
                </Box>
                <ReferencesTable
                  createdReferences={createdReferences}
                  // @ts-ignore TODO: @@lightninglu10 - fix TS.
                  handleFileDrop={handleFileDrop}
                  setSelectedReferenceIDs={setSelectedReferenceIDs}
                  setSelectedFolderIds={setSelectedFolderIds}
                />
              </Box>
            </Box>
          </DroppableZone>
          <ReactTooltip effect="solid" id="button-tooltips" />
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
    marginLeft: 16,
    color: colors.BLACK(),
    border: "none",
    background: "unset",
  },
  projectLink: {
    textDecoration: "none",
    color: "rgb(115, 108, 100)",

    ":hover": {
      color: colors.BLACK(),
      textDecoration: "underline",
    },
  },
  activeProjectLink: {
    color: colors.BLACK(),
    fontWeight: 500,
  },
  button: {
    alignItems: "center",
    padding: 16,
    background: colors.NEW_BLUE(),
    borderRadius: 4,
    boxSizing: "border-box",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    fontSize: 14,
    fontWeight: 500,
    height: 40,
    justifyContent: "center",
  },
  secondary: {
    border: `1px solid ${colors.NEW_BLUE()}`,
    background: "#fff",
    color: colors.NEW_BLUE(),
    marginRight: 8,
    marginLeft: 16,
  },
  trashContainer: {
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    width: 40,
    borderRadius: 4,

    ":hover": {
      background: "#F1F5FF",
    },
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
