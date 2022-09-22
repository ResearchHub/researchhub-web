import { ID } from "./root_types";

export type ContentType = {
  name: "paper" | "post" | "hypothesis" | "comment" | "document" | "question" | "bounty";
  id: ID;
};

export const parseContentType = (raw: any): ContentType => {
  let contentTypeName;
  if (["thread", "comment", "reply"].includes(raw.name)) {
    contentTypeName = "comment";
  } else if (raw.name === "paper") {
    contentTypeName = "paper";
  } else if (raw.name === "researchhubpost") {
    contentTypeName = "post";
  } else if (raw.name === "hypothesis") {
    contentTypeName = "hypothesis";
  } else if (raw.name === "researchhubunifieddocument") {
    contentTypeName = "document";
  } else if (raw.name === "purchase") {
      contentTypeName = "rsc_support";    
  } else {
    contentTypeName = raw.name;
    console.error("Could not parse object with content_type=" + raw.name);
  }

  return {
    id: raw.id,
    name: contentTypeName,
  };
};
