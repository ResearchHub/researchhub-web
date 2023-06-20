import XPathUtil from "./XPathUtil";
import rangy from "rangy/lib/rangy-core.js";
import XRange from "./XRange";

const XRangeUtil = {};

XRangeUtil.findClosestValidXrange = (serializedRange, ignoreNode = null) => {
  const MAX_TRAVERSAL_LENGTH = 150;
  let i = 0,
    xrange;
  let currentSerializedRange = Object.assign({}, serializedRange);
  while (!xrange) {
    i++;

    xrange = XRange.createFromSerialized(currentSerializedRange);
    if (xrange) {
      if (ignoreNode) {
        const nativeRange = xrange.getNativeRange();
        const doesIgnoreNodeContainRange =
          nativeRange.commonAncestorContainer &&
          ignoreNode.contains(nativeRange.commonAncestorContainer);
        if (doesIgnoreNodeContainRange) {
          xrange = null; // Reset so that loop does not end
        } else {
          // Range is not a descendant of ignoreNode
          break;
        }
      } else {
        break;
      }
    } else if (i >= MAX_TRAVERSAL_LENGTH) {
      break;
    }

    // No Xrange found. Pick another path to go through.

    // NOTE: At this time, the sibling search only startContainer because there is no reason to search endContainer
    const siblingXpath = XPathUtil.findPrevMatchingSibling(
      currentSerializedRange.startContainerPath
    );
    if (siblingXpath) {
      currentSerializedRange = XRangeUtil.resetContainersToXPath(
        currentSerializedRange,
        siblingXpath
      );
      continue;
    }

    const parentXpath = XPathUtil.findParentXPath(
      currentSerializedRange.startContainerPath
    );
    if (parentXpath) {
      currentSerializedRange = XRangeUtil.resetContainersToXPath(
        currentSerializedRange,
        parentXpath
      );
      continue;
    }

    return null;
  }

  return xrange;
};

XRangeUtil.resetContainersToXPath = (serializedRange, newXpath) => {
  if (typeof serializedRange !== "object") {
    return null;
  }

  const copy = Object.assign({}, serializedRange);

  copy.startContainerPath = newXpath;
  copy.endContainerPath = newXpath;
  copy.startOffset = 0;
  copy.endOffset = 0;
  copy.collapsed = true;

  return copy;
};

XRangeUtil.includes = (xrange, xrangeList) => {
  for (let i = 0; i < xrangeList.length; i++) {
    const current = xrangeList[i];
    if (
      xrange.textContent() === current.textContent() &&
      xrange.startOffset === current.startOffset &&
      xrange.endOffset === current.endOffset
    ) {
      return true;
    }
  }

  return false;
};

XRangeUtil.getLargestToken = (xrangeTokens) => {
  let largest;
  xrangeTokens.forEach((xrange) => {
    if (!largest) {
      largest = xrange;
    } else if (xrange.textContent().length > largest.textContent().length) {
      largest = xrange;
    }
  });

  return largest;
};

XRangeUtil.calculateTokenPctMatch = function (xrangeTokens, pattern) {
  let numWordsFound = 0;
  const numWordsInPattern = XRangeUtil.getWords(pattern).length;

  if (xrangeTokens.length > 0) {
    xrangeTokens.forEach((token) => {
      numWordsFound += XRangeUtil.getWords(token.textContent()).length;
    });
  }

  return numWordsFound / numWordsInPattern;
};

XRangeUtil.flatten = function (array) {
  var flatten = function (ary) {
    let flat = [];

    for (const el of Array.from(ary)) {
      flat = flat.concat(el && $.isArray(el) ? flatten(el) : el);
    }

    return flat;
  };

  return flatten(array);
};

XRangeUtil.getWords = (str) => {
  return str.trim().replace(/\s+/g, " ").split(" ");
};

// Custom by K0b3
XRangeUtil.getPreContext = ({ rangySelection, wordLength = 25 }) => {
  if (!rangySelection) return null;

  const range = rangySelection.getRangeAt(0);
  const preContext = null;

  range.collapse(true);
  range.moveStart("word", -wordLength);

  let match = null;
  let lastIndexOfSpecialChar = null;
  let currText = range.text();
  while ((match = /\r|\n/.exec(currText)) !== null) {
    currText = currText.substr(match.index + 1);
    lastIndexOfSpecialChar = match.index + 1;
  }

  return currText || null;
};

// Custom by K0b3
XRangeUtil.getPostContext = ({ rangySelection, wordLength = 25 }) => {
  if (!rangySelection) return null;

  const postContext = null;
  const range = rangySelection.getRangeAt(0);

  range.collapse(false);
  range.moveEnd("word", wordLength);

  const match = /\r|\n/.exec(range.text());
  if (match) {
    return range.text().substr(0, match.index - 1) || null;
  }

  return range.text() || null;
};

