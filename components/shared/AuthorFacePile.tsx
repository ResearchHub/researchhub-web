import { css, StyleSheet } from "aphrodite";
import AuthorAvatar from "../AuthorAvatar";
import colors from "../../config/themes/colors";
import LazyLoad from "react-lazyload";
import { ReactElement, SyntheticEvent, useMemo } from "react";

type Props = {
  authorProfiles: Object[];
  imgSize: number | string;
  loadOffset?: number;
};

export default function AuthorFacePile({
  authorProfiles = [],
  imgSize,
  loadOffset,
}: Props): ReactElement<"div"> {
  const imgs = useMemo(
    () =>
      authorProfiles.map(
        (author: Object, index: number): ReactElement<typeof AuthorAvatar> => {
          return (
            <AuthorAvatar
              author={author}
              border={`2px solid ${colors.LIGHT_GREY(1)}`}
              key={index}
              onClick={(event: SyntheticEvent): void => {
                event.stopPropagation();
                event.preventDefault();
              }}
              size={imgSize}
            />
          );
        }
      ),
    [authorProfiles]
  );
  return (
    <div className={css(styles.facePile)}>
      <LazyLoad offset={loadOffset ?? 100} once>
        {imgs}
      </LazyLoad>
    </div>
  );
}

const styles = StyleSheet.create({
  facePile: {},
});
