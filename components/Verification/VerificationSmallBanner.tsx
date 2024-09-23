import React from 'react';
import { StyleSheet, css } from "aphrodite";
import Button from "../Form/Button";
import VerifiedBadge from "./VerifiedBadge";
import { breakpoints } from "~/config/themes/screen";
import { CloseIcon } from "~/config/themes/icons";
import VerifyIdentityModal from "~/components/Verification/VerifyIdentityModal";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const VerificationSmallBanner = ({ handleDismiss }) => {
  const auth = useSelector((state) => state.auth);

  return (
    <div className={css(styles.wrapper)}>
      <div className={css(styles.closeButtonWrapper)} onClick={handleDismiss}>
        <CloseIcon color={"white"} />
      </div>
      <div className={css(styles.avatarSection)}>
        <div className={css(styles.avatarWrapper)}>
          <img 
            src="/static/EinsteinAvatar.png" 
            alt="Einstein Avatar" 
            className={css(styles.avatar)}
          />
          <span className={css(styles.badgeWrapper)}>
            <VerifiedBadge height={28} width={28} showTooltipOnHover={false} />
          </span>
        </div>
      </div>
      <div className={css(styles.title)}>Verify & Unlock Perks</div>
      <ul className={css(styles.ctaWrapper)}>
        <li className={css(styles.listItem)}>
          <FontAwesomeIcon icon={faCheck} className={css(styles.checkIcon)} />
          Auto sync all of your papers
        </li>
        <li className={css(styles.listItem)}>
          <FontAwesomeIcon icon={faCheck} className={css(styles.checkIcon)} />
          Get a verified badge
        </li>
        <li className={css(styles.listItem)}>
          <FontAwesomeIcon icon={faCheck} className={css(styles.checkIcon)} />
          Fast track your earnings
        </li>
      </ul>
      <VerifyIdentityModal
        wsUrl={WS_ROUTES.NOTIFICATIONS(auth?.user?.id)}
        wsAuth
      >
        <div className={css(styles.ctaWrapper)}>
          <Button fullWidth type="primary" variant="outlined" size="med">
            Verify now
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
    marginTop: 10,
    fontSize: 16,
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
    marginTop: 10,
    marginBottom: 2,
    marginLeft: 10,
    fontSize: 22,
    fontWeight: 500,
    letterSpacing: "0.25px",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      fontSize: 16,
    },
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 10,
  },
  avatarWrapper: {
    position: 'relative',
    width: 50,
    height: 50,
  },
  avatar: {
    width: '115%',
    height: '115%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  badgeWrapper: {
    position: 'absolute',
    bottom: -13,
    right: -13,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    padding: 2,
  },
  listItem: {
    marginLeft: -30,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkIcon: {
    marginRight: 10,
    color: 'white',
    width: 16,
    height: 16,
  },
});

export default VerificationSmallBanner;