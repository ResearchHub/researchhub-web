import { ReactElement } from "react";
import { StyleSheet, css } from "aphrodite";
import { DEFAULT_ITEM_STYLE } from "~/components/shared/carousel/RhCarouselItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import colors from "~/config/themes/colors";
import { bountyColors } from "~/config/themes/colors";
import ContentBadge from "~/components/ContentBadge";
import { formatBountyAmount } from "~/config/types/bounty";
import { breakpoints } from "~/config/themes/screen";

export const getPeerReviewCarouselElements = () => [{
  title: (
    <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}>
      <div className={css(styles.titleWrapper)}>
        <div className={css(styles.titleText)}>Review preprints of your choice</div>
        <div className={css(styles.newTagContainer)}>
          <div className={css(styles.newTag)}>NEW</div>
        </div>
      </div>
    </div>
  ),
  newTag: true,
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
            Users can <a 
              href="https://airtable.com/apptLQP8XMy1kaiID/paguOk9TtZktFk5WQ/form"
              className={css(styles.link)}
              target="_blank"
              rel="noopener noreferrer"
            >request</a> peer review grants on any preprint
          </span>
        </li>
        <li className={css(styles.bulletPoint)}>
          <FontAwesomeIcon 
            icon={faCheck} 
            className={css(styles.checkIcon)}
            style={{ color: 'white' }}
          />
          <span className={css(styles.listItemText)}>
            Earn an extra{" "}
            <span className={css(styles.inlineBadge)}>
              <ContentBadge
                badgeOverride={styles.badge}
                contentType="bounty"
                bountyAmount={100}
                label={
                  <div style={{ display: "flex", whiteSpace: "pre" }}>
                    {formatBountyAmount({ amount: 100 })} RSC
                  </div>
                }
              />
            </span>{" "}
            for awarded peer reviews through November 20th
          </span>
        </li>
      </ul>
    </div>
  )
}];

const styles = StyleSheet.create({
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginLeft: -8,
  },
  newTagContainer: {
    marginTop: -2,
    display: 'flex',
    alignItems: 'center',
  },
  newTag: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: 'white',
    whiteSpace: 'nowrap',
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
  bulletPoints: {
    listStyle: 'none',
    padding: '0px 0px',
    margin: '12px 0',
  },
  bulletPoint: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
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
  link: {
    color: 'white',
    textDecoration: 'underline',
    ':hover': {
      opacity: 0.8,
    },
  },
  inlineBadge: {
    display: 'inline-flex',
    verticalAlign: 'middle',
    margin: '0 2px',
  },
  badge: {
    padding: "4px 8px",
    fontWeight: 500,
    borderRadius: "4px",
    background: bountyColors.BADGE_BACKGROUND,
    color: bountyColors.BADGE_TEXT,
    transition: 'all 0.2s ease',
    ':hover': {
      background: bountyColors.BADGE_BACKGROUND,
      color: bountyColors.BADGE_TEXT,
      transform: 'scale(1.1)',
    },
  },
}); 