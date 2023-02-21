import { ReactNode, useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import BasicAppMain from "./BasicAppMain";
import BasicTogglableNavbarLeft, {
  LEFT_MAX_NAV_WIDTH,
  LEFT_MIN_NAV_WIDTH,
} from "./BasicTogglableNavbarLeft";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import HistoryIcon from "@mui/icons-material/History";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Person2Icon from "@mui/icons-material/Person2";
import Container from "@mui/material/Container"
import ManageOrgModal from "~/components/Org/ManageOrgModal";
import {
  fetchNote,
  fetchNotePermissions,
  fetchOrg,
  fetchOrgNotes,
  fetchOrgTemplates,
  fetchUserOrgs,
} from "~/config/fetch";
import { useSelector } from "react-redux";
import ResearchHubPopover from "~/components/ResearchHubPopover";
import { css, StyleSheet } from "aphrodite";
import OrgAvatar from "~/components/Org/OrgAvatar";
import Link from "next/link";
import icons, { DownIcon } from "~/config/themes/icons";
import { breakpoints } from "~/config/themes/screen";
import colors from "~/config/themes/colors";
import ReactPlaceholder from "react-placeholder/lib";
import { isEmpty } from "~/config/utils/nullchecks";
import OrgEntryPlaceholder from "~/components/Placeholders/OrgEntryPlaceholder";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import ViewDayOutlinedIcon from "@mui/icons-material/ViewDayOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const HOME_NAV_BUTTON_CONFIG: {
  icon: ReactNode;
  id?: string;
  label: string;
  path?: string;
}[] = [
  {
    label: "All References",
    icon: <ViewDayOutlinedIcon fontSize="small" sx={{ color: "#7C7989" }} />,
  },
  {
    label: "Recently Added",
    icon: <AccessTimeOutlinedIcon fontSize="small" sx={{ color: "#7C7989" }} />,
  },
  {
    label: "Favorites",
    icon: (
      <StarOutlineOutlinedIcon fontSize="small" sx={{ color: "#7C7989" }} />
    ),
  },
  {
    label: "Trash",
    icon: <DeleteOutlinedIcon fontSize="small" sx={{ color: "#7C7989" }} />,
  },
];


type Props = { children: ReactNode };

