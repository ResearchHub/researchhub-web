import icons, { textEditorIcons } from "~/config/themes/icons";

const postTypes = [{
  label: "Discuss",
  value: "discuss",
  isDefault: true,
  group: "contribute",
  icon: icons.commentRegular,
  placeholder: "What are your thoughts about this paper?",
},{
  label: "Peer review",
  value: "review",  
  group: "contribute",
  placeholder: "What are your overall impressions of this paper?",
  icon: icons.starFilled,
},{
  label: "Summary",
  value: "summary",
  group: "contribute",
  placeholder: "Contribute a summary of this paper to the community",
  icon: icons.layerGroup,
},{
  label: "Peer review",
  value: "request_review",
  placeholder: "Add details about your peer review request. What are you looking for exactly?",
  group: "request",
  icon: icons.starFilled,
}, {
  label: "Summary",
  value: "request_summary",  
  placeholder: "Add details about your summary request. What are you looking for exactly?",
  group: "request",
  icon: icons.layerGroup,
}];

export const questionPostTypes = [{
  label: "Answer",
  value: "answer",
  isDefault: true,
  icon: icons.commentAltLineSolid,
  placeholder: "Submit your answer to this question.",
},{
  label: "Discuss",
  value: "discuss",
  icon: icons.commentRegular,
  placeholder: "Use discussion to ask for clarification or suggest improvement to the question.",
}]

export default postTypes;
