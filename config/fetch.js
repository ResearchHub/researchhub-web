import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { emailPreference } from "./shims";

export const fetchEmailPreference = async () => {
  let params = API.GET_CONFIG();
  const data = await fetch(API.EMAIL_PREFERENCE({}), params)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
  if (data.results) {
    if (data.results.length === 1) {
      return emailPreference(data.results[0]);
    }
  }
};

export const updateEmailPreference = async (emailRecipientId, data) => {
  let params = API.PATCH_CONFIG(data);
  return await fetch(API.EMAIL_PREFERENCE({ emailRecipientId }), params)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const subscribeToHub = async (hubId) => {
  const config = API.POST_CONFIG();
  return await fetch(API.HUB_SUBSCRIBE({ hubId }), config)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .catch((err) => {
      //Todo: handle error
    });
};

export const unsubscribeFromHub = async (hubId) => {
  const config = API.POST_CONFIG();
  return await fetch(API.HUB_UNSUBSCRIBE({ hubId }), config)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .catch((err) => {
      //Todo: handle error
    });
};

export const sendAmpEvent = async (payload, cb) => {
  return fetch(API.AMP_ANALYTICS, API.POST_CONFIG(payload))
    .then(Helpers.checkStatus)
    .then((res) => cb && cb(res));
};

export const bulletVote = async ({ type, bulletId }, callback) => {
  return fetch(API.KEY_TAKEAWAY({ bulletId, route: type }), API.POST_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => callback(res))
    .catch((err) => {
      //Todo: handle error
    });
};

export const summaryVote = async ({ type, summaryId }, callback) => {
  return fetch(API.SUMMARY({ summaryId, route: type }), API.POST_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => callback(res))
    .catch((err) => {
      //Todo: handle error
    });
};

export const checkSummaryVote = async ({ summaryId }, callback) => {
  return fetch(
    API.SUMMARY({ summaryId, route: "check_user_vote", check_vote: true }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .catch((err) => {
      //Todo: handle error
    });
};

export const supportContent = async ({ contentType, objectId, amount }) => {
  const PAYLOAD = {
    content_type: contentType,
    object_id: objectId,
    amount,
    purchase_type: "BOOST",
    purchase_method: "OFF_CHAIN",
  };

  return fetch(API.PROMOTE, API.POST_CONFIG(PAYLOAD))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const setSectionBounty = async ({ paperId, type, amount }) => {
  const PAYLOAD = { [type]: amount };

  return fetch(
    API.PAPER({ paperId, route: "bounty" }),
    API.POST_CONFIG(PAYLOAD)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};
