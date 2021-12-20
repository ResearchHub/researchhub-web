import { css, StyleSheet } from "aphrodite";
import { ReactElement, SyntheticEvent, useMemo } from "react";
import AuthorAvatar from "../AuthorAvatar";
import colors from "../../config/themes/colors";
import LazyLoad from "react-lazyload";

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
      authorProfiles.map(
        (author: any, index: number): ReactElement<typeof LazyLoad> => {
          return (
            <LazyLoad
              offset={loadOffset ?? 100}
              once
              style={{ marginRight: 12 }}
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
            </LazyLoad>
          );
        }
      ),
    [authorProfiles]
  );
  return (
    <div className={css(Boolean(horizontal) && styles.horizontal)}>{tags}</div>
  );
}

const styles = StyleSheet.create({
  authorFacePile: {
    marginRight: 8,
  },
  horizontal: {
    display: "flex",
  },
});
