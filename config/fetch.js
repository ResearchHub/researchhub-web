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
    .then(Helpers.parseJSON);
};

export const unsubscribeFromHub = async (hubId) => {
  const config = API.POST_CONFIG();
  return await fetch(API.HUB_UNSUBSCRIBE({ hubId }), config)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};
