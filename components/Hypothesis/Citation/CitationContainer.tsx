import { castUriID } from "../../../config/utils/castUriID";
import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";
import { useRouter } from "next/router";
import CitationTable from "./table/CitationTable";
import { breakpoints } from "~/config/themes/screen";

type Props = { lastFetchTime: number; onCitationUpdate: Function };

export default function CitationContainer({
  lastFetchTime,
  onCitationUpdate,
}: Props): ReactElement<"div"> {
  const router = useRouter();
  const hypothesisID = castUriID(router.query.documentId);

  return (
    <div className={css(styles.citationContainer)}>
      <div className={css(styles.citationGroup)}>
        <div className={css(styles.header)}>{"Supporting Sources"}</div>
        <CitationTable
          citationType="SUPPORT"
          hypothesisID={hypothesisID}
          key="citation-support"
          lastFetchTime={lastFetchTime}
          updateLastFetchTime={onCitationUpdate}
        />
      </div>
      <div className={css(styles.citationGroup)}>
        <div className={css(styles.header)}>{"Rejecting Sources"}</div>
        <CitationTable
          citationType="REJECT"
          hypothesisID={hypothesisID}
          key="citation-reject"
          lastFetchTime={lastFetchTime}
          updateLastFetchTime={onCitationUpdate}
        />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  citationContainer: {
    alignItems: "flex-start",
    display: "flex",
    justifyContent: "space-between",
    boxSizing: "border-box",
    marginTop: 30,
    width: "100%",
    maxWidth: "100%",
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      flexDirection: "column",
    },
  },
  header: {
    fontFamily: "Roboto",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: 500,
  },
  citationGroup: {
    backgroundColor: "#fff",
    border: "1.5px solid #F0F0F0", // copying existing cards for borders
    borderRadius: 3,
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)", // copying existing cards
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    padding: 30,
    width: "49.5%",
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      width: "100%",
      marginBottom: 16,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 16,
    },
  },
});
