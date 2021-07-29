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

const UserOverviewTab = ({ author }) => {
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

  console.log(author);

  return (
    <div>
      {authoredPaperCount !== 0 && (
        <section>
          {isNumber(authoredPaperCount) && <h2>Authored Papers</h2>}
          <AuthoredPapersTab />
        </section>
      )}
      {postCount !== 0 && (
        <section>
          {isNumber(postCount) && <h2>Posts</h2>}
          <UserPostsTab />
        </section>
      )}
      {submittedPaperCount !== 0 && (
        <section>
          {isNumber(submittedPaperCount) && <h2>Submitted Papers</h2>}
          <UserContributionsTab />
        </section>
      )}
      {commentCount !== 0 && (
        <section>
          {isNumber(commentCount) && <h2>Comments</h2>}
          <UserDiscussionsTab />
        </section>
      )}
      {supportedPaperCount !== 0 && (
        <section>
          {isNumber(supportedPaperCount) && <h2>Supported Content</h2>}
          <UserPromotionsTab />
        </section>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  author: state.author,
});

export default connect(mapStateToProps)(UserOverviewTab);
