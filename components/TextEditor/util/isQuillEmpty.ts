export default function isQuillEmpty(content) {
  if (JSON.stringify(content) == '{"ops":[{"insert":"\\n"}]}') {
    return true;
  } else {
    return false;
  }
}