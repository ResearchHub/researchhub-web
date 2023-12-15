import Helpers from "~/config/api/helpers";
import { captureEvent } from "~/config/utils/events";
import API from "~/config/api";

interface Props {
  postId: string;
}

const fetchPost = ({ postId }: Props): Promise<any> => {
  const url = API.RESEARCHHUB_POST({ post_id: postId });
  return fetch(url, API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      return resp?.results[0];
    })
    .catch((error) => {
      captureEvent({
        data: { postId },
        error,
        msg: `Error fetching post: ${postId}`,
      });
    });
};

export default fetchPost;
