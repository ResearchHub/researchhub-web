import { useSelector } from "react-redux";
import { useDismissableFeature } from "~/config/hooks/useDismissableFeature";
import { isEmpty } from "~/config/utils/nullchecks";
import { RootState } from "~/redux";
import { ReactElement, useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import BaseModal from "~/components/Modals/BaseModal";
import { useRouter } from "next/router";

const ReferenceManagerIntroModal = (): ReactElement => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const auth = useSelector((state: RootState) =>
    isEmpty(state.auth) ? null : state.auth
  );

  const { isDismissed, dismissFeature, dismissStatus } = useDismissableFeature({
    auth,
    featureName: "REFERENCE_MANAGER",
  });

  useEffect(() => {
    if (dismissStatus === "checked" && !isDismissed) {
      setIsOpen(true);
    }
  }, [dismissStatus]);

  const handleClose = () => {
    setIsOpen(false);
    dismissFeature();
  };

  const handleLearnMore = () => {
    dismissFeature();
    setIsOpen(false);
    router.push("/product/reference-manager");
  };

  return (
    <div>
      <BaseModal
        closeModal={handleClose}
        isOpen={isOpen}
        modalStyle={styles.modalStyle}
        zIndex={1000001}
        removeDefault
      >
        <div className={css(styles.container)}>
          <div className={css(styles.header)}>
            <img
              src="/static/products/workspace-graphic.svg"
              alt="Workspace Graphic"
              className={css(styles.headerImage)}
            />
            <div className={css(styles.title)}>
              Welcome to Reference Manager
            </div>
            <div className={css(styles.subtitle)}>
              A free, open-source reference manager that helps scientific teams
              draft, edit, and publish new research.
              <div style={{ marginBottom: 12 }} />
              Collaborate within your own private lab, or earn ResearchCoin for
              posting in the public.
            </div>
          </div>
          <div className={css(styles.footer)}>
            <Button
              label="Close"
              variant="outlined"
              onClick={handleClose}
              customButtonStyle={styles.footerButton}
            />
            <Button
              label="Learn More"
              onClick={handleLearnMore}
              variant="contained"
              customButtonStyle={styles.footerButton}
            />
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    maxWidth: 500,

    "@media only screen and (min-width: 768px)": {
      width: 500,
    },
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "calc(100% - 50px)",
    padding: 25,
    paddingBottom: 25,
  },

  header: {
    width: "100%",
    marginBottom: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  headerImage: {
    width: 200,
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 1.5,
    color: colors.MEDIUM_GREY(),
    marginTop: 24,
    textAlign: "center",
  },
  footer: {
    width: "100%",
    marginTop: 16,
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },
  footerButton: {
    flex: 1,
    minWidth: 160,
  },
});

export default ReferenceManagerIntroModal;
