import { Helpers } from "~/config/api/index";
import API from "../../../../config/api";

export const addNewUser = ({ onError, onSuccess, params }) => {
  fetch(API.AUTHOR({}), API.POST_CONFIG(params))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      onSuccess(resp);
    })
    .catch((err) => {
      if (err.response.status === 429) {
        onError();
      }
    });
};
