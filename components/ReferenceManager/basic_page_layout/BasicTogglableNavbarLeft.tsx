import { Box } from "@mui/system";
import {
  isEmpty,
  isNullOrUndefined,
  nullthrows,
} from "~/config/utils/nullchecks";
import { getCurrentUserCurrentOrg } from "~/components/contexts/OrganizationContext";
import { renderNestedReferenceProjectsNavbarEl } from "../references/reference_organizer/renderNestedReferenceProjectsNavbarEl";
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { Theme } from "@mui/material/styles";
import {
  ProjectValue,
  useReferenceProjectUpsertContext,
} from "../references/reference_organizer/context/ReferenceProjectsUpsertContext";
import { useRouter } from "next/router";
import BasicTogglableNavbarButton from "./BasicTogglableNavbarButton";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import OrganizationPopover from "~/components/Tooltips/Organization/OrganizationPopover";
import Typography from "@mui/material/Typography";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-light-svg-icons";
import { faSitemap, faUser } from "@fortawesome/pro-regular-svg-icons";
import { useReferenceActiveProjectContext } from "../references/reference_organizer/context/ReferenceActiveProjectContext";
import Drawer from "@mui/material/Drawer";
import useWindow from "~/config/hooks/useWindow";
import { breakpoints } from "~/config/themes/screen";
import { StyleSheet, css } from "aphrodite";
import { faCog } from "@fortawesome/pro-solid-svg-icons";
import { navContext } from "~/components/contexts/NavigationContext";

export const LEFT_MAX_NAV_WIDTH = 240;
export const LEFT_MIN_NAV_WIDTH = 65;

type Props = {
  isOpen: boolean;
  navWidth: number;
  setIsOpen: (flag: boolean) => void;
  openOrgSettingsModal: () => void;
  theme?: Theme;
  currentOrgProjects: any[];
};

const ContentWrapper = ({ children, width, isOpen, setIsOpen }) => {
  const { isRefManagerDisplayedAsDrawer } = navContext();

  if (isRefManagerDisplayedAsDrawer) {
    return (
      <Drawer
        anchor={"left"}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        ModalProps={{
          hideBackdrop: false,
          disableScrollLock: true,
          style: {
            backgroundColor: "rgba(0,0,0,0)",
          },
        }}
        PaperProps={{
          sx: { width },
        }}
      >
        {children}
      </Drawer>
    );
  } else {
    return (
      <Box
        flexDirection="column"
        width={width}
        className={
          "ToggleableNavbarLeft" /* This classname is used in upload drawer */
        }
        sx={{
          borderRight: "1px solid #e8e8ef",
          zIndex: 4,
          background: colors.GREY_ICY_BLUE_HUE,
          height: "100%",
          minHeight: "calc(100vh - 68px)",
          display: isOpen ? "block" : "none",
        }}
      >
        {children}
      </Box>
    );
  }
};

