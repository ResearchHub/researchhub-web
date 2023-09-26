import API, { generateApiUrl } from "~/config/api";
import Helpers from "~/config/api/helpers";
import dayjs from "dayjs";
import { ID } from "~/config/types/root_types";

export const updatePaperMetadataAPI = async ({
  id,
  title,
  doi,
  publishedDate,
  hubs,
}: {
  id: ID;
  title?: string;
  doi?: string;
  publishedDate?: string;
  hubs?: Array<ID>;
}) => {
  const url = generateApiUrl(`paper/${id}`);
  const response = await fetch(
    url,
    API.PATCH_CONFIG({
      ...(title && { title }),
      ...(title && { paper_title: title }),
      ...(doi && { doi }),
      ...(hubs && { hubs }),
      ...(publishedDate && {
        paper_publish_date: dayjs(publishedDate).format("YYYY-MM-DD"),
      }),
    })
  ).then((res): any => Helpers.parseJSON(res));

  return Promise.resolve(response);
};

export default updatePaperMetadataAPI;
