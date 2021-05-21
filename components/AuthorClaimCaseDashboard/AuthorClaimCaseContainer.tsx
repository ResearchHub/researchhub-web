import React, { useEffect, ReactElement } from "react";
import AuthorClaimCaseCard from "./AuthorClaimCaseCard";

export default function AuthorClaimCaseContainer(): ReactElement<"div"> {
  return (
    <div>
      Hi this is renderer
      <AuthorClaimCaseCard />
    </div>
  );
}
