import { ID } from "~/config/types/root_types";

export type SuggestedUser = {
  firstName: string;
  lastName: string;
  id: ID;
  authorProfile: {
    profileImage: string;
    id: ID;
  }
}
