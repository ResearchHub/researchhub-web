import { ID } from "./root_types";

export type ContentType = {
  name: "paper" | "post" | "hypothesis" | "comment" | "document" | "question" | "bounty" | "rsc_support";
  id: ID;
};

export const parseContentType = (raw: any): ContentType => {
  let contentTypeName;
  const inputName = raw.name || raw.model;
  if (["thread", "comment", "reply", "rhcommentmodel"].includes(inputName)) {
    contentTypeName = "comment";
  } else if (inputName === "paper") {
    contentTypeName = "paper";
  } else if (inputName === "researchhubpost") {
    contentTypeName = "post";
  } else if (inputName === "hypothesis") {
    contentTypeName = "hypothesis";
  } else if (inputName === "researchhubunifieddocument") {
    contentTypeName = "document";
  } else if (inputName === "purchase") {
      contentTypeName = "rsc_support";    
  } else if (inputName === "bounty") {
      contentTypeName = "bounty";          
  } else {
    contentTypeName = inputName;
    console.error("Could not parse object with content_type=" + inputName);
  }

  return {
    id: raw.id,
    name: contentTypeName,
  };
};
