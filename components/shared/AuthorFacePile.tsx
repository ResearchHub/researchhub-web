import { css, StyleSheet } from "aphrodite";
import React, { ReactElement, useMemo } from "react";
import LazyLoad from "react-lazyload";
import AuthorAvatar from "../AuthorAvatar";

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
              size={imgSize}
              border="2px solid #F1F1F1"
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
