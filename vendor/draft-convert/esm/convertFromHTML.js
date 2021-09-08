/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the /src directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
import { List, OrderedSet, Map } from 'immutable';
import { ContentState, CharacterMetadata, ContentBlock, Entity, BlockMapBuilder, genKey, SelectionState } from 'draft-js';
import getSafeBodyFromHTML from './util/parseHTML';
import rangeSort from './util/rangeSort';
var NBSP = '&nbsp;';
var SPACE = ' '; // Arbitrary max indent

var MAX_DEPTH = 4; // used for replacing characters in HTML

/* eslint-disable no-control-regex */

var REGEX_CR = new RegExp('\r', 'g');
var REGEX_LF = new RegExp('\n', 'g');
var REGEX_NBSP = new RegExp(NBSP, 'g');
var REGEX_BLOCK_DELIMITER = new RegExp('\r', 'g');
/* eslint-enable no-control-regex */
// Block tag flow is different because LIs do not have
// a deterministic style ;_;

var blockTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'pre'];
var inlineTags = {
  b: 'BOLD',
  code: 'CODE',
  del: 'STRIKETHROUGH',
  em: 'ITALIC',
  i: 'ITALIC',
  s: 'STRIKETHROUGH',
  strike: 'STRIKETHROUGH',
  strong: 'BOLD',
  u: 'UNDERLINE'
};

var handleMiddleware = function handleMiddleware(maybeMiddleware, base) {
  if (maybeMiddleware && maybeMiddleware.__isMiddleware === true) {
    return maybeMiddleware(base);
  }

  return maybeMiddleware;
};

var defaultHTMLToBlock = function defaultHTMLToBlock(nodeName, node, lastList) {
  return undefined;
};

var defaultHTMLToStyle = function defaultHTMLToStyle(nodeName, node, currentStyle) {
  return currentStyle;
};

var defaultHTMLToEntity = function defaultHTMLToEntity(nodeName, node) {
  return undefined;
};

var defaultTextToEntity = function defaultTextToEntity(text) {
  return [];
};

var nullthrows = function nullthrows(x) {
  if (x != null) {
    return x;
  }

  throw new Error('Got unexpected null or undefined');
};

var sanitizeDraftText = function sanitizeDraftText(input) {
  return input.replace(REGEX_BLOCK_DELIMITER, '');
};

function getEmptyChunk() {
  return {
    text: '',
    inlines: [],
    entities: [],
    blocks: []
  };
}

function getWhitespaceChunk(inEntity) {
  var entities = new Array(1);

  if (inEntity) {
    entities[0] = inEntity;
  }

  return {
    text: SPACE,
    inlines: [OrderedSet()],
    entities: entities,
    blocks: []
  };
}

function getSoftNewlineChunk(block, depth) {
  var flat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Map();

  if (flat === true) {
    return {
      text: '\r',
      inlines: [OrderedSet()],
      entities: new Array(1),
      blocks: [{
        type: block,
        data: data,
        depth: Math.max(0, Math.min(MAX_DEPTH, depth))
      }],
      isNewline: true
    };
  }

  return {
    text: '\n',
    inlines: [OrderedSet()],
    entities: new Array(1),
    blocks: []
  };
}

function getBlockDividerChunk(block, depth) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Map();
  return {
    text: '\r',
    inlines: [OrderedSet()],
    entities: new Array(1),
    blocks: [{
      type: block,
      data: data,
      depth: Math.max(0, Math.min(MAX_DEPTH, depth))
    }]
  };
}

function getBlockTypeForTag(tag, lastList) {
  switch (tag) {
    case 'h1':
      return 'header-one';

    case 'h2':
      return 'header-two';

    case 'h3':
      return 'header-three';

    case 'h4':
      return 'header-four';

    case 'h5':
      return 'header-five';

    case 'h6':
      return 'header-six';

    case 'li':
      if (lastList === 'ol') {
        return 'ordered-list-item';
      }

      return 'unordered-list-item';

    case 'blockquote':
      return 'blockquote';

    case 'pre':
      return 'code-block';

    case 'div':
    case 'p':
      return 'unstyled';

    default:
      return null;
  }
}

