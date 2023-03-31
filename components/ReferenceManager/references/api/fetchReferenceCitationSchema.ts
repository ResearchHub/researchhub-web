import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";

export type ReferenceSchemaValueSet = {
  schema: any;
  required: string[];
};

type Args = {
  citation_type: string;
  onError: (error: Error) => void;
  onSuccess: ({ schema, required }: ReferenceSchemaValueSet) => void;
};

export const fetchReferenceCitationSchema = ({
  citation_type,
  onError,
  onSuccess,
}: Args): void => {
  fetch(
    buildApiUri({
      apiPath: `citation_entry/get_schema_for_citation`,
      queryString: `?citation_type=${citation_type}`,
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => {
      const emptySchema = {};
      for (const key of Object.keys(result?.properties)) {
        emptySchema[key] = "";
      }
      onSuccess({ schema: emptySchema, required: result?.required ?? [] });
    })
    .catch(onError);
};
