// TODO: calvinhlee improve this maybe
export function htmlToBlockForEngrafo({ idsToRemove, node, nodeName }) {
  return {
    type: node.className /* type corresponds to rendered className in Draft */,
    data: {},
  };
}

export function htmlToEntity() {}
