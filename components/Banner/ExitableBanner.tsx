import { css, StyleSheet } from "aphrodite";
import {
  getCookieOrLocalStorageValue,
  storeToCookieOrLocalStorage,
} from "~/config/utils/storeToCookieOrLocalStorage";
import { ReactNode, ReactElement, SyntheticEvent, useState } from "react";
import icons from "~/config/themes/icons";

type Props = {
  bannerKey: string;
  content: ReactNode;
  exitButton?: ReactNode;
  exitButtonPositionOverride?: Object;
};

export default function ExitableBanner({
  content,
  bannerKey,
  exitButton,
  exitButtonPositionOverride,
}: Props): ReactElement | null {
  const [isExited, setIsExited] = useState<boolean>(
    getCookieOrLocalStorageValue({
      key: bannerKey,
    })?.value === "exited"
  );

  if (isExited) {
    return null;
  }

  return (
    <div className={css(styles.exitableBanner)}>
      <div className={css(styles.contentWrap)}>{content}</div>
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
    height: "100%",
    justifyContent: "space-between",
    margin: "auto",
  },
  exitButtonDefault: {
    color: 0,
    height: 16,
    width: 16,
  },
  exitButtonWrap: {
    left: 16,
    position: "relative",
    top: 16,
  },
});
