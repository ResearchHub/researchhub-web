import API, { buildQuerystringListParam } from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "~/config/api/index";
import {
  ID,
  UnifiedDocument,
  User,
  parseUnifiedDocument,
} from "~/config/types/root_types";
import { getPlainText } from "~/components/Comment/lib/quill";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  page?: number;
  model?: string;
};

/* BE may return more than specified below */
export type SimpleBounty = {
  amount: string;
  content_type: any /* intentional any */;
  created_by: User;
  expiration_date: string;
  id: ID;
  item: any /* intentional any */;
  plainText: string;
  unifiedDocument: UnifiedDocument;
};

export const fetchOpenBounties = ({
  onError,
  onSuccess,
  model,
  page,
}: Args): void => {
  fetch(
    buildApiUri({
      apiPath: "bounty/get_bounties",
      queryString:
        "?status=OPEN" + (model ? `&item_content_type__model=${model}` : ""),
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((bounties: any): void => {
      onSuccess(
        bounties?.map((bounty: any): SimpleBounty => {
          const {
            amount,
            content_type,
            created_by,
            expiration_date,
            id,
            item,
            unified_document,
          } = bounty ?? {};

          return {
            amount: amount ?? bounty.total_amount,
            content_type,
            created_by,
            expiration_date,
            id,
            item,
            plainText: getPlainText({
              quillOps: item!.comment_content_json!.ops,
            }),
            unifiedDocument: parseUnifiedDocument(unified_document),
          };
        })
      );
    })
    .catch(onError);
};
