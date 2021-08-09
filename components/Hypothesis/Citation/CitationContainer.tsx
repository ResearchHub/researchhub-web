import { css, StyleSheet } from "aphrodite";
import React, { ReactElement } from "react";
import CitationAddNewButton from "./CitationAddNewButton";
import CitationTable from "./CitationTable";

export default function CitationContainer(): ReactElement<"div"> {
  return (
    <div className={css(styles.citationContainer)}>
      <div className={css(styles.header)}>Relevant Sources</div>
      <CitationTable />
      <CitationAddNewButton />
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
