import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import isQuillEmpty from "./isQuillEmpty";

export default function hasQuillContent({ quillRef }) {
  const contents = quillRef.getContents();
  const deltas = contents?.ops || [];
  let hasContent = false;

  if (isQuillEmpty(contents)) {
    return false;
  }

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
