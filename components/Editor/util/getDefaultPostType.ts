import postTypes, { questionPostTypes } from "~/components/Editor/config/postTypes";

export default function getDefaultPostType({ documentType }) {
  if (documentType === "question") {
    return questionPostTypes.find(opt => opt.isDefault);
  }
  else {
    return postTypes.find(opt => opt.isDefault);
  }
}