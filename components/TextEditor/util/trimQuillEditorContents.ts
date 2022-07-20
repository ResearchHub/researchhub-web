export default function trimQuillEditorContents ({ contents }) {
  const deltas = Array.isArray(contents) ? contents : contents?.ops ? contents.ops : [];

  console.log('deltas', deltas)
  if (deltas.length > 0) {
    const firstDelta = deltas[0];
    const isFirstDeltaString = (typeof firstDelta?.insert === "string" && !firstDelta.attributes);

    if (isFirstDeltaString) {
      let trimmedStr = firstDelta.insert.trimStart();
      deltas[0].insert = trimmedStr;
    }

    const lastDelta = deltas[deltas.length - 1];
    const isLastDeltaString = (typeof lastDelta?.insert === "string" && !lastDelta.attributes);
    if (isLastDeltaString) {
      let trimmedStr = lastDelta.insert.trimEnd();
      deltas[deltas.length-1].insert = trimmedStr;
    }
  }

  return deltas;
}
