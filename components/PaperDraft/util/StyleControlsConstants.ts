import { EXTRACTOR_TYPE } from "./PaperDraftUtilConstants";
import { ValueOf } from "../../../config/types/root_types";

type StyleControllButtonOptions =
  | typeof CERMINE_BLOCK_STYLE_OPTIONS
  | typeof ENGRAFO_BLOCK_STYLE_OPTIONS;

export const CERMINE_BLOCK_STYLE_OPTIONS = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
];

export const ENGRAFO_BLOCK_STYLE_OPTIONS = [
  { label: "H1", style: null },
  { label: "H2", style: null },
  { label: "UL", style: null },
  { label: "OL", style: null },
];

export const INLINE_STYLE_OPTIONS = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
];

const { CERMINE, ENGRAFO } = EXTRACTOR_TYPE;

export const getStyleControlButtonOptions = (
  extractorType: ValueOf<typeof EXTRACTOR_TYPE>
): StyleControllButtonOptions => {
  switch (extractorType) {
    case CERMINE:
      return CERMINE_BLOCK_STYLE_OPTIONS;
    case ENGRAFO:
    default:
      return ENGRAFO_BLOCK_STYLE_OPTIONS;
  }
};
