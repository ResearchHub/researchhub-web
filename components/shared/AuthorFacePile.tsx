import { css, StyleSheet } from "aphrodite";
import { ReactElement, SyntheticEvent, useMemo } from "react";
import AuthorAvatar from "../AuthorAvatar";
import colors from "../../config/themes/colors";

type Props = {
  authorProfiles: Object[];
  horizontal?: boolean;
  imgSize: number | string;
  labelSpacing?: number;
  withAuthorName?: boolean;
  fontSize?: number | string;
  margin?: number;
  overrideStyle: any,
};

export default function AuthorFacePile({
  authorProfiles = [],
  horizontal,
  imgSize,
  labelSpacing,
  margin = 12,
  withAuthorName,
  fontSize,
  overrideStyle
}: Props): ReactElement<"div"> {
  const tags = useMemo(
    () =>
      authorProfiles.map((author: any, index: number): ReactElement<"span"> => {
        return (
          <span
            style={{
              marginRight: margin,
              marginBottom: !Boolean(horizontal) ? 8 : 0,
            }}
          >
            <AuthorAvatar
              author={author}
              border={`2px solid ${colors.LIGHT_GREY(1)}`}
              key={index}
              onClick={(event: SyntheticEvent) => {
                event.stopPropagation();
                event.preventDefault();
              }}
              margin
              size={imgSize}
              fontSize={fontSize}
              spacing={labelSpacing}
              withAuthorName={withAuthorName}
            />
          </span>
        );
      }),
    [authorProfiles]
  );
  return (
    <div
      className={css(
        styles.authorFacePile,
        Boolean(horizontal) && styles.horizontal,
        overrideStyle
      )}
    >
      {tags}
    </div>
  );
}

const styles = StyleSheet.create({
  authorFacePile: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  horizontal: {
    justifyContent: "unset",
    flexDirection: "row",
    alignItems: "center",
  },
});
