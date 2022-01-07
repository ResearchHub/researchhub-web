import { InlineMath } from "react-katex";

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
  return str;
  /*
    FIXME: Temporarily turning off katex rendering.
    Some papers are negatively affected which causes bad rendering.
    Before this turned on, we should have a featured to toggle on/off
    katex in some papers.
    Some characters are being misinterpreted by the katex renderer.
    Example string that leads to bad rendering:

    "
    Background: Anterior cruciate ligament (ACL) tears are one of the most devastating injuries seen in the National Basketball Association (NBA). No previous studies have examined the economic impact of ACL tears in the NBA. 
    Purpose/Hypothesis: The purpose of this study was to examine the economic impact of ACL tears on NBA players and teams by calculating the costs of recovery (COR) and classifying players based on preinjury success level (All-Star or equivalent, starter, or reserve) and salary (in US$ million: <1.5, 1.5-4, or >4 per season). It was hypothesized that players with a lower preinjury salary or primarily a reserve role would have decreased costs, lower rates of return to play (RTP), and shorter careers. 
    Study Design: Descriptive epidemiology study. 
    Methods: We reviewed the publicly available records of NBA players treated with ACL reconstruction from 2000 to 2015. Data collected included player demographics, player salaries, statistical performance using player efficiency rating (PER), and specifics regarding time missed and RTP rate. 
    Results: A total of 35 players met the study inclusion criteria. The cumulative economic loss from ACL injuries in the NBA from 2000 to 2015 was $99 million. The average COR was $2.9 million per player. RTP rate was 91% overall, with 70% retention at 3 years. Players that made a salary of less than $1.5 million per season before the injury had a significant drop in PER (difference of –7), RTP rate of 63%, and only 37% retention at 3 years. Conversely, recovering All-Star players also had a significant drop in PER (–6.2), and no players repeated as All-Stars in the season after ACL reconstruction (0%), although they did have a 100% RTP rate and an average career length of 5.6 seasons postinjury. 
    Conclusion: While the RTP rate in NBA athletes remained high, ACL reconstruction can result in decreased statistical performance and/or inability to return to prior levels of play. Players who made less than $1.5 million preinjury or played primarily in a reserve role were associated with lower RTP and retention in the NBA at 3 years.
    "
  */

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
      finalFragments.push(
        <InlineMath renderError={(error) => ""}>{fragment.data}</InlineMath>
      );
    }
    // Text type
    else {
      finalFragments.push(<span>{fragment.data}</span>);
    }
  }

  return finalFragments;
};
