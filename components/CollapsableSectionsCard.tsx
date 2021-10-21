import { css, StyleSheet } from "aphrodite";
import { FC, Fragment, ReactNode } from "react";
import Collapsible from "~/components/Form/Collapsible";
import icons from "~/config/themes/icons";

export type CollapsableSectionsCard = {
  customStyle: any;
  isOpen: boolean;
  title: string;
  before?: ReactNode;
  sections?: {
    before?: ReactNode;
    title: string;
    items: ReactNode[];
    after?: ReactNode;
  }[];
  after?: ReactNode;
};

export const CollapsableSectionsCard: FC<CollapsableSectionsCard> = ({
  customStyle,
  isOpen,
  title,
  sections = [],
  before = null,
  after = null,
}) => {
  return (
    <div className={css(styles.aboutContainer, customStyle)}>
      <div className={css(styles.aboutTitle)}>
        <img
          src={"/static/ResearchHubIcon.png"}
          className={css(styles.rhIcon)}
        />
        <div className={css(styles.aboutTitleText)}>{title}</div>
      </div>
      {before}
      {sections.map((section, idx) => (
        <Fragment key={idx}>
          {section.before || null}
          <Collapsible
            className={css(styles.collapsibleSection)}
            contentInnerClassName={css(styles.collapsibleContent)}
            open={isOpen}
            openedClassName={css(styles.collapsibleSection)}
            trigger={
              <div className={css(styles.trigger)}>
                {section.title}
                <span className={css(styles.chevronDown)}>
                  {icons.chevronDownLeft}
                </span>
              </div>
            }
          >
            <ul>
              {section.items.map((itemContent, idx) => (
                <li key={idx}>{itemContent}</li>
              ))}
            </ul>
          </Collapsible>
          {section.after || null}
        </Fragment>
      ))}
      {after}
    </div>
  );
};

const styles = StyleSheet.create({
  aboutContainer: {
    display: "flex",
    flexDirection: "column",
    background: "#FFFFFF",
    border: "1px solid #DEDEE6",
    borderRadius: "3px",
    padding: "24px 21px",
  },
  aboutTitle: {
    display: "flex",
  },
  aboutTitleText: {
    fontWeight: "bold",
    fontSize: "12px",
    lineHeight: "14px",
    letterSpacing: "1.2px",
    textTransform: "uppercase",

    margin: "auto 18px",
    color: "#241F3A",
    opacity: 0.4,
  },
  rhIcon: {
    width: "20px",
    height: "31px",
  },
  collapsibleSection: {
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "21px",
    color: "#000000",
    marginTop: 24,
  },
  collapsibleContent: {
    marginLeft: "3px",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "26px",
    color: "#241F3A",
  },
  chevronDown: {
    marginLeft: "auto",
  },
  trigger: {
    display: "flex",
    cursor: "pointer",
  },
});
