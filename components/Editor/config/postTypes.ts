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
  icon: icons.starFilled,
},{
  label: "Summary",
  value: "submit_summary",
  group: "contribute",
  icon: textEditorIcons.bulletedList,
},{
  label: "Peer review",
  value: "request_review",
  placeholder: "Add details about your peer review request. What are you looking for?",
  group: "request",
  icon: icons.starFilled,
}, {
  label: "Summary",
  value: "request_summary",  
  group: "request",
  icon: textEditorIcons.bulletedList,
}];

export default postTypes;
