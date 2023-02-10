import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";
import { ID, User } from "~/config/types/root_types";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  page?: number;
};

/* BE may return more than specified below */
export type SimpleBounty = {
  amount: string;
  content_type: any /* intentional any */;
  created_by: User;
  expiration_date: string;
  id: ID;
  item: any /* intentional any */;
};

export const fetchOpenBounties = ({ onError, onSuccess, page }: Args): void => {
  fetch(
    buildApiUri({
      apiPath: "bounty/get_bounties",
      queryString: "?status=OPEN",
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
          } = bounty ?? {};
          return {
            amount,
            content_type,
            created_by,
            expiration_date,
            id,
            item,
          };
        })
      );
    })
    .catch(onError);
};
