import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";
import { ID, NullableString } from "~/config/types/root_types";
import { isEmpty } from "~/config/utils/nullchecks";
import { UpsertPurpose } from "../context/ReferenceProjectsUpsertContext";

type Payload = {
  // TODO: calvinhlee - expand this as more privacy features are added
  organization: ID;
  project?: ID;
  project_name: string;
};

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  payload: Payload;
  upsertPurpose: UpsertPurpose;
};

export const upsertReferenceProject = ({
  onError,
  onSuccess,
  payload,
  upsertPurpose,
}: Args): void => {
  const isUpdate = upsertPurpose === "update";
  const requestConfig = isUpdate ? API.PUT_CONFIG : API.POST_CONFIG;
  fetch(
    buildApiUri({
      apiPath: `citation_project${isUpdate ? `/${payload.project}` : ""}`,
    }),
    requestConfig(
      !isUpdate && !isEmpty(payload.project)
        ? { ...payload, parent: payload.project }
        : payload
    )
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => onSuccess(result))
    .catch(onError);
};
