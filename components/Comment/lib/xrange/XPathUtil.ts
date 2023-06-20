function XPathUtil() {}

// Example: "/html/body/div/p[2]" will return "/html/body/div/p[1]"
// If not matching sibling is possible, will return null
// Does not validate against the DOM that the sibling is valid
XPathUtil.findPrevMatchingSibling = (xpathStr) => {
  if (typeof xpathStr !== "string") {
    return false;
  }

  const pieces = xpathStr.split("/");
  const lastPiece = pieces[pieces.length - 1];

  const start = lastPiece.indexOf("[");
  const end = lastPiece.indexOf("]");

  if (start > -1 && end > -1) {
    const numericPortion = lastPiece.match(/([0-9])+/g);
    const elementPortion = lastPiece.substr(0, start);

    if (!numericPortion) {
      return false;
    } else {
      const intVal = parseInt(numericPortion);

      if (intVal <= 1) {
        return false;
      }

      return (
        pieces.slice(0, pieces.length - 1).join("/") +
        `/${elementPortion}[${intVal - 1}]`
      );
    }
  }

  return false;
};

XPathUtil.findParentXPath = (xpathStr) => {
  if (typeof xpathStr !== "string") {
    return;
  }

  const pieces = xpathStr.split("/");
  return pieces.splice(0, pieces.length - 1).join("/");
};

XPathUtil.getXPathFromNode = function (node) {
  const paths = [];

  // Use nodeName (instead of localName) so namespace prefix is included (if any).
  for (
    ;
    node &&
    (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE);
    node = node.parentNode
  ) {
    let index = 0;

    if (node.id) {
      // if the document illegally re-uses an id, then we can't use it as a unique identifier
      const selector = '[id="' + node.id + '"]';

      // no jquery
      const length = document.querySelectorAll(selector).length;
      if (length === 1) {
        // because the first item of the path array is prefixed with '/', this will become
        // a double slash (select all elements). But as there's only one result, we can use [1]
        // eg: //*[@id='something'][1]/div/text()
        paths.splice(0, 0, '/*[@id="' + node.id + '"][1]');
        break;
      }
    }

    for (
      let sibling = node.previousSibling;
      sibling;
      sibling = sibling.previousSibling
    ) {
      // Ignore document type declaration.
      if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE) {
        continue;
      }

      if (sibling.nodeName === node.nodeName) {
        index++;
      }
    }

    const tagName =
      node.nodeType === Node.ELEMENT_NODE
        ? node.nodeName.toLowerCase()
        : "text()";
    const pathIndex = index ? "[" + (index + 1) + "]" : "";
    paths.splice(0, 0, tagName + pathIndex);
  }

  return paths.length ? "/" + paths.join("/") : null;
};

XPathUtil.getNodeFromXPath = function (xpath) {
  const aNode = document;
  const xpe = new XPathEvaluator();
  const nsResolver = xpe.createNSResolver(
    aNode.ownerDocument == null
      ? aNode.documentElement
      : aNode.ownerDocument.documentElement
  );
  const result = xpe.evaluate(xpath, aNode, nsResolver, 0, null);
  const found = [];
  let res;
  while ((res = result.iterateNext())) found.push(res);

  return found[0];
};

// // A simple XPath evaluator using jQuery which can evaluate queries of
// XPathUtil.simpleXPathJQuery = function(relativeRoot) {
//   let jq = this.map(function() {
//     let path = '';
//     let elem = this;

//     while (((elem != null ? elem.nodeType : undefined) === Node.ELEMENT_NODE) && (elem !== relativeRoot)) {
//       let tagName = elem.tagName.replace(':', '\\:');
//       let idx = $(elem.parentNode).children(tagName).index(elem) + 1;

//       idx  = `[${idx}]`;
//       path = `/${elem.tagName.toLowerCase()}${idx}${path}`;
//       elem = elem.parentNode;
//     }

//     return path;
//   });

//   return jq.get();
// };

// A simple XPath evaluator using only standard DOM methods which can
// evaluate queries of the form /tag[index]/tag[index].
XPathUtil.simpleXPathPure = function (relativeRoot) {
  const getPathSegment = function (node) {
    const name = XPathUtil.getNodeName(node);
    const pos = XPathUtil.getNodePosition(node);
    return `${name}[${pos}]`;
  };

  const rootNode = relativeRoot;

  const getPathTo = function (node) {
    let xpath = "";
    while (node !== rootNode) {
      if (node == null) {
        throw new Error(
          `Called getPathTo on a node which was not a descendant of @rootNode. ${rootNode}`
        );
      }
      xpath = getPathSegment(node) + "/" + xpath;
      node = node.parentNode;
    }
    xpath = `/${xpath}`;
    xpath = xpath.replace(/\/$/, "");
    return xpath;
  };

  const jq = this.map(function () {
    const path = getPathTo(this);

    return path;
  });

  return jq.get();
};

XPathUtil.findChild = function (node, type, index) {
  if (!node.hasChildNodes()) {
    throw new Error("XPath error: node has no children!");
  }
  const children = node.childNodes;
  let found = 0;
  for (const child of Array.from(children)) {
    const name = XPathUtil.getNodeName(child);
    if (name === type) {
      found += 1;
      if (found === index) {
        return child;
      }
    }
  }
  throw new Error("XPath error: wanted child not found.");
};

// Get the node name for use in generating an xpath expression.
XPathUtil.getNodeName = function (node) {
  const nodeName = node.nodeName.toLowerCase();
  switch (nodeName) {
    case "#text":
      return "text()";
    case "#comment":
      return "comment()";
    case "#cdata-section":
      return "cdata-section()";
    default:
      return nodeName;
  }
};

// Get the index of the node as it appears in its parent's child list
XPathUtil.getNodePosition = function (node) {
  let pos = 0;
  let tmp = node;
  while (tmp) {
    if (tmp.nodeName === node.nodeName) {
      pos++;
    }
    tmp = tmp.previousSibling;
  }
  return pos;
};

export default XPathUtil;
