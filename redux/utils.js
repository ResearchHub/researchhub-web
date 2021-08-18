import * as moment from "dayjs";
import * as Sentry from "@sentry/browser";

import { UPVOTE, DOWNVOTE } from "~/config/constants";
import { doesNotExist } from "~/config/utils/nullchecks";
import { getNestedValue, logFetchError } from "~/config/utils/misc";

import { ModalActions } from "~/redux/modals";

export function handleCatch(err, dispatch) {
  if (err.response && err.response.status === 429) {
    dispatch(ModalActions.openRecaptchaPrompt(true));
  } else {
    Sentry.captureException(err);
  }
  return err;
}

export function transformVote(vote) {
  if (!doesNotExist(vote) && vote !== "null") {
    return {
      id: vote.id,
      itemId: vote.item || vote.paper,
      voteType: transformVoteType(vote.vote_type),
      userId: vote.created_by,
      createdDate: transformDate(vote.created_date),
    };
  } else {
    return {};
  }
}

export function transformVoteType(voteType) {
  if (voteType === 1 || voteType === "1") {
    return UPVOTE;
  }
  if (voteType === 2 || voteType === "2") {
    return DOWNVOTE;
  }
}

export function transformDate(date) {
  return moment(date);
}

export function transformUser(user) {
  return {
    // ...user
    id: getNestedValue(user, ["id"], null),
    // firstName: getNestedValue(user, ["first_name"], ""),
    // lastName: getNestedValue(user, ["last_name"], ""),
    authorProfile: getNestedValue(user, ["author_profile"], {}),
  };
}
