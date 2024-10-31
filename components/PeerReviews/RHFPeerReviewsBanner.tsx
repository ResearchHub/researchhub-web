import React from 'react';
import { StyleSheet, css } from "aphrodite";
import { CloseIcon } from "~/config/themes/icons";
import { breakpoints } from "~/config/themes/screen";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

type Props = {
  handleDismiss: () => void;
};

const RHFPeerReviewsBanner = ({ handleDismiss }: Props) => {
  return (
    <div className={css(styles.wrapper)}>
      <div className={css(styles.closeButtonWrapper)} onClick={handleDismiss}>
        <CloseIcon color={"white"} onClick={() => null} />
      </div>
      <div className={css(styles.titleWrapper)}>
        <div className={css(styles.title)}>Review preprints of your choice</div>
        <div className={css(styles.newTag)}>NEW</div>
      </div>
      <ul className={css(styles.ctaWrapper)}>
        <li className={css(styles.listItem)}>
          <FontAwesomeIcon icon={faCheck} className={css(styles.checkIcon)} />
          <span className={css(styles.listItemText)}>
            Users can <a 
              href="https://airtable.com/apptLQP8XMy1kaiID/paguOk9TtZktFk5WQ/form"
              className={css(styles.link)}
              target="_blank"
              rel="noopener noreferrer"
            >request</a> peer review grants for any preprint of their choice
          </span>
        </li>
        <li className={css(styles.listItem)}>
          <FontAwesomeIcon icon={faCheck} className={css(styles.checkIcon)} />
          <span className={css(styles.listItemText)}>
            Earn an extra <span className={css(styles.boldText)}>100 RSC</span> for awarded peer reviews through November 20th
          </span>
        </li>
      </ul>
    </div>
  );
};

const styles = StyleSheet.create({
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
  closeButtonWrapper: {
    position: "absolute",
    cursor: "pointer",
    top: 28,
    right: 26,
    zIndex: 2,
    color: "white",
  },
  title: {
    marginTop: 10,
    marginBottom: 15,
    marginLeft: 10,
    fontSize: 22,
    fontWeight: 500,
    letterSpacing: "0.25px",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      fontSize: 16,
    },
  },
  ctaWrapper: {
    marginTop: 10,
    fontSize: 16,
    paddingRight: 20,
  },
  listItem: {
    marginLeft: -30,
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  listItemText: {
    display: 'inline',
    lineHeight: '24px',
  },
  checkIcon: {
    marginRight: 10,
    color: 'white',
    width: 16,
    height: 16,
    marginTop: 4,
  },
  link: {
    color: 'white',
    textDecoration: 'underline',
    ':hover': {
      opacity: 0.8,
    },
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  newTag: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  boldText: {
    fontWeight: 600,
  },
});

export default RHFPeerReviewsBanner; 