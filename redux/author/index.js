import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
//import * as shims from "./shims";
import * as types from "./types";
//import * as actions from "./actions";
import * as utils from "../utils";

export const AuthorActions = {
  getAuthor: ({ authorId }) => {
    return (dispatch) => {
      return fetch(API.AUTHOR({ authorId }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          return dispatch({
            type: types.GET_AUTHOR,
            payload: {
              ...resp,
              doneFetching: true,
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };
  },
};
