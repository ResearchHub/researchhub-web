import React, { ReactElement } from "react";

export type AuthorClaimDataProps = {
  auth: any;
  author: any;
  isOpen: boolean;
  user: any;
};

export default function AuthorClaimModal({
  auth,
  author,
  isOpen,
  user,
}: AuthorClaimDataProps): ReactElement<"div"> {
  if (!isOpen) {
    return <div>closed</div>;
  }
  return <div>Hi this is Modal</div>;
}
