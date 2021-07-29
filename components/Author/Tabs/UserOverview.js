import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import UserContributionsTab from "~/components/Author/Tabs/UserContributions";
import UserDiscussionsTab from "~/components/Author/Tabs/UserDiscussions";
import AuthoredPapersTab from "~/components/Author/Tabs/AuthoredPapers";
import UserPromotionsTab from "~/components/Author/Tabs/UserPromotions";

const UserOverviewTab = ({ author }) => {
  const userContributions = author.contributions;

  return (
    <div>
      <section>
        <h2>Authored Papers</h2>
        <AuthoredPapersTab />
      </section>
      <section>
        <h2>Posts</h2>
        <UserContributionsTab />
      </section>
      <section>
        <h2>Comments</h2>
        <UserContributionsTab />
      </section>
      <section>
        <h2>Supported</h2>
        <UserPromotionsTab />
      </section>
    </div>
  );
};

const mapStateToProps = (state) => ({
  author: state.author,
});

export default connect(mapStateToProps)(UserOverviewTab);
