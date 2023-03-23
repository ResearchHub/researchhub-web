import { Theme, styled } from "@mui/material/styles";

const doNotPassProps = new Set([
  "appPaddingLeft",
  "isLeftNavOpen",
  "topBarHeight",
  "leftNavWidth",
]);

const BasicAppMain = styled("main", {
  shouldForwardProp: (propName: string): boolean =>
    !doNotPassProps.has(propName),
})<{
  appPaddingLeft?: string;
  isLeftNavOpen?: boolean;
  leftNavWidth: number;
  theme: Theme;
  topBarHeight: number;
}>(
  ({
    appPaddingLeft,
    theme: { spacing, transitions },
    leftNavWidth: _leftNavWidth,
    isLeftNavOpen,
    topBarHeight,
  }) => ({
    flexGrow: 1,
    margin: `${topBarHeight ?? 0}px 0 0 ${0}px`,
    // Having the same padding-left & -right makes nice visual
    padding: `${spacing(2)} ${appPaddingLeft ?? 0} 0`,
    transition: transitions.create("margin", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.leavingScreen,
    }),
    ...(isLeftNavOpen && {
      transition: transitions.create("margin", {
        easing: transitions.easing.easeOut,
        duration: transitions.duration.enteringScreen,
      }),
    }),
  })
);

export default BasicAppMain;
