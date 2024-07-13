import { ID, RHUser, parseUser } from "~/config/types/root_types";

export type Notification = {
  id: ID;
  type: string;
  raw: any;
  actionUser: RHUser;
  recipient: RHUser;
  read: boolean;
  readDate: string;
  createdDate: string;
};

export const parseNotification = (raw: any): Notification => {
  if (typeof raw === "string") {
    raw = JSON.parse(raw);
  }

  return {
    id: raw.data?.id,
    type: raw.notification_type,
    raw: raw.data,
    actionUser: parseUser(raw.data?.action_user),
    recipient: parseUser(raw.data?.recipient),
    read: raw.data?.read,
    readDate: raw.data?.read_date,
    createdDate: raw.data?.created_date,
  };
};
