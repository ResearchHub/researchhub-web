import { ID, RHUser, parseUser } from "~/config/types/root_types";

export type FundraiseStatus = "OPEN" | "CLOSED";

export interface Fundraise {
  id: ID;

  status: FundraiseStatus;

  goalCurrency: "USD" | "RSC";

  goalAmount: {
    usd: number;
    rsc: number;
  };

  amountRaised: {
    usd: number;
    rsc: number;
  };

  // ISO 8601
  startDate: string;
  endDate: string;

  contributors: {
    total: number;
    top: RHUser[];
  };
}

export const isFundraiseFulfilled = (f: Fundraise): boolean => {
  if (f.goalCurrency === "USD") {
    return f.amountRaised.usd >= f.goalAmount.usd;
  }
  if (f.goalCurrency === "RSC") {
    return f.amountRaised.rsc >= f.goalAmount.rsc;
  }

  return false;
};

export const parseFundraise = (raw: any): Fundraise => ({
  id: raw.id,

  status: raw.status,

  goalCurrency: raw.goal_currency || "USD",

  goalAmount: {
    usd: parseFloat(raw.goal_amount?.usd || "0"),
    rsc: parseFloat(raw.goal_amount?.rsc || "0"),
  },

  amountRaised: {
    usd: parseFloat(raw.amount_raised?.usd || "0"),
    rsc: parseFloat(raw.amount_raised?.rsc || "0"),
  },

  contributors: {
    total: raw.contributors?.total || 0,
    top: (raw.contributors?.top || []).map(parseUser),
  },

  startDate: raw.start_date,
  endDate: raw.end_date,
});
