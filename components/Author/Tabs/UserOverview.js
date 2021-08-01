import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { get } from "lodash";
import { isNumber } from "underscore";
import Link from "next/link";
import PropTypes from "prop-types";

import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import UserContributionsTab from "~/components/Author/Tabs/UserContributions";
import UserDiscussionsTab from "~/components/Author/Tabs/UserDiscussions";
import AuthoredPapersTab from "~/components/Author/Tabs/AuthoredPapers";
import UserPromotionsTab from "~/components/Author/Tabs/UserPromotions";
import UserPostsTab from "~/components/Author/Tabs/UserPosts";
import UserTransactionsTab from "~/components/Author/Tabs/UserTransactions";
import colors, { genericCardColors } from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import ComponentWrapper from "~/components/ComponentWrapper";
import EmptyState from "./EmptyState";
import icons from "~/config/themes/icons";

const UserOverviewTab = ({ author, transactions, fetching }) => {
  const maxCardsToRender = 2;
  const [submittedPaperCount, setSubmittedPaperCount] = useState(null);
  const [authoredPaperCount, setAuthoredPaperCount] = useState(null);
  const [commentCount, setCommentCount] = useState(null);
  const [supportedPaperCount, setSupportedPaperCount] = useState(null);
  const [postCount, setPostCount] = useState(null);
  const [transactionCount, setTransactionCount] = useState(null);

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

  useEffect(() => {
    if (get(transactions, "withdrawals")) {
      setTransactionCount(transactions.withdrawals.length);
    }
  }, [transactions]);

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
    authoredPaperCount === 0 &&
    postCount === 0 &&
    commentCount === 0 &&
    submittedPaperCount === 0 &&
    supportedPaperCount === 0 &&
    transactionCount === 0 &&
    fetching === false;

  // console.log('---------');
  // console.log('authoredPaperCount', authoredPaperCount);
  // console.log('postCount', postCount);
  // console.log('commentCount', commentCount);
  // console.log('submittedPaperCount', submittedPaperCount);
  // console.log('supportedPaperCount', supportedPaperCount);
  // console.log('transactionCount', transactionCount);
  // console.log('fetching', fetching);
  // console.log('---------');

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
      {postCount !== 0 && (
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <section className={css(styles.section)}>
            {isNumber(postCount) && (
              <h2 className={css(styles.sectionHeader)}>Posts</h2>
            )}
            <UserPostsTab
              maxCardsToRender={maxCardsToRender}
              fetching={fetching}
            />
            {postCount > maxCardsToRender &&
              !fetching &&
              renderSeeMoreLink({ relPath: "posts", text: "See all posts" })}
          </section>
        </ComponentWrapper>
      )}
      {authoredPaperCount !== 0 && (
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <section className={css(styles.section)}>
            {get(author, "authorDoneFetching") && !fetching && (
              <h2 className={css(styles.sectionHeader)}>Authored Papers</h2>
            )}
            <AuthoredPapersTab
              maxCardsToRender={maxCardsToRender}
              fetching={fetching}
            />
            {authoredPaperCount > maxCardsToRender &&
              !fetching &&
              renderSeeMoreLink({
                relPath: "authored-papers",
                text: "See all authored papers",
              })}
          </section>
        </ComponentWrapper>
      )}
      {submittedPaperCount !== 0 && (
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <section className={css(styles.section)}>
            {isNumber(submittedPaperCount) && (
              <h2 className={css(styles.sectionHeader)}>Submitted Papers</h2>
            )}
            <UserContributionsTab
              maxCardsToRender={maxCardsToRender}
              fetching={fetching}
            />
            {submittedPaperCount > maxCardsToRender &&
              !fetching &&
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
            {get(author, "discussionsDoneFetching") && !fetching && (
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
      {supportedPaperCount !== 0 && supportedPaperCount !== null && (
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <section className={css(styles.section)}>
            {isNumber(supportedPaperCount) && (
              <h2 className={css(styles.sectionHeader)}>Supported Content</h2>
            )}
            <UserPromotionsTab
              maxCardsToRender={maxCardsToRender}
              fetching={fetching}
            />
            {supportedPaperCount > maxCardsToRender &&
              !fetching &&
              renderSeeMoreLink({
                relPath: "boosts",
                text: "See all supported content",
              })}
          </section>
        </ComponentWrapper>
      )}
      {transactionCount !== 0 && (
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <section className={css(styles.section)}>
            {isNumber(transactionCount) && (
              <h2 className={css(styles.sectionHeader)}>Transactions</h2>
            )}
            <UserTransactionsTab
              maxCardsToRender={maxCardsToRender}
              fetching={fetching}
            />
            {transactionCount > maxCardsToRender &&
              !fetching &&
              renderSeeMoreLink({
                relPath: "transactions",
                text: "See all transactions",
              })}
          </section>
        </ComponentWrapper>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  author: state.author,
  transactions: state.transactions,
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: "24px 20px 14px 20px",
    },
  },
  sectionHeader: {
    borderBottom: `1px solid ${genericCardColors.BORDER}`,
    paddingBottom: 10,
    color: colors.BLACK(0.5),
    fontWeight: 500,
    fontSize: 16,
    marginTop: 0,
  },
  linkWrapper: {
    textAlign: "center",
    paddingTop: 24,
    borderTop: `1px solid ${genericCardColors.BORDER}`,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      paddingTop: 14,
      fontSize: 14,
    },
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
  transactions: PropTypes.object,
  fetching: PropTypes.bool,
};

export default connect(mapStateToProps)(UserOverviewTab);
