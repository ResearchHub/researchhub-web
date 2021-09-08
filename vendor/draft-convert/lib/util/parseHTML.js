"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parseHTML;


let win;
if (!process.browser) {
  const jsdom = require("jsdom");
  const JSDOM = jsdom.JSDOM;
  win = (new JSDOM(`<!DOCTYPE html>`)).window;
}
else {
  win = window;
}

var fallback = function fallback(html) {
  var doc = win.document.implementation.createHTMLDocument('');
  doc.documentElement.innerHTML = html;
  return doc;
};

function parseHTML(html) {
  var doc;

  if (typeof win.DOMParser !== 'undefined') {
    var parser = new win.DOMParser();
    doc = parser.parseFromString(html, 'text/html');

    if (doc === null || doc.body === null) {
      doc = fallback(html);
    }
  } else {
    doc = fallback(html);
  }

  return doc.body;
}