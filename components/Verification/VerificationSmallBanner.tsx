import { StyleSheet, css } from "aphrodite";
import Button from "../Form/Button";
import VerifiedBadge from "./VerifiedBadge";
import { breakpoints } from "~/config/themes/screen";
import { CloseIcon } from "~/config/themes/icons";
import VerifyIdentityModal from "~/components/Verification/VerifyIdentityModal";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { useSelector } from "react-redux";

const VerificationSmallBanner = ({ handleDismiss }: { handleDismiss: Function }) => {
  const auth = useSelector((state: any) => state.auth);

  return (
    <div className={css(styles.wrapper)}>
      <div className={css(styles.closeButtonWrapper)} onClick={() => handleDismiss()}>
        <CloseIcon color={"white"} onClick={() => null} />
      </div>
      <VerifiedBadge height={32} width={32} showTooltipOnHover={false} />
      <div className={css(styles.title)}>Verify Identity</div>
      <p className={css(styles.description)}>
        Verify your identity to stand out and get faster withdraws.
      </p>

      {/* @ts-ignore */}
      <VerifyIdentityModal
        // @ts-ignore legacy
        wsUrl={WS_ROUTES.NOTIFICATIONS(auth?.user?.id)}
        // @ts-ignore legacy
        wsAuth
      >
        <div className={css(styles.ctaWrapper)}>
          <Button fullWidth type="primary" variant="outlined" size="small">
            Learn more
          </Button>
        </div>
      </VerifyIdentityModal>
    </div>
  );
};

const styles = StyleSheet.create({
  closeButtonWrapper: {
    position: "absolute",
    cursor: "pointer",
    top: 28,
    right: 26,
    zIndex: 2,
    color: "white",
  },
  ctaWrapper: {
    marginTop: 20,
  },
  wrapper: {
    backgroundImage: "url('/static/background/small-banner-background.png')",
    color: "white",
    height: "auto",
    width: "100%",
    backgroundRepeat: "round",
    padding: "15px 15px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginTop: 14,
    marginBottom: 2,
    fontSize: 22,
    fontWeight: 500,
    letterSpacing: "0.25px",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      fontSize: 16,
    },
  },
  description: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
    lineHeight: "19px",
  },
});

export default VerificationSmallBanner;
