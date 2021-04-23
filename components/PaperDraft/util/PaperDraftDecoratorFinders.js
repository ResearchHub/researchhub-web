import { CompositeDecorator } from "draft-js";
import { ENTITY_KEY_TYPES, EXTRACTOR_TYPE } from "./PaperDraftUtilConstants";
import EngrafoEntityWrapper from "./parse_tools/EngrafoEntityWrap";
import PaperDraftInlineCommentTextWrap from "../../PaperDraftInlineComment/PaperDraftInlineCommentTextWrap";
import WaypointSection from "../WaypointSection";

const { ENGRAFO_WRAP, INLINE_COMMENT, WAYPOINT } = ENTITY_KEY_TYPES;

export function findEngrafoWarpperEntity(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    console.warn("entityKey: ", entityKey);
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === ENGRAFO_WRAP
    );
  }, callback);
}

export function findInlineCommentEntity(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === INLINE_COMMENT
    );
  }, callback);
}

export function findWayPointEntity(seenEntityKeys, setSeenEntityKeys) {
  console.warn("LOOKING FOR WAY POINT");
  return (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      if (!Boolean(seenEntityKeys[entityKey])) {
        setSeenEntityKeys({ ...seenEntityKeys, [entityKey]: true });
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === WAYPOINT
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
    paperExtractorType === EXTRACTOR_TYPE.CERMINE
      ? defaultDecorator
      : [
          ...defaultDecorator,
          {
            component: (props) => <EngrafoEntityWrapper {...props} />,
            strategy: findEngrafoWarpperEntity,
          },
        ]
  );
}
