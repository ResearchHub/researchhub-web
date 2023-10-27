import { getFEUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { timeAgo } from "~/config/utils/dates";
import dayjs from "dayjs";

export const getEarliest = (date1, date2) => {
  if (dayjs(date1) > dayjs(date2)) {
    return date1;
  } else {
    return date2;
  }
};

export const getNewestCommentTimestamp = (discussionItem) => {
  let newest = discussionItem.created_date;
  (discussionItem.source.comments || []).forEach((comment) => {
    if (!newest || dayjs(comment.created_date) > dayjs(newest)) {
      newest = comment.created_date;
    }

    (comment.replies || []).forEach((reply) => {
      if (dayjs(reply.created_date) > dayjs(newest)) {
        newest = reply.created_date;
      }
    });
  });

  return newest;
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    // we return "" so that `null` or `undefined` doesn't show on the UI by accident
    return "";
  }
  const date = new Date(timestamp);
  return timeAgo.format(date);
};

export const getDocFromItem = (item, itemType) => {
  let doc;
  if (itemType === "AUTHORED_PAPER") {
    doc = item;
  } else if (itemType === "CONTRIBUTION") {
    const uniDoc = item.unified_document;

    doc = Array.isArray(uniDoc.documents)
      ? uniDoc.documents[0]
      : uniDoc.documents;
  } else {
    throw new Error("Unrecognized item type");
  }

  return doc;
};

export const getUrlFromItem = (item, itemType) => {
  if (itemType === "AUTHORED_PAPER") {
    return `/paper/${item.id}/${item.slug}`;
  } else {
    return getUrlToUniDoc(item.unified_document);
  }
};

export const getCardType = ({ item, itemType }) => {
  let cardType;
  if (itemType === "AUTHORED_PAPER") {
    return "paper";
  } else if (itemType === "CONTRIBUTION") {
    const uniDoc = item.unified_document;
    if (item.contribution_type === "COMMENTER") {
      cardType = "comment";
    } else if (item.contribution_type === "SUBMITTER") {
      cardType = getFEUnifiedDocType(uniDoc?.document_type);
    } else if (item.contribution_type === "BOUNTY_CREATED") {
      if (item.source?.content_type?.name === "thread") {
        cardType = "comment";
      } else {
        cardType = getFEUnifiedDocType(uniDoc?.document_type);
      }
    } else if (item.contribution_type === "BOUNTY_SOLUTION") {
      if (
        item.source?.content_type?.name === "thread" ||
        item.source?.content_type?.name === "comment"
      ) {
        cardType = "comment";
      } else {
        cardType = getFEUnifiedDocType(uniDoc?.document_type);
      }
    } else if (item.contribution_type === "SUPPORTER") {
      if (item.source?.content_type?.app_label === "discussion") {
        cardType = "comment";
      } else {
        cardType = getFEUnifiedDocType(uniDoc?.document_type);
      }
    }
  } else {
    throw new Error(`Unrecognized itemType ${itemType}`);
  }

  return cardType;
};
