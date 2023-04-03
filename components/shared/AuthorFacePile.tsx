import { css, StyleSheet } from "aphrodite";
import { ReactElement, SyntheticEvent, useMemo } from "react";
import colors from "~/config/themes/colors";
import AuthorAvatar from "../AuthorAvatar";

type Props = {
  authorProfiles: Object[];
  fontSize?: number | string;
  horizontal?: boolean;
  imgSize: number | string;
  labelSpacing?: number;
  margin?: number;
  overrideStyle?: any;
  withAuthorName?: boolean;
  border?: string;
  withTooltip?: boolean;
};

export default function AuthorFacePile({
  authorProfiles = [],
  horizontal,
  imgSize,
  labelSpacing,
  margin = 12,
  withAuthorName,
  withTooltip = false,
  fontSize,
  overrideStyle,
  border = `2px solid white`
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
              border={border}
              key={`avatar-${index}`}
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
      // When negative margins are used, the width of this container will be smaller than actually is and result in unintended spacing of adjacent elements.
      // The following line ensures that the "box" wraps around all of the avatars.
      style={{ marginRight: margin < 0 ? Math.abs(margin) : 0 }}
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
