import { Box } from "@mui/system";
import {
  emptyFncWithMsg,
  isEmpty,
  nullthrows,
} from "~/config/utils/nullchecks";
import { fetchReferenceProjects } from "../references/reference_organizer/api/fetchReferenceProjects";
import { getCurrentUserCurrentOrg } from "~/components/contexts/OrganizationContext";
import { renderNestedReferenceProjectsNavbarEl } from "../references/reference_organizer/renderNestedReferenceProjectsNavbarEl";
import { SyntheticEvent, useEffect, useState } from "react";
import { Theme } from "@mui/material/styles";
import { useReferenceProjectUpsertContext } from "../references/reference_organizer/context/ReferenceProjectsUpsertContext";
import { useReferenceUploadDrawerContext } from "../references/reference_uploader/context/ReferenceUploadDrawerContext";
import { useRouter } from "next/router";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import BasicTogglableNavbarButton from "./BasicTogglableNavbarButton";
import Divider from "@mui/material/Divider";
import HailIcon from "@mui/icons-material/Hail";
import HomeIcon from "@mui/icons-material/Home";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import OrganizationPopover from "~/components/Tooltips/Organization/OrganizationPopover";
import ReferenceProjectsUpsertModal from "../references/reference_organizer/ReferenceProjectsUpsertModal";
import Typography from "@mui/material/Typography";
import colors from "~/config/themes/colors";

export const LEFT_MAX_NAV_WIDTH = 240;
export const LEFT_MIN_NAV_WIDTH = 65;
const OPTION_BOTTON_STYLE = {
  alignItems: "center",
  borderRadius: "4px",
  cursor: "pointer",
  display: "flex",
  height: "32px",
  justifyContent: "center",
  minWidth: "32px",
  ":hover": { background: colors.BLUE(0.2) },
};

type Props = {
  isOpen: boolean;
  navWidth: number;
  setIsOpen: (flag: boolean) => void;
  theme?: Theme;
};

