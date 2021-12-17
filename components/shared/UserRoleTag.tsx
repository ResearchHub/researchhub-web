import { ReactElement } from "react";

type Props = {
  backgroundColor: string;
  color: string;
  fontSize: string | number;
  label: string;
  margin?: string;
  padding: string | number;
};

export default function UserRoleTag({
  backgroundColor,
  color,
  fontSize,
  label,
  margin,
  padding,
}: Props): ReactElement<"span"> {
  return (
    <span
      style={{
        backgroundColor,
        borderRadius: 8,
        color,
        fontSize,
        margin,
        padding,
      }}
    >
      {label}
    </span>
  );
}
