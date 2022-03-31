import {
  emptyFncWithMsg,
  isEmpty,
  nullthrows,
} from "~/config/utils/nullchecks";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import API from "~/config/api";
import { AUTH_TOKEN as TOKEN_NAME } from "~/config/constants";

type Args = {
  wsUrl: string;
  paperSubmissionID: ID;
};

export const markAsRead = ({ wsUrl, paperSubmissionID }: Args): void => {
  const token = window.localStorage[TOKEN_NAME];

  // const socket = new WebSocket(wsUrl, !isEmpty ? ["Token", token] : undefined);
  // @ts-ignore
  // socket.send({ paper_submission_id: paperSubmissionID });
  // fetch(wsUrl, API.POST_CONFIG({ paper_submission_id: paperSubmissionID }))
  //   .then(Helpers.checkStatus)
  //   .then(Helpers.parseJSON)
  //   .then((res) => {
  //     emptyFncWithMsg(res);
  //   })
  //   .catch((error: Error) => {
  //     emptyFncWithMsg(error);
  //   });
};
