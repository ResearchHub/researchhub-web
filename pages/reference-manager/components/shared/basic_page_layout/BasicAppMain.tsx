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
}>(
  ({
    appPaddingLeft,
    theme: { spacing, transitions },
    leftNavWidth: _leftNavWidth,
    isLeftNavOpen,
  }) => ({
    flexGrow: 1,
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
