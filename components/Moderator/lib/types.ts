import { ID } from "~/config/types/root_types";

export type UserDetailsForModerator = {
  id: ID;
  isProbableSpammer: boolean;
  isSuspended: boolean;
  email: string;
  createdData: string;
  riskScore: number;
  verification: {
    createdDate: string;
    externalId: string;
    firstName: string;
    lastName: string;
    verifiedVia: string;
    status: string;
  } | null;  
}

export const parseUserDetailsForModerator = (data: any): UserDetailsForModerator => {
  return {
    id: data.id,
    isProbableSpammer: data.probable_spammer,
    isSuspended: data.is_suspended,
    email: data.email,
    createdData: data.created_date,
    riskScore: data.risk_score,
    verification: data.verification ? {
      createdDate: data.verification.created_date,
      externalId: data.verification.external_id,
      firstName: data.verification.first_name,
      lastName: data.verification.last_name,
      verifiedVia: data.verification.verified_by,
      status: data.verification.status,
    } : null,
  };
}
