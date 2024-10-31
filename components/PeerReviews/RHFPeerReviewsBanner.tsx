import React from 'react';
import { StyleSheet, css } from "aphrodite";
import { CloseIcon } from "~/config/themes/icons";
import { breakpoints } from "~/config/themes/screen";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import ContentBadge from "../ContentBadge";
import { formatBountyAmount } from "~/config/types/bounty";
import numeral from "numeral";

type Props = {
  handleDismiss: () => void;
};

const RHFPeerReviewsBanner = ({ handleDismiss }: Props) => {
  const bountyAmount = 100;

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
            >request</a> peer review grants on any preprint
          </span>
        </li>
        <li className={css(styles.listItem)}>
          <FontAwesomeIcon icon={faCheck} className={css(styles.checkIcon)} />
          <span className={css(styles.listItemText)}>
            Earn an extra <span className={css(styles.inlineBadge)}>
              <ContentBadge
                badgeOverride={styles.badge}
                contentType="bounty"
                bountyAmount={bountyAmount}
                label={
                  <div style={{ display: "flex", whiteSpace: "pre" }}>
                    <div className={css(styles.mobile)}>
                      {numeral(formatBountyAmount({
                        amount: bountyAmount,
                      })).format("0,0a")}{" "}
                      RSC
                    </div>
                    <div className={css(styles.desktop)}>
                      {formatBountyAmount({
                        amount: bountyAmount,
                      })}{" "}
                      RSC
                    </div>
                  </div>
                }
              />
            </span> for awarded peer reviews through November 20th
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
  inlineBadge: {
    display: 'inline-flex',
    verticalAlign: 'middle',
    margin: '0 2px',
  },
  badge: {
    padding: "4px 12px",
    fontWeight: 500,
    borderRadius: "8px",
    background: 'rgba(245, 223, 185, 0.85)',
    color: '#F3A113',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(245, 223, 185, 0.95)',
      color: '#F3A113',
    },
  },
  mobile: {
    "@media only screen and (min-width: 768px)": {
      display: "none",
    },
  },
  desktop: {
    display: "flex",
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
});

export default RHFPeerReviewsBanner; 