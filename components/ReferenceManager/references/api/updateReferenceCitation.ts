import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  payload: any;
  orgId: ID;
};

export const updateReferenceCitation = ({
  onError,
  onSuccess,
  payload,
  orgId,
}: Args): void => {
  const formattedPayload = payload;
  const config = API.PATCH_CONFIG(formattedPayload);

  config.headers["X-organization-id"] = orgId;
  fetch(
    buildApiUri({ apiPath: `citation_entry/${payload?.citation_id}` }),
    config
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => onSuccess(result))
    .catch(onError);
};

export const updateReferenceCitationFile = ({
  onError,
  onSuccess,
  payload,
  orgId,
}: Args): void => {
  const formattedPayload = payload;
  const formdata = new FormData();
  formdata.append("attachment", payload.attachment);
  const config = API.PATCH_FILE_CONFIG(formdata);
  config.headers["X-organization-id"] = orgId;
  fetch(
    buildApiUri({ apiPath: `citation_entry/${payload?.citation_id}` }),
    config
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => onSuccess(result))
    .catch(onError);
};
