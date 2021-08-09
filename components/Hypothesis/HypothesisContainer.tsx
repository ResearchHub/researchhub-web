import { css, StyleSheet } from "aphrodite";
import CitationContainer from "./citation/CitationContainer";
import React, { ReactElement } from "react";

type Props = {};

export default function HypothesisContainer(props: Props): ReactElement<"div"> {
  return (
    <div className={css(styles.container)}>
      {"Hi this is Hypothesis: Thomas's code goes here"}
      <CitationContainer />
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
