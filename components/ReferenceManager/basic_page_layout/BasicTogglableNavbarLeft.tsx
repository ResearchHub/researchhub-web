import { Box } from "@mui/system";
import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import { getCurrentUserCurrentOrg } from "~/components/contexts/OrganizationContext";
import { renderNestedReferenceProjectsNavbarEl } from "../references/reference_organizer/renderNestedReferenceProjectsNavbarEl";
import { SyntheticEvent, useEffect, useState } from "react";
import { Theme } from "@mui/material/styles";
import { useReferenceProjectUpsertContext } from "../references/reference_organizer/context/ReferenceProjectsUpsertContext";
import { useReferenceUploadDrawerContext } from "../references/reference_uploader/context/ReferenceUploadDrawerContext";
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
  const router = useRouter();
  const [childrenOpenMap, setChildrenOpenMap] = useState({});

  useEffect(() => {
    const idsOpen = window.localStorage.getItem("projectIdsOpen");
    if (idsOpen) {
      const idsOpenToArray = idsOpen.split(",");
      const childrenOpenMap = {};
      idsOpenToArray.forEach((id) => {
        childrenOpenMap[id] = true;
      });
      setChildrenOpenMap(childrenOpenMap);
    }
  }, []);

  const addChildrenOpen = ({ key, value }) => {
    const map = { ...childrenOpenMap };
    map[key] = value;
    setChildrenOpenMap(map);
  };

  const currentOrgSlug = currentOrg?.slug ?? null;
  const refProjectsNavbarEls = currentOrgProjects?.map((referenceProject) => {
    return renderNestedReferenceProjectsNavbarEl({
      currentOrgSlug: nullthrows(currentOrgSlug, "Org must be present"),
      referenceProject,
      addChildrenOpen,
      childrenOpenMap,
    });
  });

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
            isEmpty(router.query?.project) && !isEmpty(router.query?.org_refs)
          }
          icon={
            <FontAwesomeIcon
              icon={faSitemap}
              style={{ marginRight: 8, color: "#7C7989" }}
            />
          }
          key="public-references"
          label="Organization References"
          link={`/reference-manager/${currentOrgSlug}?org_refs=true`}
        />
        <BasicTogglableNavbarButton
          icon={
            <FontAwesomeIcon
              icon={faUser}
              style={{ marginLeft: 2, marginRight: 10, color: "#7C7989" }}
            />
          }
          isActive={
            isEmpty(router.query?.org_refs) && isEmpty(router.query?.project)
          }
          key="my-references"
          label="My References"
          link={`/reference-manager/${currentOrgSlug}`}
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
            paddingLeft: "16px",
            paddingRight: "16px",
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
            {"Create a new project"}
          </Typography>
        </ListItemButton>
        {refProjectsNavbarEls}
      </List>
    </Box>
  );
}
