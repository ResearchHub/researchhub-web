import { useSelector } from "react-redux";
import { useDismissableFeature } from "~/config/hooks/useDismissableFeature";
import { isEmpty } from "~/config/utils/nullchecks";
import { RootState } from "~/redux";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/pro-solid-svg-icons";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";

const FEATURES = [
  {
    name: "SAVE_TO_REF_MANAGER",
    selector: "save-to-ref-manager",
  },
];

const DocumentPageTutorial = () => {
  const [isDomReady, setIsDomReady] = useState(false);
  const auth = useSelector((state: RootState) =>
    isEmpty(state.auth) ? null : state.auth
  );

  useEffect(() => {
    setIsDomReady(true);
  }, [isDomReady]);

  const features = FEATURES.map(({ name, selector }) => {
    const { isDismissed, dismissFeature, dismissStatus } =
      useDismissableFeature({ auth, featureName: name });

    return {
      isDismissed,
      dismissFeature,
      dismissStatus,
      name,
      selector,
    };
  });

  return (
    <div>
      {features.map((feature) => {
        const anchorEl =
          isDomReady && document.querySelector(`#${feature.selector}`);

        if (!anchorEl || feature.isDismissed) {
          return null;
        }

        let html;
        if (
          feature.name === "SAVE_TO_REF_MANAGER" &&
          feature.dismissStatus === "checked" &&
          !feature.isDismissed
        ) {
          html = (
            <div
              className={css(
                styles.tooltipContainer,
                styles.tooltipBlue,
                styles.tooltipSaveForRef
              )}
            >
              <div className={css(styles.title)}>
                Save this paper
                <span className={css(styles.new)}>
                  <span className={css(styles.fireIcon)}>
                    {<FontAwesomeIcon icon={faFire}></FontAwesomeIcon>}
                  </span>
                  <span className={css(styles.newText)}>New</span>
                </span>
              </div>
              <div className={css(styles.desc)}>
                You can now save this paper to your personal reference manager.
                Use it to{" "}
                <span className={css(styles.bolded)}>
                  annotate, collaborate
                </span>{" "}
                and <span className={css(styles.bolded)}>organize</span> your
                research.
              </div>
              <div className={css(styles.btnContainer)}>
                <Button
                  onClick={feature.dismissFeature}
                  label={`Okay`}
                  size="small"
                  customButtonStyle={styles.btn}
                  customLabelStyle={[styles.btnLabel]}
                />
              </div>
            </div>
          );
        }

        return (
          <div>
            {createPortal(html, document.querySelector(`#${feature.selector}`))}
          </div>
        );
      })}
    </div>
  );
};

const styles = StyleSheet.create({
  tooltipBlue: {
    background: colors.NEW_BLUE(),
    color: "white",
    border: `1px solid white`,
  },
  tooltipSaveForRef: {
    width: 250,
    position: "absolute",
    right: 0,
    bottom: -5,
    transform: "translateY(100%)",
  },
  tooltipContainer: {
    position: "absolute",
    zIndex: 10,

    width: 350,
    fontWeight: 400,
    fontSize: 14,
    // background: colors.NEW_BLUE(),
    borderRadius: 4,
    color: "white",
    padding: "10px 15px",
    boxSizing: "border-box",
    boxShadow:
      "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: 320,
    },
  },
  caret: {
    // color: colors.NEW_BLUE(),
    position: "absolute",
  },
  caret_right: {
    fontSize: 25,
    left: -9,
    top: 10,
  },
  caret_bottom: {
    fontSize: 25,
    left: 15,
    top: -18,
    transform: "rotate(90deg)",
  },
  new: {
    display: "flex",
    alignItems: "center",
  },
  newText: {
    fontWeight: 500,
    fontSize: 14,
  },
  fireIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    justifyContent: "space-between",
    display: "flex",
    marginBottom: 5,
    alignItems: "center",
  },
  bolded: {
    fontWeight: 600,
  },
  desc: {
    lineHeight: "21px",
  },
  btnContainer: {
    display: "flex",
    marginTop: 10,
  },
  btn: {
    background: "white",
    border: `1px solid white`,
    borderRadius: 2,
    width: "auto",
    height: "auto",
    padding: "4px 12px",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      minHeight: "unset",
      minWidth: "unset",
      height: "auto",
      width: "auto",
      // padding: "9px 19px",
    },
  },
  btnLabel: {
    color: colors.NEW_BLUE(),
    fontWeight: 500,
    fontSize: 13,
  },
});

export default DocumentPageTutorial;
