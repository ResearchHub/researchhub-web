import Link from "next/link";
import colors from "~/config/themes/colors";
import { SideColumnTitle } from "~/components/Typography";
import { StyleSheet, css } from "aphrodite";

const ColumnDOI = ({ paper }) => {
  return (
    <>
      <SideColumnTitle title={"DOI"} overrideStyles={styles.title} />
      <div className={css(styles.padding)}>
        <Link href={`https://www.doi.org/${paper.doi}`}>
          <a
            className={css(styles.link)}
          >{`https://www.doi.org/${paper.doi}`}</a>
        </Link>
      </div>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    margin: "15px 0px 0px",
  },
  padding: {
    padding: "10px 20px",
  },
  link: {
    alignItems: "center",
    color: colors.BLACK(),
    fontSize: 16,
    fontWeight: 500,
    textDecoration: "none",
    wordBreak: "break-word",
    ":hover": {
      color: colors.BLUE(),
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
});

export default ColumnDOI;
