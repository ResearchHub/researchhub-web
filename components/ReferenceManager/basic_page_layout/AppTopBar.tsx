import { Theme, styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

interface AppTopBarProps extends MuiAppBarProps {
  appPaddingLeft?: string;
  navNavWidth: number;
  isLeftNavOpen?: boolean;
  theme: Theme;
}

export const TOP_BAR_HEIGHT = 80;
export const APP_PADDING_LEFT = "40px";

const doNotPassProps = new Set([
  "appPaddingLeft",
  "isLeftNavOpen",
  "navNavWidth",
]);

const AppTopBar = styled(MuiAppBar, {
  shouldForwardProp: (propName: string): boolean =>
    !doNotPassProps.has(propName),
})<AppTopBarProps>(
  ({ appPaddingLeft, navNavWidth, isLeftNavOpen, theme }: AppTopBarProps) => ({
    alignItems: "center",
    flexDirection: "row",
    background: "#fff",
    boxShadow: "none",
    color: "black",
    display: "flex",
    fontSize: 16,
    justifyContent: "space-between",
    fontWeight: 400,
    minHeight: TOP_BAR_HEIGHT,
    padding: `0 ${theme.spacing(5)}`,
    width: `calc(100% - ${navNavWidth}px)`,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(isLeftNavOpen && {
      marginLeft: navNavWidth,
      width: `calc(100% - ${navNavWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

export default AppTopBar;
