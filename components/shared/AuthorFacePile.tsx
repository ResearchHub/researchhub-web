import { css, StyleSheet } from "aphrodite";
import AuthorAvatar from "../AuthorAvatar";
import colors from "../../config/themes/colors";
import LazyLoad from "react-lazyload";
import React, { ReactElement, useMemo } from "react";

type Props = {
  authorProfiles: Object[];
  imgSize: number | string;
};

export default function AuthorFacePile({
  authorProfiles = [],
  imgSize,
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
              size={imgSize}
            />
          );
        }
      ),
    [authorProfiles]
  );
  return (
    <div className={css(styles.facePile)}>
      <LazyLoad offset={100} once>
        {imgs}
      </LazyLoad>
    </div>
  );
}

const styles = StyleSheet.create({
  facePile: {},
});
