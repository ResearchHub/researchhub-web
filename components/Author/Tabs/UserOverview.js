import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import get from "lodash/get";
import { isNumber } from "underscore";
import Link from "next/link";
import PropTypes from "prop-types";

import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import UserContributionsTab from "~/components/Author/Tabs/UserContributions";
import UserDiscussionsTab from "~/components/Author/Tabs/UserDiscussions";
import AuthoredPapersTab from "~/components/Author/Tabs/AuthoredPapers";
import UserPromotionsTab from "~/components/Author/Tabs/UserPromotions";
import UserPostsTab from "~/components/Author/Tabs/UserPosts";
import colors, { genericCardColors } from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import ComponentWrapper from "~/components/ComponentWrapper";
import EmptyState from "./EmptyState";
import icons from "~/config/themes/icons";

const UserOverviewTab = ({ author, fetching }) => {
  const maxCardsToRender = 2;
  const [submittedPaperCount, setSubmittedPaperCount] = useState(null);
  const [authoredPaperCount, setAuthoredPaperCount] = useState(null);
  const [commentCount, setCommentCount] = useState(null);
  const [postCount, setPostCount] = useState(null);

  useEffect(() => {
    const submittedPapers = get(author, "userContributions", {});
    const authoredPapers = get(author, "authoredPapers", {});
    const comments = get(author, "userDiscussions", {});
    const posts = get(author, "posts", {});

    if (isNumber(submittedPapers.count)) {
      setSubmittedPaperCount(submittedPapers.count);
    }
    if (isNumber(authoredPapers.count)) {
      setAuthoredPaperCount(authoredPapers.count);
    }
    if (isNumber(comments.count)) {
      setCommentCount(comments.count);
    }
    if (isNumber(posts.count)) {
      setPostCount(posts.count);
    }
  }, [author]);

  const renderSeeMoreLink = ({ relPath, text }) => {
    return (
      <div className={css(styles.linkWrapper)}>
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${author.id}/${relPath}`}
          shallow={true}
          replace={true}
          scroll={false}
        >
          <div className={css(styles.link)}>{text}</div>
        </Link>
      </div>
    );
  };

  const hasNoContent =
    !authoredPaperCount &&
    !postCount &&
    !commentCount &&
    !submittedPaperCount &&
    !fetching;

  if (hasNoContent) {
    return (
      <ComponentWrapper overrideStyle={styles.componentWrapper}>
        <section className={css(styles.section)}>
          <EmptyState
            message={"No activity found for this user"}
            icon={icons.help}
          />
        </section>
      </ComponentWrapper>
    );
  }

  return (
    <div>
      {(commentCount !== 0 || fetching) && (
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <section className={css(styles.section)}>
            {!fetching && (
              <h2 className={css(styles.sectionHeader)}>Comments</h2>
            )}
            <UserDiscussionsTab
              maxCardsToRender={maxCardsToRender}
              fetching={fetching}
            />
            {commentCount > maxCardsToRender &&
              !fetching &&
              renderSeeMoreLink({
                relPath: "discussions",
                text: "See all comments",
              })}
          </section>
        </ComponentWrapper>
      )}

      <div className={postCount > 0 ? css(styles.reveal) : css(styles.hide)}>
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <section className={css(styles.section)}>
            {isNumber(postCount) && (
              <h2 className={css(styles.sectionHeader)}>Posts</h2>
            )}
            <div>
              <UserPostsTab
                maxCardsToRender={maxCardsToRender}
                fetching={fetching}
              />
            </div>
            {postCount > maxCardsToRender &&
              renderSeeMoreLink({ relPath: "posts", text: "See all posts" })}
          </section>
        </ComponentWrapper>
      </div>

      {(authoredPaperCount !== 0 || fetching) && (
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <section className={css(styles.section)}>
            {!fetching && (
              <h2 className={css(styles.sectionHeader)}>Authored Papers</h2>
            )}
            <div>
              <AuthoredPapersTab
                maxCardsToRender={maxCardsToRender}
                fetching={fetching}
              />
            </div>
            {authoredPaperCount > maxCardsToRender &&
              !fetching &&
              renderSeeMoreLink({
                relPath: "authored-papers",
                text: "See all authored papers",
              })}
          </section>
        </ComponentWrapper>
      )}

      {(submittedPaperCount !== 0 || fetching) && (
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <section className={css(styles.section)}>
            {!fetching && (
              <h2 className={css(styles.sectionHeader)}>Paper Submissions</h2>
            )}
            <div>
              <UserContributionsTab
                maxCardsToRender={maxCardsToRender}
                fetching={fetching}
              />
            </div>
            {submittedPaperCount > maxCardsToRender &&
              !fetching &&
              renderSeeMoreLink({
                relPath: "contributions",
                text: "See all paper submissions",
              })}
          </section>
        </ComponentWrapper>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  author: state.author,
});

const styles = StyleSheet.create({
  reveal: {
    display: "block",
  },
  hide: {
    display: "none",
  },
  componentWrapper: {
    marginBottom: 20,
  },
  section: {
    background: "white",
    padding: "16px 20px",
    borderRadius: "2px",
    border: `1px solid ${genericCardColors.BORDER}`,
  },
  sectionHeader: {
    borderBottom: `1px solid ${genericCardColors.BORDER}`,
    paddingBottom: 10,
    marginBottom: 0,
    color: colors.BLACK(0.5),
    fontWeight: 500,
    fontSize: 16,
    marginTop: 0,
    textTransform: "capitalize",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 14,
    },
  },
  linkWrapper: {
    textAlign: "center",
    paddingTop: 16,
    borderTop: `1px solid ${genericCardColors.BORDER}`,
  },
  link: {
    color: colors.BLUE(),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
});

UserOverviewTab.propTypes = {
  author: PropTypes.object,
  fetching: PropTypes.bool,
};

export default connect(mapStateToProps)(UserOverviewTab);
