import { ID } from "./root_types";

export type ContentType = {
  name: "paper" | "post" | "hypothesis" | "comment" ,
  id: ID,
}

export const parseContentType = (raw: any): ContentType => {
  let contentTypeName;
  if (["thread", "comment", "reply"].includes(raw.name)) {
    contentTypeName = "comment";
  }
  else if (raw.name === "paper") {
    contentTypeName = "paper";
  }
  else if (raw.name === "researchhubpost") {
    contentTypeName = "post";
  }
  else if (raw.name === "hypothesis") {
    contentTypeName = "hypothesis";
  }
  else {
    throw Error("Could not parse object with content_type=" + raw.name)
  }    

  return {
    id: raw.id,
    name: contentTypeName,
  }
}
