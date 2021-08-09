import { css, StyleSheet } from "aphrodite";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import CitationAddNewButton from "./CitationAddNewButton";
import CitationTable from "./table/CitationTable";

export default function CitationContainer(): ReactElement<"div"> {
  const router = useRouter();
  const hypothesisID = Array.isArray(router.query.documentId)
    ? parseInt(router.query.documentId[0])
    : // @ts-ignore implied that this is a string / int
      parseInt(router.query.documentId);

  return (
    <div className={css(styles.citationContainer)}>
      <div className={css(styles.header)}>{"Relevant Sources"}</div>
      <CitationTable hypothesisID={hypothesisID} items={[]} />
      <CitationAddNewButton hypothesisID={hypothesisID} />
    </div>
  );
}

const styles = StyleSheet.create({
  citationContainer: {
    border: "1px solid red",
    borderRadius: 3,
    display: "flex",
    flexDirection: "column",
    height: 524,
    padding: 16,
    width: 1278,
  },
  header: {
    fontSize: 20,
    fontWeight: 500,
    width: "100%",
  },
});
