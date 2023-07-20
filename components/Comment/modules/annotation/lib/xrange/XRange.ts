// @ts-nocheck
// Imported by Kobe from previous project
// XRange is a wrapper around rangy's range object. Use it to serialize/unserialize a DOM range.
// Main use case is for creating annotations on documents.

import rangy from "rangy/lib/rangy-core.js";
import "rangy/lib/rangy-classapplier.js";
import "rangy/lib/rangy-textrange.js";
import XPathUtil from "./XPathUtil";

const IS_LOGGING_ON = true;

function log(msg: string, level?: string) {
  if (IS_LOGGING_ON) {
    if (level === "warning" && typeof msg === "string") {
      console.log("%c" + msg, "background: yellow; color: black");
    } else if (level === "info" && typeof msg === "string") {
      console.log("%c" + msg, "background: #d9edf7; color: black");
    } else if (level === "error" && typeof msg === "string") {
      console.log("%c" + msg, "color: red");
    } else if (level === "success" && typeof msg === "string") {
      console.log("%c" + msg, "color: green");
    } else {
      console.log(msg);
    }
  }
}

interface props {
  rangyObj?: any;
}

function XRange({ rangyObj }: props) {
  if (rangy.initialized === false) {
    rangy.init();
  }

  this.rangyObj = rangyObj ? rangyObj.cloneRange() : rangy.createRange();

  this.setIndex(0); // Index is zero by default.
}

XRange.prototype.moveStart = function (count, unit) {
  var unit = unit || "character";

  this.rangyObj.moveStart(unit, count);
};

XRange.prototype.moveEnd = function (count, unit) {
  var unit = unit || "character";

  this.rangyObj.moveEnd(unit, count);
};

XRange.prototype.getBlockParent = function () {
  let node = this.rangyObj.commonAncestorContainer;
  if (this._getDisplayType(node) === "block") {
    return node;
  } else {
    node = node.parentNode;
    while (this._getDisplayType(node) !== "block") {
      node = node.parentNode;
    }

    return node;
  }
};

XRange.prototype._getDisplayType = function (element) {
  if (element.nodeType != Node.ELEMENT_NODE) return "";

  const cStyle = element.currentStyle || window.getComputedStyle(element, "");
  return cStyle.display;
};

XRange.prototype.copy = function () {
  return new XRange({ rangyObj: this.rangyObj.cloneRange() });
};

XRange.prototype.serialize = function ({
  // Used to ignore a portion of the serialized xpath
  // Use when you want to serialize a range relative to a node
  ignoreXPathPrefix,
}: {
  ignoreXPathPrefix?: string;
}) {
  let serialized: any = {};

  try {
    const serializedAbsolutePos = {
      startContainerPath: XPathUtil.getXPathFromNode(
        this.rangyObj.startContainer
      ),
      startOffset: this.rangyObj.startOffset,
      endContainerPath: XPathUtil.getXPathFromNode(this.rangyObj.endContainer),
      endOffset: this.rangyObj.endOffset,
      collapsed: this.rangyObj.collapsed,
      text: this.textContent(),
    };

    serialized = serializedAbsolutePos;

    if (ignoreXPathPrefix) {
      // Serialized XRange of the content relative to the parent node.
      // Effectively ignoring xpath prior to the relative node xpath.
      const serializedEffectivePath = {
        startContainerPath: serializedAbsolutePos.startContainerPath!.substring(
          ignoreXPathPrefix.length || 0
        ),
        startOffset: serializedAbsolutePos.startOffset,
        endContainerPath: serializedAbsolutePos.endContainerPath!.substring(
          ignoreXPathPrefix.length
        ),
        endOffset: serializedAbsolutePos.endOffset,
        collapsed: serializedAbsolutePos.collapsed,
      };

      serialized = serializedEffectivePath;
    }

    if (this.index) {
      serialized.index = this.index;
    }
  } catch (error: any) {
    log(error);
    log("Error serializing xRange object", "error");
    log(JSON.stringify(error), "error");
    return null;
  }

  return serialized;
};

XRange.prototype.textContent = function () {
  return this.rangyObj.text();
};

XRange.prototype.setStart = function (startNode, startOffset) {
  this.rangyObj.setStart(startNode, startOffset);
};

XRange.prototype.getStart = function () {
  return this.rangyObj.startOffset;
};

XRange.prototype.getStartContainer = function () {
  return this.rangyObj.startContainer;
};

XRange.prototype.setEnd = function (endNode, endOffset) {
  this.rangyObj.setEnd(endNode, endOffset);
};

XRange.prototype.getEnd = function () {
  return this.rangyObj.endOffset;
};

XRange.prototype.getEndContainer = function () {
  return this.rangyObj.endContainer;
};

XRange.prototype.setIndex = function (index) {
  this.index = index;
};

XRange.prototype.getIndex = function (index) {
  return this.index;
};