export default function BasicTogglableNavbarLeft({
  isOpen,
  navWidth,
  theme,
}: Props) {
  const {
    setIsDrawerOpen: isUploadDrawerOpen,
    setProjectID: setProjectIDForDrawer,
  } = useReferenceUploadDrawerContext();
  const { projectsFetchTime, isModalOpen } = useReferenceProjectUpsertContext();
  const { setIsModalOpen: setIsProjectsUpsertModalOpen } =
    useReferenceProjectUpsertContext();
  const currentOrg = getCurrentUserCurrentOrg();
  const [currentOrgProjects, setCurrentOrgProjects] = useState<any[]>();
  const router = useRouter();

  const currentOrgID = currentOrg?.id ?? null;
  const currentOrgSlug = currentOrg?.slug ?? null;

  useEffect((): void => {
    if (!isEmpty(currentOrgID)) {
      fetchReferenceProjects({
        onError: emptyFncWithMsg,
        onSuccess: (result): void => {
          setCurrentOrgProjects(result);
        },
        payload: {
          organization: currentOrgID,
        },
      });
    }
  }, [currentOrgID, projectsFetchTime]);

  const refProjectsNavbarEls = currentOrgProjects?.map(
    (referenceProject, elIndex) => {
      return renderNestedReferenceProjectsNavbarEl({
        currentOrgSlug: nullthrows(currentOrgSlug, "Org must be present"),
        referenceProject,
        activeProjectName: router.query.project_name ?? "",
      });
    }
  );

  return (
    <Box
      flexDirection="column"
      width={navWidth}
      sx={{
        borderLeft: "1px solid #e8e8ef",
        zIndex: 4,
        background: "#FAFAFC",
        height: "100%",
        minHeight: "calc(100vh - 68px)",
      }}
    >
      <ReferenceProjectsUpsertModal />
      <Box className="LeftNavbarUserSection">
        <Box
          sx={{
            alignItems: "center",
            color: "rgba(170, 168, 180, 1)",
            cursor: "pointer",
            display: "flex",
            borderBottom: "1px solid #E9EAEF",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <OrganizationPopover isReferenceManager={true} />
        </Box>
      </Box>
      <List sx={{ background: "#FAFAFC", color: "rgba(36, 31, 58, 1)" }}>
        <BasicTogglableNavbarButton
          isActive={
            isEmpty(router.query?.project_name) &&
            isEmpty(router.query?.my_refs)
          }
          icon={
            <HomeIcon
              fontSize="small"
              sx={{ color: "#7C7989", marginRight: "8px" }}
            />
          }
          key="public-references"
          label="Public references"
          link={`/reference-manager/${currentOrgSlug}`}
          option={
            <Box
              sx={OPTION_BOTTON_STYLE}
              onClick={(): void => {
                setProjectIDForDrawer(null);
                isUploadDrawerOpen(true);
              }}
            >
              <AddSharpIcon fontSize="small" color="primary" />
            </Box>
          }
        />
        <BasicTogglableNavbarButton
          icon={
            <HailIcon
              fontSize="small"
              sx={{ color: "#7C7989", marginRight: "8px" }}
            />
          }
          isActive={!isEmpty(router.query?.my_refs)}
          key="my-references"
          label="My references"
          link={`/reference-manager/${currentOrgSlug}?my_refs=true`}
          option={
            <Box
              sx={OPTION_BOTTON_STYLE}
              onClick={(): void => {
                setProjectIDForDrawer(null);
                isUploadDrawerOpen(true);
              }}
            >
              <AddSharpIcon fontSize="small" color="primary" />
            </Box>
          }
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
            {"PROJECTS"}
          </Typography>
        </ListItem>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: isOpen ? "initial" : "center",
            px: 2.5,
            maxHeight: 50,
          }}
          onClick={(event: SyntheticEvent): void => {
            event.preventDefault();
            setIsProjectsUpsertModalOpen(true);
          }}
        >
          <AddSharpIcon fontSize="small" color="primary" />
          <Typography
            color="#3971FF"
            component="div"
            fontSize={14}
            letterSpacing={"1.2px"}
            noWrap
            variant="h6"
            ml={"6px"}
          >
            {"Create a new project"}
          </Typography>
        </ListItemButton>
        {refProjectsNavbarEls}
      </List>
    </Box>
  );
}
// type DrawerProps = {
//   isOpen: boolean;
//   navWidth: number;
//   theme: Theme;
// };

/* <Drawer
        isOpen={isOpen}
        navWidth={navWidth}
        theme={theme}
        variant="permanent"
      > */

// const openedMixin = (theme: Theme, navWidth: number): CSSObject => ({
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
//   overflowX: "hidden",
//   width: navWidth,
// });

// const closedMixin = (theme: Theme): CSSObject => ({
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: "hidden",
//   width: `calc(${theme.spacing(7)} + 1px)`,
//   [theme.breakpoints.up("sm")]: {
//     width: `calc(${theme.spacing(8)} + 1px)`,
//   },
// });

// const doNotPassProps = new Set(["isOpen", "navWidth"]);
// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (propName: string): boolean =>
//     !doNotPassProps.has(propName),
// })(({ theme, isOpen, navWidth }: DrawerProps) => ({
//   background: "#FAFAFC",
//   boxSizing: "border-box",
//   flexShrink: 0,
//   position: "sticky",
//   top: 0,
//   whiteSpace: "nowrap",
//   width: navWidth,
//   ...(isOpen && {
//     ...openedMixin(theme, navWidth),
//     "& .MuiDrawer-paper": openedMixin(theme, navWidth),
//   }),
//   ...(!isOpen && {
//     ...closedMixin(theme),
//     "& .MuiDrawer-paper": closedMixin(theme),
//   }),
// }));

// const DrawerHeader = styled("div")(({ theme }: { theme: Theme }) => ({
//   alignItems: "center",
//   display: "flex",
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
//   justifyContent: "flex-end",
// }));
