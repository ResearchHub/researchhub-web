import { css, StyleSheet } from "aphrodite";
import React, { ReactElement } from "react";

type Props = {};

export default function CitationTable({  }: Props): ReactElement<"div"> {
  return (
    <div className={css(styles.citationTable)}>
      <div>Column</div>
      <div>Body</div>
    </div>
  );
}

const styles = StyleSheet.create({
  citationTable: {},
});