// Sometimes, unserializing an object will create a range collapsed to the beginning of the document
XRange.prototype.isAtDocumentStart = function () {
  if (
    this.getEndContainer() === document &&
    this.getStartContainer() === document &&
    this.getEnd() === 0 &&
    this.getStart() === 0
  ) {
    return true;
  }

  return false;
};

XRange.prototype.getNativeRange = function () {
  return this.rangyObj.nativeRange;
};

XRange.createFromSelection = function () {
  let xr;

  try {
    const nativeRange = window.getSelection().getRangeAt(0);

    xr = new XRange({});
    xr.setStart(nativeRange.startContainer, nativeRange.startOffset);
    xr.setEnd(nativeRange.endContainer, nativeRange.endOffset);
  } catch (error) {
    log("Error creating from selection", "error");
    log(error);
    return null;
  }

  return xr;
};

XRange.createFromNode = function (node) {
  try {
    var xr = new XRange({});
    xr.selectNodeContents(node);
  } catch (error) {
    log("Error creating from node", "error");
    log(node);
    return null;
  }

  return xr;
};

XRange.createFromSerialized = function ({
  serialized,
  xpathPrefix = "",
}: {
  serialized: any;
  xpathPrefix?: string;
}) {
  try {
    const _serialized = {
      ...serialized,
      startContainerPath: xpathPrefix + serialized.startContainerPath,
      endContainerPath: xpathPrefix + serialized.endContainerPath,
    };

    var xr = new XRange({});
    xr._unserialize(_serialized);

    if (_serialized.index) {
      xr.setIndex(_serialized.index);
    }

    if (xr.isAtDocumentStart()) {
      return null;
    }
  } catch (error: any) {
    log("Error unserializing range", "error");
    log(JSON.stringify(serialized), "error");
    log(error, "error");
    return null;
  }

  return xr;
};

XRange.prototype.selectNodeContents = function (node) {
  this.rangyObj.selectNodeContents(node);
};

XRange.prototype._unserialize = function (serialized) {
  let startContainer,
    endContainer,
    endOffset,
    evaluator = new XPathEvaluator();
  startContainer = evaluator.evaluate(
    serialized.startContainerPath,
    document.documentElement,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  if (!startContainer.singleNodeValue) {
    return null;
  }

  if (serialized.collapsed || !serialized.endContainerPath) {
    endContainer = startContainer;
    endOffset = serialized.startOffset;
  } else {
    endContainer = evaluator.evaluate(
      serialized.endContainerPath,
      document.documentElement,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    if (!endContainer.singleNodeValue) {
      return null;
    }

    endOffset = serialized.endOffset;
  }

  // map to range object
  const range = rangy.createRange();
  range.setStart(startContainer.singleNodeValue, serialized.startOffset);
  range.setEnd(endContainer.singleNodeValue, endOffset);

  this.rangyObj = range;
};

XRange.prototype.indexOf = function (pattern, ignoreChars) {
  if (pattern.length == 0) return null;

  const range = this.rangyObj.cloneRange();

  const isFound = range.findText(pattern, {
    wholeWordsOnly: false,
    characterOptions: {
      ignoreCharacters: ignoreChars ? ignoreChars.join("") : "",
    },
    direction: "backwards", // TODO: Direction cannot be static like this
  });

  return isFound ? new XRange({ rangyObj: range }) : null;
};

XRange.prototype.getCoordinates = function ({ relativeEl }) {
  const rects = this.getNativeRange().getClientRects();
  const containerRect = relativeEl.getBoundingClientRect();
  const positions = Array.from(rects).map((rect: any) => ({
    x: rect.left - containerRect.left,
    y: rect.top - containerRect.top,
    width: rect.width,
    height: rect.height,
  }));

  // There could be a lot of position rectangles the represent selected text.
  // Sometimes thousands. We want to consolidate them into the smallest number of rectangles possible because
  // later on, we will be drawing a <Canvas /> element for each rectangle. As you can imagine, we will run into
  // serious performance issues if we have thousands of <Canvas /> elements.
  const consolidatedPositions = [];
  for (let i = 0; i < positions.length; i++) {
    let { x: x1, y: y1, width: w1, height: h1 } = positions[i];

    // Sometimes the range object will return tiny rectangles that mess up the flow of consolidating rectangles
    // Not quite sure why this happen but what I do know is that we can safely ignore these.
    if (
      positions[i].x === 0 ||
      positions[i].y === 0 ||
      positions[i].width === 0 ||
      positions[i].height === 0
    ) {
      i++;
      continue;
    }

    let j = i + 1;
    while (j < positions.length && positions[j].x >= x1) {
      w1 = positions[j].x + positions[j].width - x1;
      j++;
    }
    consolidatedPositions.push({ x: x1, y: y1, width: w1, height: h1 });
    i = j - 1; // Fast forward to the last position that was consolidated
  }

  console.log("consolidated", consolidatedPositions);

  return consolidatedPositions;
};

export default XRange;
