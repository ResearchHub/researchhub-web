import { INLINE_COMMENT_MAP } from "../../PaperDraftInlineComment/util/paperDraftInlineCommentUtil";

export function findWayPointEntity(seenEntityKeys, setSeenEntityKeys) {
  return (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      if (!Boolean(seenEntityKeys[entityKey])) {
        setSeenEntityKeys({ ...seenEntityKeys, [entityKey]: true });
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === "WAYPOINT"
        );
      }
    }, callback);
  };
}

export function findInlineCommentEntity(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() ===
        INLINE_COMMENT_MAP.TYPE_KEY
    );
  }, callback);
}