function baseCheckBlockType(nodeName, node, lastList) {
  return getBlockTypeForTag(nodeName, lastList);
}

function processInlineTag(tag, node, currentStyle) {
  var styleToCheck = inlineTags[tag];

  if (styleToCheck) {
    currentStyle = currentStyle.add(styleToCheck).toOrderedSet();
  } else if (node instanceof HTMLElement) {
    var htmlElement = node;
    currentStyle = currentStyle.withMutations(function (style) {
      if (htmlElement.style.fontWeight === 'bold') {
        style.add('BOLD');
      }

      if (htmlElement.style.fontStyle === 'italic') {
        style.add('ITALIC');
      }

      if (htmlElement.style.textDecoration === 'underline') {
        style.add('UNDERLINE');
      }

      if (htmlElement.style.textDecoration === 'line-through') {
        style.add('STRIKETHROUGH');
      }
    }).toOrderedSet();
  }

  return currentStyle;
}

function baseProcessInlineTag(tag, node) {
  var inlineStyles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : OrderedSet();
  return processInlineTag(tag, node, inlineStyles);
}

function joinChunks(A, B) {
  var flat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  // Sometimes two blocks will touch in the DOM and we need to strip the
  // extra delimiter to preserve niceness.
  var firstInB = B.text.slice(0, 1);
  var lastInA = A.text.slice(-1);
  var adjacentDividers = lastInA === '\r' && firstInB === '\r';
  var isJoiningBlocks = A.text !== '\r' && B.text !== '\r'; // when joining two full blocks like this we want to pop one divider

  var addingNewlineToEmptyBlock = A.text === '\r' && !A.isNewline && B.isNewline; // when joining a newline to an empty block we want to remove the newline

  if (adjacentDividers && (isJoiningBlocks || addingNewlineToEmptyBlock)) {
    A.text = A.text.slice(0, -1);
    A.inlines.pop();
    A.entities.pop();
    A.blocks.pop();
  } // Kill whitespace after blocks if flat mode is on


  if (A.text.slice(-1) === '\r' && flat === true) {
    if (B.text === SPACE || B.text === '\n') {
      return A;
    } else if (firstInB === SPACE || firstInB === '\n') {
      B.text = B.text.slice(1);
      B.inlines.shift();
      B.entities.shift();
    }
  }

  var isNewline = A.text.length === 0 && B.isNewline;
  return {
    text: A.text + B.text,
    inlines: A.inlines.concat(B.inlines),
    entities: A.entities.concat(B.entities),
    blocks: A.blocks.concat(B.blocks),
    isNewline: isNewline
  };
}
/*
 * Check to see if we have anything like <p> <blockquote> <h1>... to create
 * block tags from. If we do, we can use those and ignore <div> tags. If we
 * don't, we can treat <div> tags as meaningful (unstyled) blocks.
 */


function containsSemanticBlockMarkup(html) {
  return blockTags.some(function (tag) {
    return html.indexOf("<".concat(tag)) !== -1;
  });
}

