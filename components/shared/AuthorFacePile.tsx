import { css, StyleSheet } from "aphrodite";
import { ReactElement, SyntheticEvent, useMemo } from "react";
import AuthorAvatar from "../AuthorAvatar";
import colors from "../../config/themes/colors";

type Props = {
  authorProfiles: Object[];
  horizontal?: boolean;
  imgSize: number | string;
  labelSpacing?: number;
  loadOffset?: number;
  withAuthorName?: boolean;
};

export default function AuthorFacePile({
  authorProfiles = [],
  horizontal,
  imgSize,
  labelSpacing,
  loadOffset,
  withAuthorName,
}: Props): ReactElement<"div"> {
  const tags = useMemo(
    () =>
      authorProfiles.map((author: any, index: number): ReactElement<"span"> => {
        return (
          <span
            style={{
              marginRight: 12,
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
        Boolean(horizontal) && styles.horizontal
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
    justifyContent: "center",
  },
  horizontal: {
    justifyContent: "unset",
    flexDirection: "row",
    alignItems: "center",
  },
});
