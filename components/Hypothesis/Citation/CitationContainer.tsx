import { castUriID } from "../../../config/utils/castUriID";
import { css, StyleSheet } from "aphrodite";
import { ReactElement, useCallback, useState } from "react";
import { useRouter } from "next/router";
import CitationTable from "./table/CitationTable";

type Props = { lastFetchTime: number; onCitationUpdate: Function };

export default function CitationContainer({
  lastFetchTime,
  onCitationUpdate,
}: Props): ReactElement<"div"> {
  const router = useRouter();
  const hypothesisID = castUriID(router.query.documentId);

  return (
    <div className={css(styles.citationContainer)}>
      <div className={css(styles.header)}>{"Relevant Sources"}</div>
      <CitationTable
        hypothesisID={hypothesisID}
        lastFetchTime={lastFetchTime}
        updateLastFetchTime={onCitationUpdate}
      />
    </div>
  );
}

const styles = StyleSheet.create({
  citationContainer: {
    backgroundColor: "#fff",
    border: "1.5px solid #F0F0F0", // copying existing cards for borders
    borderRadius: 3,
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)", // copying existing cards
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    marginTop: 30,
    padding: 30,
    width: "100%",

    "@media only screen and (max-width: 767px)": {
      padding: 16,
    },
  },
  header: {
    fontFamily: "Roboto",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: 500,
  },
});
