import { CSSObject, Theme, styled } from "@mui/material/styles";
import { ReactNode } from "react";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Divider from "@mui/material/Divider";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import Image from "next/image";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MuiDrawer from "@mui/material/Drawer";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import Typography from "@mui/material/Typography";
import ViewDayOutlinedIcon from "@mui/icons-material/ViewDayOutlined";
import { Box } from "@mui/system";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Button } from "@mui/material";
import { getCurrentUser } from "~/config/utils/getCurrentUser";

export const LEFT_MAX_NAV_WIDTH = 240;
export const LEFT_MIN_NAV_WIDTH = 65;

// type DrawerProps = {
//   isOpen: boolean;
//   navWidth: number;
//   theme: Theme;
// };

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
    label: "Recent Read",
    icon: (
      <BookmarkBorderOutlinedIcon fontSize="small" sx={{ color: "#7C7989" }} />
    ),
  },
  {
    label: "Favorites",
    icon: (
      <StarOutlineOutlinedIcon fontSize="small" sx={{ color: "#7C7989" }} />
    ),
  },
  {
    label: "Recent Activities",
    icon: <HistoryOutlinedIcon fontSize="small" sx={{ color: "#7C7989" }} />,
  },
  {
    label: "Trash",
    icon: <DeleteOutlinedIcon fontSize="small" sx={{ color: "#7C7989" }} />,
  },
];

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

type Props = {
  isOpen: boolean;
  navWidth: number;
  setIsOpen: (flag: boolean) => void;
  theme?: Theme;
};

// const DrawerHeader = styled("div")(({ theme }: { theme: Theme }) => ({
//   alignItems: "center",
//   display: "flex",
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
//   justifyContent: "flex-end",
// }));

export default function BasicTogglableNavbarLeft({
  isOpen,
  navWidth,
  setIsOpen,
  theme,
}: Props) {
  const user = getCurrentUser();
console.warn(user?.author_profile?.profile_image);

  return (
    <Box flexDirection="column" width={navWidth}>
      {/* <Drawer
        isOpen={isOpen}
        navWidth={navWidth}
        theme={theme}
        variant="permanent"
      > */}
      <Box
        className="LeftNavbarUserSection"
        sx={{ background: "#FAFAFC", padding: "16px 16px" }}
      >
        <Box
          sx={{
            alignItems: "center",
            color: "rgba(170, 168, 180, 1)",
            cursor: "pointer",
            paddingBottom: "16px",
            marginBottom: "16px",
            display: "flex",
            borderBottom: "1px solid #E9EAEF",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              color: "rgba(36, 31, 58, 1)",
              flexDirection: "row",
            }}
          >
            {user?.author_profile?.profile_image ? (
              <Image
                src={user?.author_profile?.profile_image ?? ''}
                width={24}
                height={24}
                style={{ borderRadius: "50%" }}
                alt={""}
              />
            ) : (
              <AccountCircleOutlinedIcon fontSize="medium" />
            )}
            {isOpen && (
              <Typography
                component="div"
                fontSize={16}
                fontWeight={500}
                color="#7C7989"
                noWrap
                variant="h6"
                letterSpacing={"1.1px"}
                ml="12px"
              >
                {`${user?.first_name} ${user?.last_name}`}
              </Typography>
            )}
          </Box>
          {isOpen && <ExpandMore fontSize="medium" sx={{ color: "#7C7989" }} />}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #3971FF",
            borderRadius: "4px",
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
            {"WORKSPACE"}
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
      {/* </Drawer> */}
    </Box>
  );
}
