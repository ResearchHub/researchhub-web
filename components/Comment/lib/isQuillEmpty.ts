export default function isQuillEmpty(content) {
  return !content || JSON.stringify(content) === '{"ops":[{"insert":"\\n"}]}';
}
