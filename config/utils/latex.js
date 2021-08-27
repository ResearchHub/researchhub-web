import { InlineMath, BlockMath } from "react-katex";

// Imported from katex package since it cannot be imported directly
const findEndOfMath = function (delimiter, text, startIndex) {
  // Adapted from
  // https://github.com/Khan/perseus/blob/master/src/perseus-markdown.jsx
  let index = startIndex;
  let braceLevel = 0;

  const delimLength = delimiter.length;

  while (index < text.length) {
    const character = text[index];

    if (
      braceLevel <= 0 &&
      text.slice(index, index + delimLength) === delimiter
    ) {
      return index;
    } else if (character === "\\") {
      index++;
    } else if (character === "{") {
      braceLevel++;
    } else if (character === "}") {
      braceLevel--;
    }

    index++;
  }

  return -1;
};

// Imported from katex package since it cannot be imported directly
const splitAtDelimiters = function (startData, leftDelim, rightDelim, display) {
  const finalData = [];

  for (let i = 0; i < startData.length; i++) {
    if (startData[i].type === "text") {
      const text = startData[i].data;

      let lookingForLeft = true;
      let currIndex = 0;
      let nextIndex;

      nextIndex = text.indexOf(leftDelim);
      if (nextIndex !== -1) {
        currIndex = nextIndex;
        finalData.push({
          type: "text",
          data: text.slice(0, currIndex),
        });
        lookingForLeft = false;
      }

      while (true) {
        if (lookingForLeft) {
          nextIndex = text.indexOf(leftDelim, currIndex);
          if (nextIndex === -1) {
            break;
          }

          finalData.push({
            type: "text",
            data: text.slice(currIndex, nextIndex),
          });

          currIndex = nextIndex;
        } else {
          nextIndex = findEndOfMath(
            rightDelim,
            text,
            currIndex + leftDelim.length
          );
          if (nextIndex === -1) {
            break;
          }

          finalData.push({
            type: "math",
            data: text.slice(currIndex + leftDelim.length, nextIndex),
            rawData: text.slice(currIndex, nextIndex + rightDelim.length),
            display: display,
          });

          currIndex = nextIndex + rightDelim.length;
        }

        lookingForLeft = !lookingForLeft;
      }

      finalData.push({
        type: "text",
        data: text.slice(currIndex),
      });
    } else {
      finalData.push(startData[i]);
    }
  }

  return finalData;
};

export const parseMath = (str) => {
  if (!str) return str;

  let data = [{ type: "text", data: str }];

  const delimiters = [
    { left: "$$", right: "$$", display: true },
    { left: "$", right: "$", display: true },
    { left: "\\(", right: "\\)", display: true },
    { left: "\\[", right: "\\]", display: true },
    { left: "\\begin{equation}", right: "\\end{equation}", display: true },
  ];

  for (let i = 0; i < delimiters.length; i++) {
    const delimiter = delimiters[i];
    data = splitAtDelimiters(
      data,
      delimiter.left,
      delimiter.right,
      delimiter.display || false
    );
  }

  const finalFragments = [];
  for (let i = 0; i < data.length; i++) {
    const fragment = data[i];
    if (fragment.type === "math" && fragment.display) {
      finalFragments.push(<InlineMath>{fragment.data}</InlineMath>);
    }
    // Text type
    else {
      finalFragments.push(<span>{fragment.data}</span>);
    }
  }

  return finalFragments;
};
