/**
 * Returns the value of `name` in the url `hash` path.
 *
 * @param {string} name name of parameter
 * @param {string} path url path
 * @returns {string}
 */
export const getFragmentParameterByName = (name, path) => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\#&]" + name + "=([^&#]*)");
  const results = regex.exec(path);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
};

export const getJournalFromURL = (url) => {
  if (url) {
    const matches = url.match(/^https?\:\/\/(?:www\.)?([^\/?#]+)(?:[\/?#]|$)/i);
    // extract hostname (will be null if no match is found)
    return matches && matches[1] ? matches[1].split(".")[0] : null;
  }
  return null;
};
