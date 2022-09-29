import ALink from "~/components/ALink";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { AuthorProfile } from "~/config/types/root_types";

type Args = {
  authorProfile: AuthorProfile | undefined;
};

const ContributionAuthor = ({ authorProfile }: Args) => {
  return (
    <span className={css(styles.author)}>
      <ALink
        href={`/user/${authorProfile?.id}/overview`}
        overrideStyle={styles.link}
      >
        {authorProfile?.firstName || "N/A"} {authorProfile?.lastName || "User"}
      </ALink>
    </span>
  );
};

const styles = StyleSheet.create({
  link: {
    cursor: "pointer",
    fontWeight: 400,
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  author: {
    display: "inline-flex",
  },
});

export default ContributionAuthor;
