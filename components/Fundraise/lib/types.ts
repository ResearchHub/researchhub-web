import { ID, RHUser, parseUser } from "~/config/types/root_types";

export type FundraiseStatus = "OPEN" | "CLOSED";

export interface Fundraise {
  id: ID;

  status: FundraiseStatus;

  goal_currency: "USD" | "RSC";

  goal_amount: {
    usd: number;
    rsc: number;
  };

  amount_raised: {
    usd: number;
    rsc: number;
  };

  // ISO 8601
  start_date: string;
  end_date: string;

  contributors: {
    total: number;
    top: RHUser[];
  };
}

export const isFundraiseFulfilled = (f: Fundraise): boolean => {
  if (f.goal_currency === "USD") {
    return f.amount_raised.usd >= f.goal_amount.usd;
  }
  if (f.goal_currency === "RSC") {
    return f.amount_raised.rsc >= f.goal_amount.rsc;
  }

  return false;
};

export const parseFundraise = (raw: any): Fundraise => ({
  id: raw.id,

  status: raw.status,

  goal_currency: raw.goal_currency || "USD",

  goal_amount: {
    usd: parseFloat(raw.goal_amount?.usd || "0"),
    rsc: parseFloat(raw.goal_amount?.rsc || "0"),
  },

  amount_raised: {
    usd: parseFloat(raw.amount_raised?.usd || "0"),
    rsc: parseFloat(raw.amount_raised?.rsc || "0"),
  },

  contributors: {
    total: raw.contributors?.total || 0,
    top: (raw.contributors?.top || []).map(parseUser),
  },

  start_date: raw.start_date,
  end_date: raw.end_date,
});
