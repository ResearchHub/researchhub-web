import icons, { textEditorIcons } from "~/config/themes/icons";

const postTypes = [{
  label: "Discuss",
  value: "discuss_paper",
  isDefault: true,
  group: "contribute",
  icon: icons.commentRegular,
  placeholder: "What are your thoughts about this paper?",
  hoverLabel: "Discuss paper with community",
},{
  label: "Peer review",
  value: "submit_review",  
  group: "contribute",
  placeholder: "What are your overall impressions of this paper?",
  icon: icons.starFilled,
},{
  label: "Summary",
  value: "submit_summary",
  group: "contribute",
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

export default postTypes;
