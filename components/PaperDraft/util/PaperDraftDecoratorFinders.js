import { CompositeDecorator } from "draft-js";
import { ENTITY_KEY_TYPES } from "./PaperDraftUtilConstants";
import PaperDraftInlineCommentTextWrap from "../../PaperDraftInlineComment/PaperDraftInlineCommentTextWrap";
import WaypointSection from "../WaypointSection";

export function findEngrafoEntity(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() ===
        ENTITY_KEY_TYPES.INLINE_COMMENT
    );
  }, callback);
}

export function findInlineCommentEntity(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() ===
        ENTITY_KEY_TYPES.INLINE_COMMENT
    );
  }, callback);
}

export function findWayPointEntity(seenEntityKeys, setSeenEntityKeys) {
  return (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      if (!Boolean(seenEntityKeys[entityKey])) {
        setSeenEntityKeys({ ...seenEntityKeys, [entityKey]: true });
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() ===
            ENTITY_KEY_TYPES.WAYPOINT
        );
      }
    }, callback);
  };
}

const DEFAULT_DRAFT_DECORATORS = ({
  seenEntityKeys,
  setActiveSection,
  setSeenEntityKeys,
}) => [
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
];

export function getDecorator({
  seenEntityKeys,
  setActiveSection,
  setSeenEntityKeys,
}) {
  return new CompositeDecorator(
    DEFAULT_DRAFT_DECORATORS({
      seenEntityKeys,
      setActiveSection,
      setSeenEntityKeys,
    })
  );
}

export function getDecoratorWithEngrafo({
  seenEntityKeys,
  setActiveSection,
  setSeenEntityKeys,
}) {
  return new CompositeDecorator(
    ...DEFAULT_DRAFT_DECORATORS({
      seenEntityKeys,
      setActiveSection,
      setSeenEntityKeys,
    }),
    {
      component: (props) => (
        <EngrafoWrap {...props} onSectionEnter={setActiveSection} />
      ),
      strategy: findEngrafo(seenEntityKeys, setSeenEntityKeys),
    }
  );
}
