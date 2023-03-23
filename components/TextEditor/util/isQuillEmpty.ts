import { isEmpty } from "~/config/utils/nullchecks";

export default function isQuillEmpty(content) {
  if (isEmpty(content) || JSON.stringify(content) == '{"ops":[{"insert":"\\n"}]}') {
    return true;
  } else {
    return false;
  }
}