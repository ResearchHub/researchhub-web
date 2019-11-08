import { css, StyleSheet } from "aphrodite";
import Link from "next/link";

import { User } from "./User";
import University from "./University";

const BaseSearchResult = (props) => {
  return <div className={css(styles.result)}>{props.children}</div>;
};

export const AuthorSearchResult = (props) => {
  const { result, firstName, lastName } = props || null;

  const fullName = `${firstName} ${lastName}`;

  return (
    <BaseSearchResult>
      <User authorProfile={result} name={fullName} />
      {result && <University university={result.university} />}
    </BaseSearchResult>
  );
};

export const HubSearchResult = (props) => {
  const { result } = props || {};
  const { name } = result || "";
  return (
    <Link href={"/hubs/[hubname]"} as={`/hubs/${hubNameToUrl(name)}`}>
      {name + " Hub"}
    </Link>
  );
};

function hubNameToUrl(name) {
  const nameArr = (name && name.split(" ")) || [];
  return nameArr.length > 1
    ? nameArr.join("-").toLowerCase()
    : name.toLowerCase();
}

export const UniversitySearchResult = (props) => {
  const { result } = props || null;
  return <University university={result} />;
};

const styles = StyleSheet.create({
  result: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "10px 0px",
  },
});
