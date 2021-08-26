import { doesNotExist } from "~/config/utils/nullchecks";

export const authorPost = (data) => {
  const university =
    data.university && data.university !== "" ? data.university : null;
  const facebook = data.facebook && data.facebook !== "" ? data.facebook : null;
  const linkedin = data.linkedin && data.linkedin !== "" ? data.linkedin : null;
  const twitter = data.twitter && data.twitter !== "" ? data.twitter : null;
  return {
    facebook,
    linkedin,
    twitter,
    first_name: data.first_name,
    last_name: data.last_name,
    university,
  };
};

export const emailPreference = (data) => {
  return {
    id: data.id,
    email: data.email,
    userId: data.user,
    isOptedOut: data.is_opted_out,
    isSubscribed: data.is_subscribed,
    commentSubscription: transformSubscription(data.comment_subscription),
    digestSubscription: transformSubscription(data.digest_subscription),
    paperSubscription: transformSubscription(data.paper_subscription),
    replySubscription: transformSubscription(data.reply_subscription),
    threadSubscription: transformSubscription(data.thread_subscription),
  };
};

function transformSubscription(data) {
  const subscription = data;
  if (data) {
    subscription["notificationFrequency"] = data.notification_frequency;
    delete subscription["notification_frequency"];
    return subscription;
  }
}

export const emailPreferencePatch = ({
  email,
  isOptedOut,
  isSubscribed,
  subscriptions,
}) => {
  let data = {};
  !doesNotExist(email) && (data["email"] = email);
  !doesNotExist(isOptedOut) && (data["is_opted_out"] = isOptedOut);
  !doesNotExist(isSubscribed) && (data["is_subscribed"] = isSubscribed);
  !doesNotExist(subscriptions) && (data = { ...data, ...subscriptions });
  return data;
};

export const buildSubscriptionPatch = (subscription, receiveEmails) => {
  const patchShim = subscriptionPatchShims[subscription];
  const args = {};

  if (!receiveEmails) {
    args["none"] = true;
  } else {
    args["none"] = !receiveEmails;
    switch (subscription) {
      case "paperSubscription":
        args["threads"] = receiveEmails;
        break;
      case "threadSubscription":
        args["comments"] = receiveEmails;
        break;
      case "commentSubscription":
        args["replies"] = receiveEmails;
        break;
      case "replySubscription":
        args["replies"] = receiveEmails;
        break;
      default:
        break;
    }
  }
  return patchShim(args);
};

export const subscriptionPatchShims = {
  digestSubscription: digestSubscriptionPatch,
  paperSubscription: paperSubscriptionPatch,
  threadSubscription: threadSubscriptionPatch,
  commentSubscription: commentSubscriptionPatch,
  replySubscription: replySubscriptionPatch,
};

export function digestSubscriptionPatch({ notificationFrequency, none }) {
  const data = {};
  !doesNotExist(notificationFrequency) &&
    (data["notification_frequency"] = notificationFrequency);
  !doesNotExist(none) && (data["none"] = none);
  return { digest_subscription: data };
}

export function paperSubscriptionPatch({
  notificationFrequency,
  none,
  threads,
}) {
  const data = {};
  !doesNotExist(notificationFrequency) &&
    (data["notification_frequency"] = notificationFrequency);
  !doesNotExist(none) && (data["none"] = none);
  !doesNotExist(threads) && (data["threads"] = threads);
  return { paper_subscription: data };
}

export function threadSubscriptionPatch({
  notificationFrequency,
  none,
  comments,
}) {
  const data = {};
  !doesNotExist(notificationFrequency) &&
    (data["notification_frequency"] = notificationFrequency);
  !doesNotExist(none) && (data["none"] = none);
  !doesNotExist(comments) && (data["comments"] = comments);
  return { thread_subscription: data };
}

export function commentSubscriptionPatch({
  notificationFrequency,
  none,
  replies,
}) {
  const data = {};
  !doesNotExist(notificationFrequency) &&
    (data["notification_frequency"] = notificationFrequency);
  !doesNotExist(none) && (data["none"] = none);
  !doesNotExist(replies) && (data["replies"] = replies);
  return { comment_subscription: data };
}

export function replySubscriptionPatch({
  notificationFrequency,
  none,
  replies,
}) {
  const data = {};
  !doesNotExist(notificationFrequency) &&
    (data["notification_frequency"] = notificationFrequency);
  !doesNotExist(none) && (data["none"] = none);
  !doesNotExist(replies) && (data["replies"] = replies);
  return { reply_subscription: data };
}