export default function BasicTogglableNavbarLeft({
  isOpen,
  setIsOpen,
  navWidth,
  theme,
  openOrgSettingsModal,
  currentOrgProjects,
}: Props) {
  const { setIsModalOpen: setIsProjectsUpsertModalOpen } =
    useReferenceProjectUpsertContext();
  const currentOrg = getCurrentUserCurrentOrg();
  const router = useRouter();
  const [childrenOpenMap, setChildrenOpenMap] = useState({});

  useEffect(() => {
    const idsOpen = window.localStorage.getItem("projectIdsOpenv2") || "{}";
    const childrenOpenMap = JSON.parse(idsOpen);
    setChildrenOpenMap(childrenOpenMap);
  }, []);

  const addChildrenOpen = ({ key, value }) => {
    const map = { ...childrenOpenMap };
    map[key] = value;
    setChildrenOpenMap(map);
  };

  // const findNestedProjectIndex = ({
  //   allProjects,
  //   activeProject,
  //   indices,
  // }: {
  //   allProjects: ProjectValue[];
  //   activeProject: ProjectValue;
  //   indices: number[];
  // }) => {
  //   for (let index = 0; index < allProjects.length; index++) {
  //     const project = allProjects[index];
  //     if (project.id === activeProject.id) {
  //       return index;
  //     }

  //     const projectChildren = project.children;
  //     if (!isEmpty(projectChildren)) {
  //       indices.push(index);
  //       const childTarget = findNestedProjectIndex({
  //         allProjects: projectChildren,
  //         activeProject,
  //         indices,
  //       });

  //       if (!isNullOrUndefined(childTarget)) {
  //         indices.push(childTarget);
  //       }
  //     }
  //   }
  // };

  const currentOrgSlug = currentOrg?.slug ?? null;
  const refProjectsNavbarEls = currentOrgProjects?.map((referenceProject) => {
    return renderNestedReferenceProjectsNavbarEl({
      currentOrgSlug: nullthrows(currentOrgSlug, "Org must be present"),
      referenceProject,
      addChildrenOpen,
      childrenOpenMap,
      slug: `${encodeURIComponent(referenceProject.project_name)}`,
    });
  });

  return (
    <ContentWrapper width={navWidth} isOpen={isOpen} setIsOpen={setIsOpen}>
      <Box className="LeftNavbarUserSection">
        <Box
          sx={{
            alignItems: "center",
            color: "rgba(170, 168, 180, 1)",
            cursor: "pointer",
            width: "100%",
          }}
        >
          <OrganizationPopover isReferenceManager={true} />
          <div className={css(styles.sidebarButtonsContainer)}>
            <div
              className={css(styles.sidebarButton)}
              onClick={openOrgSettingsModal}
            >
              {<FontAwesomeIcon icon={faCog}></FontAwesomeIcon>}
              <span className={css(styles.sidebarButtonText)}>
                Settings & Members
              </span>
            </div>
          </div>
        </Box>
      </Box>
      <Divider />
      <List sx={{ background: "#FAFAFC", color: "rgba(36, 31, 58, 1)" }}>
        <BasicTogglableNavbarButton
          icon={
            <FontAwesomeIcon
              icon={faUser}
              style={{ marginLeft: 2, marginRight: 10, color: "#7C7989" }}
            />
          }
          isActive={
            isEmpty(router.query?.org_refs) && isEmpty(router.query?.slug)
          }
          key="my-references"
          label="My References"
          link={`/reference-manager/${currentOrgSlug}?my_refs=true`}
        />
        <BasicTogglableNavbarButton
          isActive={
            isEmpty(router.query?.slug) && !isEmpty(router.query?.org_refs)
          }
          icon={
            <FontAwesomeIcon
              icon={faSitemap}
              style={{ marginRight: 8, color: "#7C7989" }}
            />
          }
          key="public-references"
          label="Org References"
          link={`/reference-manager/${currentOrgSlug}?org_refs=true`}
        />
      </List>
      <Divider />
      <List
        sx={{
          background: "#FAFAFC",
          display: "flex",
          flexDirection: "column",
          paddingBottom: "16px",
        }}
      >
        <ListItem
          sx={{
            minHeight: 48,
            justifyContent: isOpen ? "initial" : "center",
            px: 2.5,
            maxHeight: 50,
          }}
        >
          <Typography
            color={"rgba(124, 121, 137, 1)"}
            component="div"
            fontSize={14}
            fontWeight={700}
            letterSpacing={"1.2px"}
            noWrap
            variant="h6"
          >
            {"Folders"}
          </Typography>
        </ListItem>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: isOpen ? "initial" : "center",
            px: 2.5,
            maxHeight: 50,
            paddingLeft: "16px",
            paddingRight: "16px",
            ":hover": {
              background: "unset",
            },
          }}
          onClick={(event: SyntheticEvent): void => {
            event.preventDefault();
            setIsProjectsUpsertModalOpen(true);
          }}
        >
          <FontAwesomeIcon
            icon={faPlus}
            color="rgb(57, 113, 255)"
            style={{ fontSize: 14 }}
          />
          <Typography
            color="#3971FF"
            component="div"
            fontSize={14}
            letterSpacing={"1.2px"}
            noWrap
            variant="h6"
            ml={"6px"}
          >
            {"Create a new folder"}
          </Typography>
        </ListItemButton>
        {refProjectsNavbarEls}
      </List>
    </ContentWrapper>
  );
}

const styles = StyleSheet.create({
  sidebarButtonsContainer: {
    margin: "0px 10px 10px 10px",
  },
  sidebarButton: {
    border: "none",
    color: colors.BLACK(0.6),
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    maxWidth: "fit-content",
    padding: 10,
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  sidebarButtonText: {
    marginLeft: 10,
  },
});