export default function BasicPageLayout({ children }: Props) {
  const theme = useTheme();
  const user = useSelector((state) => state!.auth.user)
  const auth = useSelector((state) => state!.auth)
  const [isLeftNavOpen, setIsLeftNavOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  const leftNavWidth = isLeftNavOpen ? LEFT_MAX_NAV_WIDTH : LEFT_MIN_NAV_WIDTH;
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const orgsFetched = useRef();

  const onOrgChange = () => {

  }

  useEffect(() => {
    const _fetchAndSetUserOrgs = async () => {
      let userOrgs;
      let currOrg;

      try {
        userOrgs = await fetchUserOrgs({ user });
        currOrg = userOrgs[2];

        setCurrentOrganization(currOrg);
        setOrganizations(userOrgs);
        orgsFetched.current = true;
      } catch (error) {
        console.log(error);
        // captureEvent({
        //   error,
        //   msg: "Failed to fetch user orgs",
        //   data: { noteId, orgSlug, userNoteAccess, userId: user.id },
        // });
        // setError({ statusCode: 500 });
      }
    };

    if (user?.id && !orgsFetched.current) {
      _fetchAndSetUserOrgs();
    }
  }, [user]);


  const [isNoteTemplateModalOpen, setIsNoteTemplateModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showManageOrgModal, setShowManageOrgModal] = useState(false);
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <div style={{ width: 240, background: "#FAFAFC", borderRight: `1px solid rgba(0, 0, 0, 0.12)`  }}>
        <ManageOrgModal
          org={currentOrganization}
          isOpen={showManageOrgModal}
          closeModal={() => setShowManageOrgModal(false)}
          onOrgChange={onOrgChange}
        />
        <ResearchHubPopover
          containerStyle={{ marginLeft: "10px", marginTop: "-10px" }}
          isOpen={isPopoverOpen}
          popoverContent={
            <div className={css(styles.popoverBodyContent)}>
              <div className={css(styles.userOrgs)}>
                {organizations.map((org) => (
                  <Link
                    href={{
                      pathname: `/${org.slug}/notebook/`,
                    }}
                    key={org.id.toString()}
                    className={css(styles.popoverBodyItem)}
                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                  >
                    <div className={css(styles.avatarWrapper)}>
                      <OrgAvatar org={org} />
                    </div>
                    <div className={css(styles.popoverBodyItemText)}>
                      <div className={css(styles.popoverBodyItemTitle)}>
                        {org.name}
                      </div>
                      <div className={css(styles.popoverBodyItemSubtitle)}>
                        {!org.member_count
                          ? ""
                          : org.member_count === 1
                            ? "1 member"
                            : `${org.member_count} members`}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div
                className={css(
                  styles.popoverBodyItem,
                  styles.newOrgContainer
                )}
                onClick={() => {
                  setShowNewOrgModal(true);
                  setIsPopoverOpen(false);
                }}
              >
                <div className={css(styles.newOrgButton)}>{icons.plus}</div>
                New Organization
              </div>
            </div>
          }
          positions={["bottom"]}
          onClickOutside={() => setIsPopoverOpen(false)}
          targetContent={
            <div
              className={css(styles.popoverTarget)}
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            >
              <ReactPlaceholder
                ready={!isEmpty(currentOrganization)}
                showLoadingAnimation
                customPlaceholder={<OrgEntryPlaceholder color="#d3d3d3" />}
              >
                <div className={css(styles.avatarWrapper)}>
                  <OrgAvatar org={currentOrganization} />
                </div>
                {currentOrganization?.name}
              </ReactPlaceholder>
              <DownIcon withAnimation={false} />
            </div>
          }
        />
        <Divider />



        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #3971FF",
            borderRadius: "4px",
            marginLeft: "20px",
            marginTop: "20px",
            marginRight: "20px",
            marginBottom: "10px",
            height: isOpen ? "48px" : "28px",
            width: isOpen ? undefined : "28px",
            textTransform: "none",
            cursor: "pointer",
          }}
        >
          <AddSharpIcon fontSize="small" color="primary" />
          {isOpen && (
            <Typography
              color="#3971FF"
              component="div"
              fontSize={14}
              fontWeight={500}
              letterSpacing={"1.2px"}
              noWrap
              variant="h6"
              ml={"6px"}
            >
              {"Upload paper"}
            </Typography>
          )}
        </Box>

        <List sx={{ background: "#FAFAFC", color: "rgba(36, 31, 58, 1)" }}>
        {HOME_NAV_BUTTON_CONFIG.map((navbuttonObjs, index) => {
          const { label, icon } = navbuttonObjs;
          return (
            <ListItem key={label} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: isOpen ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isOpen ? 1 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  sx={{ opacity: isOpen ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List
        sx={{
          background: "#FAFAFC",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <ListItemButton
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
        </ListItemButton>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: isOpen ? "initial" : "center",
            px: 2.5,
            maxHeight: 50,
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
            {" Add new"}
          </Typography>
        </ListItemButton>
      </List>



      </div>
      {/* <NewOrgModal
        isOpen={showNewOrgModal}
        closeModal={() => setShowNewOrgModal(false)}
        onOrgChange={onOrgChange}
      /> */}

      {/* <BasicTogglableNavbarLeft
        isOpen={isLeftNavOpen}
        navWidth={leftNavWidth}
        setIsOpen={setIsLeftNavOpen}
        theme={theme}
      /> */}
      <BasicAppMain
        appPaddingLeft={"24px"}
        isLeftNavOpen={isLeftNavOpen}
        leftNavWidth={leftNavWidth}
        theme={theme}
      >
        {children}
      </BasicAppMain>
    </Box>
  );
}

const styles = StyleSheet.create({
  sidebarOrgContainer: {
    borderBottom: `1px solid ${colors.GREY(0.3)}`,
  },
  avatarWrapper: {
    marginRight: 10,
  },
  userOrgs: {
    maxHeight: 300,
    overflowY: "auto",
  },
  newOrgContainer: {
    color: colors.PURPLE(),
    fontWeight: 500,
    ":last-child": {
      borderRadius: "0px 0px 4px 4px",
    },
  },
  newOrgButton: {
    alignItems: "center",
    background: colors.LIGHT_GREY(),
    border: "1px solid #ddd",
    borderRadius: "50%",
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    fontSize: 16,
    height: 30,
    justifyContent: "center",
    marginRight: 10,
    transition: "all ease-in-out 0.1s",
    width: 30,
  },
  sidebar: {
    background: "#f9f9fc",
    borderRight: `1px solid ${colors.GREY(0.3)}`,
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 68px)",
    left: 0,
    maxWidth: 300,
    minWidth: 240,
    // position: "fixed",
    top: 68,
    width: "16%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      display: "none",
    },
  },
  popoverTarget: {
    alignItems: "center",
    color: colors.BLACK(0.6),
    cursor: "pointer",
    display: "flex",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 1.1,
    padding: 20,
    textTransform: "uppercase",
    userSelect: "none",
    wordBreak: "break-word",
    ":hover": {
      backgroundColor: colors.GREY(0.3),
    },
  },
  popoverBodyContent: {
    backgroundColor: "#fff",
    borderRadius: 4,
    boxShadow: "0px 0px 10px 0px #00000026",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
    width: 270,
  },
  popoverBodyItem: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    padding: 15,
    textDecoration: "none",
    wordBreak: "break-word",
    ":hover": {
      backgroundColor: colors.GREY(0.2),
    },
    ":first-child": {
      borderRadius: "4px 4px 0px 0px",
    },
  },
  popoverBodyItemText: {
    display: "flex",
    flexDirection: "column",
  },
  popoverBodyItemTitle: {
    color: colors.BLACK(),
    fontWeight: 500,
  },
  popoverBodyItemSubtitle: {
    color: colors.BLACK(0.5),
    fontSize: 13,
    marginTop: 2,
  },
  scrollable: {
    overflow: "auto",
  },
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
      color: colors.BLUE(),
    },
  },
  sidebarButtonText: {
    marginLeft: 10,
  },
});