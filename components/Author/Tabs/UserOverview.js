import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { get } from "lodash";
import { isNumber } from "underscore";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import UserContributionsTab from "~/components/Author/Tabs/UserContributions";
import UserDiscussionsTab from "~/components/Author/Tabs/UserDiscussions";
import AuthoredPapersTab from "~/components/Author/Tabs/AuthoredPapers";
import UserPromotionsTab from "~/components/Author/Tabs/UserPromotions";
import UserPostsTab from "~/components/Author/Tabs/UserPosts";
import Link from "next/link";
import colors, { genericCardColors } from "~/config/themes/colors";
import ComponentWrapper from "~/components/ComponentWrapper";

const UserOverviewTab = ({ author }) => {
  const maxCardsToRender = 2;
  const [submittedPaperCount, setSubmittedPaperCount] = useState(null);
  const [authoredPaperCount, setAuthoredPaperCount] = useState(null);
  const [commentCount, setCommentCount] = useState(null);
  const [supportedPaperCount, setSupportedPaperCount] = useState(null);
  const [postCount, setPostCount] = useState(null);

  useEffect(() => {
    const submittedPapers = get(author, "userContributions", {});
    const authoredPapers = get(author, "authoredPapers", {});
    const comments = get(author, "userDiscussions", {});
    const supportedPapers = get(author, "promotions", {});
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
    if (isNumber(supportedPapers.count)) {
      setSupportedPaperCount(supportedPapers.count);
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
        >
          <a
            href={`/user/${author.id}/${relPath}`}
            className={css(styles.link)}
            rel="noreferrer noopener"
          >
            {text}
          </a>
        </Link>
      </div>
    );
  };

  return (
    <div>
      {authoredPaperCount !== 0 && (
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <section className={css(styles.section)}>
            {isNumber(authoredPaperCount) && (
              <h2 className={css(styles.sectionHeader)}>Authored Papers</h2>
            )}
            <AuthoredPapersTab />
            {authoredPaperCount > maxCardsToRender &&
              renderSeeMoreLink({
                relPath: "authored-papers",
                text: "See all authored papers",
              })}
          </section>
        </ComponentWrapper>
      )}
      {postCount !== 0 && (
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <section className={css(styles.section)}>
            {isNumber(postCount) && (
              <h2 className={css(styles.sectionHeader)}>Posts</h2>
            )}
            <UserPostsTab />
            {postCount > maxCardsToRender &&
              renderSeeMoreLink({ relPath: "posts", text: "See all posts" })}
          </section>
        </ComponentWrapper>
      )}
      {submittedPaperCount !== 0 && (
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <section className={css(styles.section)}>
            {isNumber(submittedPaperCount) && (
              <h2 className={css(styles.sectionHeader)}>Submitted Papers</h2>
            )}
            <UserContributionsTab />
            {submittedPaperCount > maxCardsToRender &&
              renderSeeMoreLink({
                relPath: "contributions",
                text: "See all submitted papers",
              })}
          </section>
        </ComponentWrapper>
      )}
      {commentCount !== 0 && (
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <section className={css(styles.section)}>
            {isNumber(commentCount) && (
              <h2 className={css(styles.sectionHeader)}>Comments</h2>
            )}
            <UserDiscussionsTab maxCardsToRender={maxCardsToRender} />
            {commentCount > maxCardsToRender &&
              renderSeeMoreLink({
                relPath: "discussions",
                text: "See all comments",
              })}
          </section>
        </ComponentWrapper>
      )}
      {supportedPaperCount !== 0 && (
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <section className={css(styles.section)}>
            {isNumber(supportedPaperCount) && (
              <h2 className={css(styles.sectionHeader)}>Supported Content</h2>
            )}
            <UserPromotionsTab />
            {supportedPaperCount > maxCardsToRender &&
              renderSeeMoreLink({
                relPath: "boosts",
                text: "See all supported content",
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
  componentWrapper: {
    marginBottom: 20,
  },
  section: {
    background: "white",
    padding: "24px 20px 24px 20px",
    borderRadius: "2px",
    border: `1px solid ${genericCardColors.BORDER}`,
  },
  sectionHeader: {
    borderBottom: "1px solid rgba(36, 31, 58, 0.08) !important",
    paddingBottom: 10,
    color: "rgba(36, 31, 58, 0.5) !important",
    fontWeight: 500,
    fontSize: 16,
    marginTop: 0,
  },
  linkWrapper: {
    textAlign: "center",
    paddingTop: 24,
    borderTop: `1px solid ${genericCardColors.BORDER}`,
  },
  link: {
    color: colors.BLUE(),
  },
});

export default connect(mapStateToProps)(UserOverviewTab);
