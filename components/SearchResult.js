import { css, StyleSheet } from "aphrodite";

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
      <University university={result.university} />
    </BaseSearchResult>
  );
};

export const HubSearchResult = () => {};

export const UniversitySearchResult = () => {};

const styles = StyleSheet.create({
  result: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "10px 0px",
  },
});
