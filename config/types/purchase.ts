import { parseUser, RHUser } from "./root_types";

export type Purchase = {
  createdBy: RHUser;
  amount: number;
}

export const parsePurchase = (raw:any):Purchase => {
  return {
    createdBy: parseUser(raw.user),
    amount: Number(raw.amount),
  }
}