function genFragment(node, inlineStyle, lastList, inBlock, fragmentBlockTags, depth, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options, inEntity) {
  var nodeName = node.nodeName.toLowerCase();
  var newBlock = false;
  var nextBlockType = 'unstyled'; // Base Case

  if (nodeName === '#text') {
    var text = node.textContent;

    if (text.trim() === '' && inBlock === null) {
      return getEmptyChunk();
    }

    if (text.trim() === '' && inBlock !== 'code-block') {
      return getWhitespaceChunk(inEntity);
    }

    if (inBlock !== 'code-block') {
      // Can't use empty string because MSWord
      text = text.replace(REGEX_LF, SPACE);
    }

    var entities = Array(text.length).fill(inEntity);
    var offsetChange = 0;
    var textEntities = checkEntityText(text, createEntity, getEntity, mergeEntityData, replaceEntityData).sort(rangeSort);
    textEntities.forEach(function (_ref) {
      var entity = _ref.entity,
          offset = _ref.offset,
          length = _ref.length,
          result = _ref.result;
      var adjustedOffset = offset + offsetChange;

      if (result === null || result === undefined) {
        result = text.substr(adjustedOffset, length);
      }

      var textArray = text.split('');
      textArray.splice.bind(textArray, adjustedOffset, length).apply(textArray, result.split(''));
      text = textArray.join('');
      entities.splice.bind(entities, adjustedOffset, length).apply(entities, Array(result.length).fill(entity));
      offsetChange += result.length - length;
    });
    return {
      text: text,
      inlines: Array(text.length).fill(inlineStyle),
      entities: entities,
      blocks: []
    };
  } // BR tags


  if (nodeName === 'br') {
    var _blockType = inBlock;

    if (_blockType === null) {
      //  BR tag is at top level, treat it as an unstyled block
      return getSoftNewlineChunk('unstyled', depth, true);
    }

    return getSoftNewlineChunk(_blockType || 'unstyled', depth, options.flat);
  }

  var chunk = getEmptyChunk();
  var newChunk = null; // Inline tags

  inlineStyle = processInlineTag(nodeName, node, inlineStyle);
  inlineStyle = processCustomInlineStyles(nodeName, node, inlineStyle); // Handle lists

  if (nodeName === 'ul' || nodeName === 'ol') {
    if (lastList) {
      depth += 1;
    }

    lastList = nodeName;
    inBlock = null;
  } // Block Tags


  var blockInfo = checkBlockType(nodeName, node, lastList, inBlock);
  var blockType;
  var blockDataMap;

  if (blockInfo === false) {
    return getEmptyChunk();
  }

  blockInfo = blockInfo || {};

  if (typeof blockInfo === 'string') {
    blockType = blockInfo;
    blockDataMap = Map();
  } else {
    blockType = typeof blockInfo === 'string' ? blockInfo : blockInfo.type;
    blockDataMap = blockInfo.data ? Map(blockInfo.data) : Map();
  }

  if (!inBlock && (fragmentBlockTags.indexOf(nodeName) !== -1 || blockType)) {
    chunk = getBlockDividerChunk(blockType || getBlockTypeForTag(nodeName, lastList), depth, blockDataMap);
    inBlock = blockType || getBlockTypeForTag(nodeName, lastList);
    newBlock = true;
  } else if (lastList && (inBlock === 'ordered-list-item' || inBlock === 'unordered-list-item') && nodeName === 'li') {
    var listItemBlockType = getBlockTypeForTag(nodeName, lastList);
    chunk = getBlockDividerChunk(listItemBlockType, depth);
    inBlock = listItemBlockType;
    newBlock = true;
    nextBlockType = lastList === 'ul' ? 'unordered-list-item' : 'ordered-list-item';
  } else if (inBlock && inBlock !== 'atomic' && blockType === 'atomic') {
    inBlock = blockType;
    newBlock = true;
    chunk = getSoftNewlineChunk(blockType, depth, true, // atomic blocks within non-atomic blocks must always be split out
    blockDataMap);
  } // Recurse through children


  var child = node.firstChild; // hack to allow conversion of atomic blocks from HTML (e.g. <figure><img
  // src="..." /></figure>). since metadata must be stored on an entity text
  // must exist for the entity to apply to. the way chunks are joined strips
  // whitespace at the end so it cannot be a space character.

  if (child == null && inEntity && (blockType === 'atomic' || inBlock === 'atomic')) {
    child = document.createTextNode('a');
  }

  if (child != null) {
    nodeName = child.nodeName.toLowerCase();
  }

  var entityId = null;

  while (child) {
    entityId = checkEntityNode(nodeName, child, createEntity, getEntity, mergeEntityData, replaceEntityData);
    newChunk = genFragment(child, inlineStyle, lastList, inBlock, fragmentBlockTags, depth, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options, entityId || inEntity);
    chunk = joinChunks(chunk, newChunk, options.flat);
    var sibling = child.nextSibling; // Put in a newline to break up blocks inside blocks

    if (sibling && fragmentBlockTags.indexOf(nodeName) >= 0 && inBlock) {
      var newBlockInfo = checkBlockType(nodeName, child, lastList, inBlock);
      var newBlockType = void 0;
      var newBlockData = void 0;

      if (newBlockInfo !== false) {
        newBlockInfo = newBlockInfo || {};

        if (typeof newBlockInfo === 'string') {
          newBlockType = newBlockInfo;
          newBlockData = Map();
        } else {
          newBlockType = newBlockInfo.type || getBlockTypeForTag(nodeName, lastList);
          newBlockData = newBlockInfo.data ? Map(newBlockInfo.data) : Map();
        }

        chunk = joinChunks(chunk, getSoftNewlineChunk(newBlockType, depth, options.flat, newBlockData), options.flat);
      }
    }

    if (sibling) {
      nodeName = sibling.nodeName.toLowerCase();
    }

    child = sibling;
  }

  if (newBlock) {
    chunk = joinChunks(chunk, getBlockDividerChunk(nextBlockType, depth, Map()), options.flat);
  }

  return chunk;
}

