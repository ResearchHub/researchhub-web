export default function isQuillEmpty(content) {
  if (!content || JSON.stringify(content) == '{"ops":[{"insert":"\\n"}]}') {
    return true;
  } else {
    return false;
  }
}