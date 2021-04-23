import { CompositeDecorator } from "draft-js";
import { ENTITY_KEY_TYPES } from "./PaperDraftUtilConstants";
import PaperDraftInlineCommentTextWrap from "../../PaperDraftInlineComment/PaperDraftInlineCommentTextWrap";
import WaypointSection from "../WaypointSection";

export function findEngrafoWarpperEntity(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() ===
        ENTITY_KEY_TYPES.ENGRAFO_WRAP
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

// TODO: calvinhlee - maybe refact below.
const getDefaultDecorators = ({
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
  paperExtractorType = CERMINE,
  seenEntityKeys,
  setActiveSection,
  setSeenEntityKeys,
}) {
  const defaultDecorator = getDefaultDecorators({
    seenEntityKeys,
    setActiveSection,
    setSeenEntityKeys,
  });

  return new CompositeDecorator(
    paperExtractorType === CERMINE
      ? defaultDecorator
      : [
          ...defaultDecorator,
          {
            component: <div>HEYHEY</div>,
            strategy: findEngrafoWarpperEntity,
          },
        ]
  );
}
