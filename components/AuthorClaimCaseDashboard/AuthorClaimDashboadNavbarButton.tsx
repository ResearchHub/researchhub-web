import { css, StyleSheet } from "aphrodite";
import React, { ReactElement } from "react";

type Props = {
  count?: number;
  label: string;
  onClick: () => void;
};

export default function AuthorClaimDashboadNavbarButton({
  count,
  label,
  onClick,
}: Props): ReactElement<"div"> {
  return <div>This is BUTTON!</div>;
}
