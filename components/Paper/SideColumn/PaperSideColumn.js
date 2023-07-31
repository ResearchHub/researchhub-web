import ColumnAuthors from "~/components/Paper/SideColumn/ColumnAuthors";
import ColumnDOI from "~/components/Paper/SideColumn/ColumnDOI";
import ColumnDate from "~/components/Paper/SideColumn/ColumnDate";
import ColumnHubs from "~/components/Paper/SideColumn/ColumnHubs";
import ColumnJournal from "~/components/Paper/SideColumn/ColumnJournal";
import colors from "~/config/themes/colors";
import { StyleSheet, css } from "aphrodite";

const PaperSideColumn = (props) => {
  const { paper, paperId, authors, hubs, customStyle, isPost } = props;

  return (
    <div className={css(styles.root, customStyle && customStyle)}>
      {isPost && (
        <>
          <ColumnDate paper={paper} />
          {paper.doi && <ColumnDOI paper={paper} />}
        </>
      )}
      <ColumnAuthors paper={paper} authors={authors} paperId={paperId} />
      <ColumnHubs paper={paper} hubs={hubs} paperId={paperId} />
      {!isPost && <ColumnJournal paper={paper} paperId={paperId} />}
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    width: "100%",
    border: `1.5px solid ${colors.VERY_LIGHT_GREY()}`,
    borderRadius: 4,
    backgroundColor: colors.WHITE(),
    boxShadow: `0px 3px 4px ${colors.PURE_BLACK(0.02)}`,
    boxSizing: "border-box",
    paddingBottom: 5,
    "@media only screen and (max-width: 767px)": {
      marginBottom: 50,
    },
  },
  tabs: {
    width: "100%",
    display: "flex",
    cursor: "pointer",
  },
  tab: {
    height: 40,
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: `1px solid ${colors.VERY_LIGHT_GREY()}`,
    fontWeight: 500,
    background: colors.INPUT_BACKGROUND_GREY,
  },
  left: {
    borderRight: `1px solid ${colors.VERY_LIGHT_GREY()}`,
  },
  right: {
    borderLeft: `1px solid ${colors.VERY_LIGHT_GREY()}`,
  },
  active: {
    border: "unset",
    borderBottom: `3px solid ${colors.NEW_BLUE()}`,
    background: colors.WHITE(),
    color: colors.BLUE(),
    background: `linear-gradient(90deg, ${NEW_BLUE(0.1)} 0%, 
        ${NEW_BLUE(0)} 100%)`,
    boxSizing: "border-box",
  },
  rhIcon: {
    height: 17,
    marginRight: 10,
    width: 12,
  },
  commentIcon: {
    marginRight: 10,
    color: colors.BLUE(),
  },
});

export default PaperSideColumn;
