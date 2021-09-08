"use strict";

let serverSideNode;
if (!process.browser) {
  const jsdom = require("jsdom");
  const JSDOM = jsdom.JSDOM;
  serverSideNode = (new JSDOM(`<!DOCTYPE html>`)).window.Node;
}


/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */
function isElement(node) {

  const n = process.browser ? Node : serverSideNode;


  if (!node || !node.ownerDocument) {
    return false;
  }

  return node.nodeType === n.ELEMENT_NODE;
}

module.exports = isElement;