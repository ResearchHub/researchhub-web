export default function ({ quillRef }) {
  const deltas = quillRef.getContents()?.ops || [];
  let hasContent = false;

  for (let i = 0; i < deltas.length; i++) {
    if (
      typeof deltas[i].insert === "object" ||
      (typeof deltas[i].insert === "string" && deltas[i].insert.length > 0)
    ) {
      hasContent = true;
      break;
    }
  }

  return hasContent;
}
