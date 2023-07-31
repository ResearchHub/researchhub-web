import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { css, StyleSheet } from "aphrodite";
import {
  storeToCookieOrLocalStorage,
} from "~/config/utils/storeToCookieOrLocalStorage";
import { ReactNode, ReactElement, SyntheticEvent } from "react";

import { breakpoints } from "~/config/themes/screen";
import colors, { iconColors } from "~/config/themes/colors";
import { useSelector } from "react-redux";
import { RootState } from "~/redux";
import { useDismissableFeature } from "~/config/hooks/useDismissableFeature";

type Props = {
  bannerKey: string;
  content: ReactNode;
  contentStyleOverride?: Object;
  exitButton?: ReactNode;
  exitButtonPositionOverride?: Object;
  onExit?: () => void;
};

export default function ExitableBanner({
  content,
  bannerKey,
  contentStyleOverride,
  exitButton,
  exitButtonPositionOverride,
  onExit,
}: Props): ReactElement | null {
  const auth = useSelector((state: RootState) => state.auth);
  
  const {
    isDismissed,
    dismissFeature,
    dismissStatus
  } = useDismissableFeature({ auth, featureName: bannerKey })
  

  if (dismissStatus === "unchecked" || (dismissStatus === "checked" && isDismissed)) {
    onExit && onExit();
    return null;
  }

  return (
    <div className={css(styles.exitableBanner)}>
      <div className={css(styles.contentWrap)} style={contentStyleOverride}>
        {content}
      </div>
      <div
        className={css(styles.exitButtonWrap)}
        onClick={(event: SyntheticEvent): void => {
          event.preventDefault();
          event.stopPropagation();
          dismissFeature();
        }}
        style={exitButtonPositionOverride}
      >
        {exitButton ?? (
          <div className={css(styles.exitButtonDefault)}>
            {<FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  exitableBannerContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  exitableBanner: {
    boxSizing: "border-box",
    display: "flex",
    fontFamily: "Roboto",
    position: "relative",
    width: "100%",
  },
  contentWrap: {
    width: "100%",
  },
  exitButtonDefault: {
    color: colors.WHITE(),
    fontWeight: 500,
    fontSize: 16,
    [`@media only screen and (min-width: ${breakpoints.mobile.str})`]: {
      fontSize: 24,
    },
  },
  exitButtonWrap: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    height: 28,
    justifyContent: "center",
    position: "absolute",
    right: 22,
    top: 22,
    width: 28,
    zIndex: 4,
    ":hover": {
      background: iconColors.BACKGROUND,
      borderRadius: 3,
      transition: "0.3s",
    },
  },
});
