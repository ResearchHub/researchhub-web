import React, { ReactElement } from "react";

export type AuthorClaimData = {
  auth: any;
  author: any;
  user: any;
};

export default function AuthorClaimModal({
  auth,
  author,
  user,
}: AuthorClaimData): ReactElement<"div"> {
  return <div>Hi this is Modal</div>;
}