// Public: Finds all text nodes within the elements in the current collection.
//
// Returns a new jQuery collection of text nodes.
XRangeUtil.getTextNodes = function (jq) {
  var getTextNodes = function (node) {
    if (node && node.nodeType !== Node.TEXT_NODE) {
      const nodes = [];

      // If not a comment then traverse children collecting text nodes.
      // We traverse the child nodes manually rather than using the .childNodes
      // property because IE9 does not update the .childNodes property after
      // .splitText() is called on a child text node.
      if (node.nodeType !== Node.COMMENT_NODE) {
        // Start at the last child and walk backwards through siblings.
        node = node.lastChild;
        while (node) {
          nodes.push(getTextNodes(node));
          node = node.previousSibling;
        }
      }

      // Finally reverse the array so that nodes are in the correct order.
      return nodes.reverse();
    } else {
      return node;
    }
  };

  return jq.map(function () {
    return XRangeUtil.flatten(getTextNodes(this));
  });
};

// Public: determine the last text node inside or before the given node
XRangeUtil.getLastTextNodeUpTo = function (n) {
  switch (n.nodeType) {
    case Node.TEXT_NODE:
      return n; // We have found our text node.
      break;
    case Node.ELEMENT_NODE:
      // This is an element, we need to dig in
      if (n.lastChild != null) {
        // Does it have children at all?
        const result = XRangeUtil.getLastTextNodeUpTo(n.lastChild);
        if (result != null) {
          return result;
        }
      } else {
      }
      break;
  }
  // Not a text node, and not an element node.
  // Could not find a text node in current node, go backwards
  n = n.previousSibling;
  if (n != null) {
    return XRangeUtil.getLastTextNodeUpTo(n);
  } else {
    return null;
  }
};

// Public: determine the first text node in or after the given jQuery node.
XRangeUtil.getFirstTextNodeNotBefore = function (n) {
  switch (n.nodeType) {
    case Node.TEXT_NODE:
      return n; // We have found our text node.
      break;
    case Node.ELEMENT_NODE:
      // This is an element, we need to dig in
      if (n.firstChild != null) {
        // Does it have children at all?
        const result = XRangeUtil.getFirstTextNodeNotBefore(n.firstChild);
        if (result != null) {
          return result;
        }
      } else {
      }
      break;
  }
  // Not a text or an element node.
  // Could not find a text node in current node, go forward
  n = n.nextSibling;
  if (n != null) {
    return XRangeUtil.getFirstTextNodeNotBefore(n);
  } else {
    return null;
  }
};

XRangeUtil.xpathFromNode = function (el, relativeRoot) {
  relativeRoot = document;
  let result;
  try {
    result = XPathUtil.simpleXPathJQuery.call(el, relativeRoot);
  } catch (exception) {
    result = XPathUtil.simpleXPathPure.call(el, relativeRoot);
  }
  return result;
};

XRangeUtil.nodeFromXPath = function (xp, root) {
  const steps = xp.substring(1).split("/");
  let node = root;
  for (const step of Array.from(steps)) {
    let [name, idx] = Array.from(step.split("["));
    idx =
      idx != null ? parseInt((idx != null ? idx.split("]") : undefined)[0]) : 1;
    node = findChild(node, name.toLowerCase(), idx);
  }

  return node;
};

XRangeUtil.wrapTextNodesInRange = function ({
  nativeRange,
  id,
  className,
  tagName,
  attributes = {},
  highlightData = null,
}) {
  if (rangy.initialized === false) {
    rangy.init();
  }

  const rangyRange = rangy.createRange();
  rangyRange.setStart(nativeRange.startContainer, nativeRange.startOffset);
  rangyRange.setEnd(nativeRange.endContainer, nativeRange.endOffset);

  const applier = rangy.createClassApplier(className, {
    elementTagName: tagName,
    elementAttributes: { "data-id": id, style: "background: yellow" },
    ignoreWhiteSpace: true,
    onElementCreate: function (el, applier) {
      el.classList.add(`${className}-${id}`);
      // $(el).attr(attributes);
    },
  });
  applier.applyToRange(rangyRange);
};

XRangeUtil.isTrivialStr = function (str) {
  return XRangeUtil.getWords(str) <= 3;
};
// Gets the percantage of str1 words found in str2
XRangeUtil.calculatePctMatch = (str1, str2) => {
  const str1Words = XRangeUtil.getWords(str1);
  const str2Words = XRangeUtil.getWords(str2);
  const wordsFound = str2Words.filter((w) => str1Words.includes(w));

  return wordsFound.length / str1Words.length;
};

export default XRangeUtil;
