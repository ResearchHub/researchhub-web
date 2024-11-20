import { ReactElement } from "react";
import { StyleSheet, css } from "aphrodite";
import { DEFAULT_ITEM_STYLE } from "~/components/shared/carousel/RhCarouselItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import colors from "~/config/themes/colors";
import RhJournalIcon from "~/components/Icons/RhJournalIcon";
import Button from "../Form/Button";

export const getJournalCarouselElements = () => [{
  title: (
    <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}>
      <div className={css(styles.titleWrapper)}>
        <div className={css(styles.avatarSection)}>
          <RhJournalIcon width={40} height={40} color={colors.WHITE()} />
        </div>
        <span className={css(styles.titleText)}>ResearchHub Journal</span>
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
            14 days to peer reviews
          </span>
        </li>
        <li className={css(styles.bulletPoint)}>
          <FontAwesomeIcon 
            icon={faCheck} 
            className={css(styles.checkIcon)}
            style={{ color: 'white' }}
          />
          <span className={css(styles.listItemText)}>
            Paid peer reviewers
          </span>
        </li>
        <li className={css(styles.bulletPoint)}>
          <FontAwesomeIcon 
            icon={faCheck} 
            className={css(styles.checkIcon)}
            style={{ color: 'white' }}
          />
          <span className={css(styles.listItemText)}>
            Open access by default
          </span>
        </li>
      </ul>
      <div className={css(styles.ctaWrapper)}>
        <Button 
          fullWidth 
          type="primary" 
          variant="outlined" 
          size="med"
          onClick={() => window.open('./researchhub-journal', '_self')}
        >
          Learn more
        </Button>
      </div>
    </div>
  )
}];

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
  },
  avatarSection: {
    position: 'relative',
    width: 50,
    height: 50,
    marginTop: -2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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