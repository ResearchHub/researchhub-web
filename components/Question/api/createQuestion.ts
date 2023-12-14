import API from "~/config/api";
import { sendAmpEvent } from "~/config/fetch";
import { Helpers } from "@quantfive/js-web-config";
import { ID, RHUser } from "~/config/types/root_types";
import { getPlainTextFromMarkdown } from "~/config/utils/getPlainTextFromMarkdown";

type PostPayload = {
  withDOI?: boolean;
  authorIds?: ID[];
  hubIds?: ID[];
  noteId?: ID;
  postId?: ID; // For updating. Indicates note has been published
  title?: string;
  textContent?: string | TrustedHTML;
  editorContent?: string | TrustedHTML;
  previewImage?: string | null;
  postType: "POST" | "QUESTION";
};

interface Props {
  onError?: (error: Error) => void;
  onSuccess?: (response: any) => void;
  payload: PostPayload;
  currentUser: RHUser | null;
}

const toApiPayload = (payload: PostPayload) => {
  return {
    assign_doi: payload.withDOI ?? false,
    authors: payload.authorIds,
    document_type: payload.postType === "POST" ? "DISCUSSION" : "QUESTION",
    full_src: payload.editorContent,
    hubs: payload.hubIds,
    preview_img: payload.previewImage,
    renderable_text: payload.textContent
      ? getPlainTextFromMarkdown(payload.textContent)
      : "",
    title: payload.title,
    note_id: payload.noteId,
    post_id: payload.postId, // Published posts will have a post_id
  };
};

// TODO: Kobe: Move this to backend. It isn't the FE responsibility to transmit this event.
const logEmpEvent = ({
  isCreated,
  apiResponse,
  postType,
  currentUser,
}: {
  isCreated: boolean;
  apiResponse: any;
  postType: "QUESTION" | "POST";
  currentUser: RHUser | null;
}) => {
  try {
    let eventType: string | undefined;
    const eventProperties = {
      interaction: "Post created",
    };
    if (postType === "POST") {
      if (isCreated) {
        eventType = "update_post";
        eventProperties.interaction = "Post updated";
      } else {
        eventType = "create_post";
      }
    } else if (postType === "QUESTION") {
      if (isCreated) {
        eventType = "update_question";
        eventProperties.interaction = "Question updated";
      } else {
        eventType = "create_question";
        eventProperties.interaction = "Question created";
      }
    }

    const ampPayload = {
      event_type: eventType,
      time: +new Date(),
      user_id: currentUser?.id,
      insert_id: `post_${apiResponse?.id}`,
      event_properties: {
        interaction: "Post created",
      },
    };
    sendAmpEvent(ampPayload);
  } catch (error) {
    console.log("Error logging AMP event", error);
  }
};

export const createOrUpdatePost = ({
  payload,
  currentUser,
  onSuccess,
  onError,
}: Props) => {
  return fetch(
    API.RESEARCHHUB_POST({ post_id: payload.postId }),
    API.POST_CONFIG(toApiPayload(payload))
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      // @ts-ignore
      const isCreated = Boolean(res?.id);
      logEmpEvent({
        isCreated,
        apiResponse: res,
        currentUser,
        postType: payload.postType,
      });
      onSuccess && onSuccess(res);
      return res;
    })
    .catch((error) => {
      onError && onError(error);
    });
};
