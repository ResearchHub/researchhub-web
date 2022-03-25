import Link from "next/link";
import colors from "~/config/themes/colors";
import { SideColumnTitle } from "~/components/Typography";
import { StyleSheet, css } from "aphrodite";

const ColumnDOI = ({ paper }) => {
  return (
    <>
      <SideColumnTitle title={"DOI"} overrideStyles={styles.title} />
      <Link href={`https://www.doi.org/${paper.doi}`}>
        <a className={css(styles.link)}>{`https://www.doi.org/${paper.doi}`}</a>
      </Link>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    margin: "15px 0px 0px",
  },
  link: {
    alignItems: "center",
    borderLeft: `3px solid #FFF`,
    color: colors.BLACK(),
    display: "flex",
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.3,
    padding: "10px 17px",
    textDecoration: "none",
    transition: "all ease-out 0.1s",
    wordBreak: "break-word",
    ":hover": {
      background: "#FAFAFA",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
  },
});

export default ColumnDOI;
