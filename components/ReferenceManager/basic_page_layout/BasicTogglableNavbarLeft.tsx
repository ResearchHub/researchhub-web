import { Box } from "@mui/system";
import {
  isEmpty,
  isNullOrUndefined,
  nullthrows,
} from "~/config/utils/nullchecks";
import { getCurrentUserCurrentOrg } from "~/components/contexts/OrganizationContext";
import { renderNestedReferenceProjectsNavbarEl } from "../references/reference_organizer/renderNestedReferenceProjectsNavbarEl";
import { SyntheticEvent, useEffect, useState } from "react";
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
import ReferenceProjectsUpsertModal from "../references/reference_organizer/ReferenceProjectsUpsertModal";
import Typography from "@mui/material/Typography";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-light-svg-icons";
import { faSitemap, faUser } from "@fortawesome/pro-regular-svg-icons";
import { useReferenceActiveProjectContext } from "../references/reference_organizer/context/ReferenceActiveProjectContext";

export const LEFT_MAX_NAV_WIDTH = 240;
export const LEFT_MIN_NAV_WIDTH = 65;

type Props = {
  isOpen: boolean;
  navWidth: number;
  setIsOpen: (flag: boolean) => void;
  theme?: Theme;
  currentOrgProjects: any[];
};

export default function BasicTogglableNavbarLeft({
  isOpen,
  navWidth,
  theme,
  currentOrgProjects,
}: Props) {
  const { setIsModalOpen: setIsProjectsUpsertModalOpen } =
    useReferenceProjectUpsertContext();
  const currentOrg = getCurrentUserCurrentOrg();
  const { setCurrentOrgProjects, setActiveProject, activeProject } =
    useReferenceActiveProjectContext();
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

  const setNestedProjects = ({ activeProject, allProjects }) => {
    const newOrgProjects = allProjects.map((proj) => {
      if (proj.id === activeProject.id) {
        return activeProject;
      }
      proj.children = setNestedProjects({
        activeProject,
        allProjects: proj.children,
      });
      return proj;
    });

    return newOrgProjects;
  };

  const addFolderToChildren = (result) => {
    let newOrgProjects: ProjectValue[] = [...currentOrgProjects];
    if (!result.parent) {
      newOrgProjects.push(result);
    } else {
      const newActiveProject = { ...activeProject };
      newActiveProject.children = [...newActiveProject.children, result];
      setActiveProject(newActiveProject);

      newOrgProjects = setNestedProjects({
        activeProject: newActiveProject,
        allProjects: currentOrgProjects,
      });
    }

    setCurrentOrgProjects(newOrgProjects);
  };

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
    <Box
      flexDirection="column"
      width={navWidth}
      sx={{
        borderLeft: `1px solid ${colors.GREY_LINE()}`,
        zIndex: 4,
        background: colors.LIGHT_GRAY_BACKGROUND2(),
        height: "100%",
        minHeight: "calc(100vh - 68px)",
      }}
    >
      <ReferenceProjectsUpsertModal onUpsertSuccess={addFolderToChildren} />
      <Box className="LeftNavbarUserSection">
        <Box
          sx={{
            alignItems: "center",
            color: colors.VOTE_ARRROW,
            cursor: "pointer",
            display: "flex",
            borderBottom: `1px solid ${colors.LIGHT_GREYISH_BLUE5()}`,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <OrganizationPopover isReferenceManager={true} />
        </Box>
      </Box>
      <List
        sx={{
          background: colors.LIGHT_GRAY_BACKGROUND2(),
          color: colors.BLACK(1),
        }}
      >
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
          background: colors.LIGHT_GRAY_BACKGROUND2(),
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
            color={colors.MEDIUM_GREY2()}
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
            color={colors.NEW_BLUE()}
            style={{ fontSize: 14 }}
          />
          <Typography
            color={colors.NEW_BLUE()}
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
    </Box>
  );
}
