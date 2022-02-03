import * as moment from "dayjs";
import { SideColumnTitle } from "~/components/Typography";
import { StyleSheet, css } from "aphrodite";
import { formatPublishedDate } from "~/config/utils/dates";

const ColumnHubs = ({ paper }) => {
  return (
    <>
      <SideColumnTitle title={"Published"} overrideStyles={styles.title} />
      <div className={css(styles.date)}>
        {formatPublishedDate(moment(paper.created_date), true)}
      </div>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    margin: "15px 0px 0px",
  },
  date: {
    alignItems: "center",
    display: "flex",
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.3,
    padding: "10px 20px 5px",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
});

export default ColumnHubs;
