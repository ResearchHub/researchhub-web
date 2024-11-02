import { ReactElement } from "react";
import { StyleSheet, css } from "aphrodite";
import { DEFAULT_ITEM_STYLE } from "~/components/shared/carousel/RhCarouselItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import VerifiedBadge from "./VerifiedBadge";
import Button from "../Form/Button";
import VerifyIdentityModal from "./VerifyIdentityModal";
import { useSelector } from "react-redux";
import { ROUTES as WS_ROUTES } from "~/config/ws";

export const getVerificationCarouselElements = () => [{
  title: (
    <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}>
      <div className={css(styles.titleWrapper)}>
        <div className={css(styles.avatarSection)}>
          <img 
            src="/static/EinsteinAvatar.png" 
            alt="Einstein Avatar" 
            className={css(styles.avatar)}
          />
          <span className={css(styles.badgeWrapper)}>
            <VerifiedBadge height={20} width={20} showTooltipOnHover={false} />
          </span>
        </div>
        <span className={css(styles.titleText)}>Verify & Unlock Perks</span>
      </div>
    </div>
  ),
  body: (
    <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
      <ul className={css(styles.bulletPoints)}>
        <li className={css(styles.bulletPoint)}>
          <FontAwesomeIcon 
            icon={faCheck} 
            className={css(styles.checkIcon)}
            style={{ color: 'white' }}
          />
          <span className={css(styles.listItemText)}>
            Auto sync all of your papers
          </span>
        </li>
        <li className={css(styles.bulletPoint)}>
          <FontAwesomeIcon 
            icon={faCheck} 
            className={css(styles.checkIcon)}
            style={{ color: 'white' }}
          />
          <span className={css(styles.listItemText)}>
            Get a verified badge
          </span>
        </li>
        <li className={css(styles.bulletPoint)}>
          <FontAwesomeIcon 
            icon={faCheck} 
            className={css(styles.checkIcon)}
            style={{ color: 'white' }}
          />
          <span className={css(styles.listItemText)}>
            Fast track your earnings
          </span>
        </li>
      </ul>
      <VerificationModalWrapper />
    </div>
  )
}];

// Separate component for the modal wrapper to handle Redux state
const VerificationModalWrapper = () => {
  const auth = useSelector((state: any) => state.auth);

  return (
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
  );
};

const styles = StyleSheet.create({
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginLeft: -8,
  },
  titleText: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: '0.25px',
    color: colors.WHITE(1),
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      fontSize: 14,
    },
  },
  avatarSection: {
    position: 'relative',
    width: 50,
    height: 50,
    marginTop: -2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  badgeWrapper: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  bulletPoints: {
    listStyle: 'none',
    padding: '0px 0px',
    margin: '12px 0',
  },
  bulletPoint: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  checkIcon: {
    width: 16,
    height: 16,
    marginTop: 4,
    marginRight: 1,
    color: 'white',
  },
  listItemText: {
    color: 'white',
    fontSize: 15,
    lineHeight: '24px',
    display: 'inline',
  },
  ctaWrapper: {
    marginTop: 16,
    width: '100%',
  },
}); 