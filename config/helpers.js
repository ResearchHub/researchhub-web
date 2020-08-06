import { Helpers as helpers } from "@quantfive/js-web-config";
import { ModalActions } from "~/redux/modals";
import { useDispatch } from "react-redux";

export const Helpers = {
  ...helpers,
  checkStatus: async function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    error.message = await response.json();
    return Promise.reject(error);
  },
};
