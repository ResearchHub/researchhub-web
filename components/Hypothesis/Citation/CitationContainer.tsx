import { css, StyleSheet } from "aphrodite";
import { useRouter } from "next/router";
import { ReactElement, useCallback, useState } from "react";
import CitationTable from "./table/CitationTable";

export default function CitationContainer(): ReactElement<"div"> {
  const router = useRouter();
  const hypothesisID = Array.isArray(router.query.documentId)
    ? parseInt(router.query.documentId[0])
    : // @ts-ignore implied that this is a string / int
      parseInt(router.query.documentId);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const updateLastFetchTime = useCallback(() => setLastFetchTime(Date.now()), [
    setLastFetchTime,
  ]);

  return (
    <div className={css(styles.citationContainer)}>
      <div className={css(styles.header)}>{"Relevant Papers"}</div>
      <CitationTable
        hypothesisID={hypothesisID}
        lastFetchTime={lastFetchTime}
        updateLastFetchTime={updateLastFetchTime}
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
  },
  header: {
    fontFamily: "Roboto",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: 500,
  },
});
