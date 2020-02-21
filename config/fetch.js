import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

export const updateEmailPreference = async (props) => {
  let params = API.PATCH_CONFIG(data);
  return await fetch(API.EMAIL_PREFERENCE(), params)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};
