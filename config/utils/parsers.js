import { isNullOrUndefined } from "~/config/utils/nullchecks";

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

/**
 * Returns author objects from paper object
 *
 * @param { Object } paper - Paper JSON
 */
export const getUsersFromPaper = (paper, filterFunc, limit = 3) => {
  if (!paper) return []; // short circuit
  const { authors, uploaded_by, discussion_users } = paper;

  const seenUsers = {};
  const users = [];

  // add authors
  (authors || []).forEach((author) => {
    if (!seenUsers[author.id]) {
      users.push(author);
      seenUsers[author.id] = true;
    }
  });

  // add uploader
  if (uploaded_by) {
    const { author_profile: uploader } = uploaded_by;
    if (isNullOrUndefined(uploader)) {
      return [];
    }

    if (!seenUsers[uploader.id]) {
      users.push(uploader);
      seenUsers[uploader.id] = true;
    }
  }

  // add discussion users
  (discussion_users || []).forEach((discussionUser) => {
    const { author_profile: commenter } = discussionUser;
    if (isNullOrUndefined(commenter)) {
      return [];
    }

    if (!seenUsers[commenter.id]) {
      users.push(commenter);
      seenUsers[commenter.id] = true;
    }
  });

  if (filterFunc) {
    return users.filter(filterFunc).slice(0, limit);
  }

  return users.slice(0, limit);
};
