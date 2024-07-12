import React from 'react';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { css, StyleSheet } from "aphrodite";

// This helps put whitespace in the right spots
const preprocessContent = (content) => {
  return content.replace(/<\/?mml:math[^>]*>/g, ' ')
    .replace(/<\/?mml:mrow[^>]*>/g, '')
    .replace(/<\/?mml:msub[^>]*>/g, '')
    .replace(/<\/?mml:mi[^>]*>/g, '')
    .replace(/<\/?mml:mn[^>]*>/g, '')
    .replace(/<\/?mml:mo[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .replace(/ (\S)/g, '&nbsp;$1');
};

const MathRenderer = ({ content }) => {
  if (!content || typeof content !== "string") return content;

  const preprocessedContent = preprocessContent(content);

  return (
    <MathJax>
      <div className={css(styles.mathContainer)} dangerouslySetInnerHTML={{ __html: preprocessedContent }} />
    </MathJax>
  );
};

const styles = StyleSheet.create({
  mathContainer: {
    overflowWrap: "break-word",
    whiteSpace: "normal",
    wordBreak: "break-all",
  },
});



export default MathRenderer;
