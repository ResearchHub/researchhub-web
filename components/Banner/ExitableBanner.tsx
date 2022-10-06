import { css, StyleSheet } from "aphrodite";
import {
  getCookieOrLocalStorageValue,
  storeToCookieOrLocalStorage,
} from "~/config/utils/storeToCookieOrLocalStorage";
import { ReactNode, ReactElement, SyntheticEvent, useState } from "react";
import icons from "~/config/themes/icons";
import { breakpoints } from "~/config/themes/screen";

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
  const [isExited, setIsExited] = useState<boolean>(
    getCookieOrLocalStorageValue({
      key: bannerKey,
    })?.value === "exited"
  );

  if (isExited) {
    onExit && onExit()
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
          storeToCookieOrLocalStorage({ key: bannerKey, value: "exited" });
          setIsExited(true);
        }}
        role="button"
        style={exitButtonPositionOverride}
      >
        {exitButton ?? (
          <div className={css(styles.exitButtonDefault)}>{icons.times}</div>
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
    alignItems: "center",
    display: "flex",
    width: "100%",
    height: "100%",
  },
  exitButtonDefault: {
    color: "#fff",
    fontWeight: 500,
    fontSize: 16,
    [`@media only screen and (min-width: ${breakpoints.mobile.str})`]: {
      fontSize: 24,
    },
  },
  exitButtonWrap: {
    cursor: "pointer",
    position: "absolute",
    right: 0,
    top: 0,
  },
});