function getChunkForHTML(html, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options, DOMBuilder) {
  html = html.trim().replace(REGEX_CR, '').replace(REGEX_NBSP, SPACE);
  var safeBody = DOMBuilder(html);

  if (!safeBody) {
    return null;
  } // Sometimes we aren't dealing with content that contains nice semantic
  // tags. In this case, use divs to separate everything out into paragraphs
  // and hope for the best.


  var workingBlocks = containsSemanticBlockMarkup(html) ? blockTags.concat(['div']) : ['div']; // Start with -1 block depth to offset the fact that we are passing in a fake
  // UL block to sta rt with.

  var chunk = genFragment(safeBody, OrderedSet(), 'ul', null, workingBlocks, -1, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options); // join with previous block to prevent weirdness on paste

  if (chunk.text.indexOf('\r') === 0) {
    chunk = {
      text: chunk.text.slice(1),
      inlines: chunk.inlines.slice(1),
      entities: chunk.entities.slice(1),
      blocks: chunk.blocks
    };
  } // Kill block delimiter at the end


  if (chunk.text.slice(-1) === '\r') {
    chunk.text = chunk.text.slice(0, -1);
    chunk.inlines = chunk.inlines.slice(0, -1);
    chunk.entities = chunk.entities.slice(0, -1);
    chunk.blocks.pop();
  } // If we saw no block tags, put an unstyled one in


  if (chunk.blocks.length === 0) {
    chunk.blocks.push({
      type: 'unstyled',
      data: Map(),
      depth: 0
    });
  } // Sometimes we start with text that isn't in a block, which is then
  // followed by blocks. Need to fix up the blocks to add in
  // an unstyled block for this content


  if (chunk.text.split('\r').length === chunk.blocks.length + 1) {
    chunk.blocks.unshift({
      type: 'unstyled',
      data: Map(),
      depth: 0
    });
  }

  return chunk;
}

function convertFromHTMLtoContentBlocks(html, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options, DOMBuilder, generateKey) {
  // Be ABSOLUTELY SURE that the dom builder you pass hare won't execute
  // arbitrary code in whatever environment you're running this in. For an
  // example of how we try to do this in-browser, see getSafeBodyFromHTML.
  var chunk = getChunkForHTML(html, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options, DOMBuilder, generateKey);

  if (chunk == null) {
    return [];
  }

  var start = 0;
  return chunk.text.split('\r').map(function (textBlock, blockIndex) {
    // Make absolutely certain that our text is acceptable.
    textBlock = sanitizeDraftText(textBlock);
    var end = start + textBlock.length;
    var inlines = nullthrows(chunk).inlines.slice(start, end);
    var entities = nullthrows(chunk).entities.slice(start, end);
    var characterList = List(inlines.map(function (style, entityIndex) {
      var data = {
        style: style,
        entity: null
      };

      if (entities[entityIndex]) {
        data.entity = entities[entityIndex];
      }

      return CharacterMetadata.create(data);
    }));
    start = end + 1;
    return new ContentBlock({
      key: generateKey(),
      type: nullthrows(chunk).blocks[blockIndex].type,
      data: nullthrows(chunk).blocks[blockIndex].data,
      depth: nullthrows(chunk).blocks[blockIndex].depth,
      text: textBlock,
      characterList: characterList
    });
  });
}

