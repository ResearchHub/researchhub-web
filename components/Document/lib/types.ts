import { Hypothesis } from "~/config/types/hypothesis";
import { Paper } from "~/config/types/paper";
import { Post } from "~/config/types/post";
import { TopLevelDocument } from "~/config/types/root_types";

interface Props {
  raw: any;
  type: string;
}

const getDocumentFromRaw = ({raw, type}: Props):Paper|Post|Hypothesis => {
  if (type === "paper") {
    return new Paper(raw);
  } else if (type === "post") {
    return new Post(raw);
  } else if (type === "hypothesis") {    
    return new Hypothesis(raw);
  } else {
    throw new Error(`Invalid document type. Type was ${type}`);
  }
}

export default getDocumentFromRaw;