import Link from "next/link";
import ResearchHubPopover from "~/components/ResearchHubPopover";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { css, StyleSheet } from "aphrodite";
import { useState } from "react";

const SidebarSectionContent = ({
  currentNoteId,
  noteId,
  orgName,
  title,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <>
      <Link href={`/notebook/${orgName}/${noteId}`} key={noteId}>
        <a
          className={css(
            styles.sidebarSectionContent,
            noteId === currentNoteId && styles.active,
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={css(styles.noteIcon)}>{icons.paper}</div>
          {title}
          <div>
            <ResearchHubPopover
              align={"end"}
              isOpen={isPopoverOpen}
              padding={5}
              popoverContent={
                <div className={css(styles.popoverBodyContent)}>
                  <div
                    className={css(styles.popoverBodyItem, styles.blueHover)}
                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                  >
                    <div className={css(styles.popoverBodyIcon)}>{icons.lock}</div>
                    <div>Make private</div>
                  </div>
                  <div
                    className={css(styles.popoverBodyItem, styles.blueHover)}
                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                  >
                    <div className={css(styles.popoverBodyIcon)}>{icons.clone}</div>
                    <div>Duplicate</div>
                  </div>
                  <div
                    className={css(styles.popoverBodyItem, styles.redHover)}
                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                  >
                    <div className={css(styles.popoverBodyIcon)}>{icons.trash}</div>
                    <div>Delete</div>
                  </div>
                </div>
              }
              positions={["bottom"]}
              setIsPopoverOpen={setIsPopoverOpen}
              targetContent={
                <div
                  className={css(styles.ellipsisButton, !isHovered && !isPopoverOpen && styles.hideEllipsis)}
                  onClick={(e) => {
                    e && e.preventDefault();
                    setIsPopoverOpen(!isPopoverOpen);
                  }}
                >
                  {icons.ellipsisV}
                </div>
              }
            />
          </div>
        </a>
      </Link>
    </>
  );
};

const styles = StyleSheet.create({
  sidebarSectionContent: {
    backgroundClip: "padding-box",
    borderTop: `1px solid ${colors.GREY(0.3)}`,
    color: colors.BLACK(),
    cursor: "pointer",
    display: "flex",
    fontSize: 14,
    fontWeight: 500,
    padding: "20px 40px 20px 20px",
    position: "relative",
    textDecoration: "none",
    wordBreak: "break-word",
    ":hover": {
      backgroundColor: colors.GREY(0.3),
    },
    ":last-child": {
      borderBottom: `1px solid ${colors.GREY(0.3)}`,
    },
  },
  active: {
    backgroundColor: colors.GREY(0.3),
  },
  noteIcon: {
    color: colors.GREY(),
    marginRight: 10,
  },
  ellipsisButton: {
    alignItems: "center",
    borderRadius: "50%",
    bottom: 0,
    color: colors.BLACK(0.7),
    display: "flex",
    fontSize: 20,
    height: 27,
    justifyContent: "center",
    margin: "auto",
    position: "absolute",
    right: 7,
    top: 0,
    width: 27,
    ":hover": {
      backgroundColor: colors.GREY(0.7),
    },
  },
  hideEllipsis: {
    display: "none",
  },
  popoverBodyContent: {
    backgroundColor: "#fff",
    borderRadius: 4,
    boxShadow: "0px 0px 10px 0px #00000026",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
    width: 175,
  },
  popoverBodyItem: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    padding: 16,
    textDecoration: "none",
    wordBreak: "break-word",
    ":first-child": {
      borderRadius: "4px 4px 0px 0px",
    },
    ":last-child": {
      borderRadius: "0px 0px 4px 4px",
    },
  },
  blueHover: {
    ":hover": {
      color: "#fff",
      backgroundColor: "#3971ff",
    },
  },
  redHover: {
    ":hover": {
      color: "#fff",
      backgroundColor: colors.RED(0.8),
    },
  },
  popoverBodyIcon: {
    marginRight: 10,
  },
});

export default SidebarSectionContent;