var convertFromHTML = function convertFromHTML(_ref2) {
  var _ref2$htmlToStyle = _ref2.htmlToStyle,
      htmlToStyle = _ref2$htmlToStyle === void 0 ? defaultHTMLToStyle : _ref2$htmlToStyle,
      _ref2$htmlToEntity = _ref2.htmlToEntity,
      htmlToEntity = _ref2$htmlToEntity === void 0 ? defaultHTMLToEntity : _ref2$htmlToEntity,
      _ref2$textToEntity = _ref2.textToEntity,
      textToEntity = _ref2$textToEntity === void 0 ? defaultTextToEntity : _ref2$textToEntity,
      _ref2$htmlToBlock = _ref2.htmlToBlock,
      htmlToBlock = _ref2$htmlToBlock === void 0 ? defaultHTMLToBlock : _ref2$htmlToBlock;
  return function (html) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      flat: false
    };
    var DOMBuilder = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : getSafeBodyFromHTML;
    var generateKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : genKey;
    var contentState = ContentState.createFromText('');

    var createEntityWithContentState = function createEntityWithContentState() {
      if (contentState.createEntity) {
        var _contentState;

        contentState = (_contentState = contentState).createEntity.apply(_contentState, arguments);
        return contentState.getLastCreatedEntityKey();
      }

      return Entity.create.apply(Entity, arguments);
    };

    var getEntityWithContentState = function getEntityWithContentState() {
      if (contentState.getEntity) {
        var _contentState2;

        return (_contentState2 = contentState).getEntity.apply(_contentState2, arguments);
      }

      return Entity.get.apply(Entity, arguments);
    };

    var mergeEntityDataWithContentState = function mergeEntityDataWithContentState() {
      if (contentState.mergeEntityData) {
        var _contentState3;

        contentState = (_contentState3 = contentState).mergeEntityData.apply(_contentState3, arguments);
        return;
      }

      Entity.mergeData.apply(Entity, arguments);
    };

    var replaceEntityDataWithContentState = function replaceEntityDataWithContentState() {
      if (contentState.replaceEntityData) {
        var _contentState4;

        contentState = (_contentState4 = contentState).replaceEntityData.apply(_contentState4, arguments);
        return;
      }

      Entity.replaceData.apply(Entity, arguments);
    };

    var contentBlocks = convertFromHTMLtoContentBlocks(html, handleMiddleware(htmlToStyle, baseProcessInlineTag), handleMiddleware(htmlToEntity, defaultHTMLToEntity), handleMiddleware(textToEntity, defaultTextToEntity), handleMiddleware(htmlToBlock, baseCheckBlockType), createEntityWithContentState, getEntityWithContentState, mergeEntityDataWithContentState, replaceEntityDataWithContentState, options, DOMBuilder, generateKey);
    var blockMap = BlockMapBuilder.createFromArray(contentBlocks);
    var firstBlockKey = contentBlocks[0].getKey();
    return contentState.merge({
      blockMap: blockMap,
      selectionBefore: SelectionState.createEmpty(firstBlockKey),
      selectionAfter: SelectionState.createEmpty(firstBlockKey)
    });
  };
};

export default (function () {
  if (arguments.length >= 1 && typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string') {
    return convertFromHTML({}).apply(void 0, arguments);
  }

  return convertFromHTML.apply(void 0, arguments);
});