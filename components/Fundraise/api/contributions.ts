import { Helpers } from "@quantfive/js-web-config";
import API, { generateApiUrl } from "~/config/api";
import { ID } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { Purchase, parsePurchase } from "~/config/types/purchase";
import { Fundraise, parseFundraise } from "../lib/types";

export const fetchFundraiseContributionsApi = async ({
  fundraiseId,
}: {
  fundraiseId: ID;
}): Promise<{
  contributions: Purchase[];
}> => {
  if (isNullOrUndefined(fundraiseId)) {
    return { contributions: [] };
  }

  try {
    const url = generateApiUrl(`fundraise/${fundraiseId}/contributions`);

    const response = await fetch(url, API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then((res): any => Helpers.parseJSON(res));

    return {
      contributions: response.map((raw: any) => parsePurchase(raw)),
    };
  } catch (err) {
    captureEvent({
      msg: "Error fetching votes",
      data: { fundraiseId },
    });

    throw Error(err as any);
  }
};

export const createFundraiseContributionApi = async ({
  fundraiseId,
  amount,
  currency = "RSC",
}: {
  fundraiseId: ID;
  amount: number;
  currency?: "RSC" | "USD";
}): Promise<{
  fundraise?: Fundraise;
}> => {
  if (isNullOrUndefined(fundraiseId)) {
    return {};
  }

  try {
    const url = generateApiUrl(`fundraise/${fundraiseId}/create_contribution`);

    const response = await fetch(
      url,
      API.POST_CONFIG({ amount, amount_currency: currency })
    );
    const data = await Helpers.parseJSON(response);

    if (response.status !== 200) {
      // forward error message (this EP returns human readable error messages)
      throw Error(data.message);
    }

    return {
      fundraise: parseFundraise(data),
    };
  } catch (err: any) {
    captureEvent({
      msg: `Error: ${err.message}` || "Error contributing to fundraise",
      data: { fundraiseId, amount },
    });

    throw Error(err as any);
  }
};
