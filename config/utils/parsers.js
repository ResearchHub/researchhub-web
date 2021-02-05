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

export const getHostFromPath = (path) => {
  if (path) {
    const pathArray = path.split(".");
    return pathArray[1];
  }
  return null;
};
