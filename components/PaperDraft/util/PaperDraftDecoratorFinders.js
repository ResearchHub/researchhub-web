import { CompositeDecorator } from "draft-js";
import { INLINE_COMMENT_MAP } from "./PaperDraftTextEditorUtil";
import PaperDraftInlineCommentTextWrap from "../../PaperDraftInlineComment/PaperDraftInlineCommentTextWrap";
import WaypointSection from "../WaypointSection";

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

export function getDecorator({
  seenEntityKeys,
  setActiveSection,
  setSeenEntityKeys,
}) {
  return new CompositeDecorator([
    {
      component: (props) => (
        <WaypointSection {...props} onSectionEnter={setActiveSection} />
      ),
      strategy: findWayPointEntity(seenEntityKeys, setSeenEntityKeys),
    },
    {
      component: (props) => <PaperDraftInlineCommentTextWrap {...props} />,
      strategy: findInlineCommentEntity,
    },
  ]);
}
