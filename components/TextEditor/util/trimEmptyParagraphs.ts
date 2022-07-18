export default function trimEmptyParagraphs({ htmlStr }) {
  let updatedStr = null;
  const lastParIndex = htmlStr.lastIndexOf("<p>");
  if (lastParIndex > -1) {
    const substringToTest = htmlStr.substring(lastParIndex);
    if (substringToTest.match(/<p><br>(&nbsp;)<\/p>/g)) {
      updatedStr = htmlStr.substring(0, lastParIndex)
    }
  }

  return updatedStr || htmlStr;
}