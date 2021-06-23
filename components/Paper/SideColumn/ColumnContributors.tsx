import AuthorCard from "./AuthorCard";
import ColumnAuthors from "./ColumnAuthors";
import ColumnSection from "./ColumnSection";
import PaperUserAvatars from "../../Paper/PaperUserAvatars";
import { StyleSheet } from "aphrodite";
import {
  getDiscussionUsersFromPaper,
  getAuthorName,
} from "../../../config/utils";

export default function ColumnContributors({ paper }) {
  const discussors = getDiscussionUsersFromPaper(paper);
  if (discussors.length === 0) {
    return null;
  }
  return (
    <ColumnSection
      items={[
        <PaperUserAvatars
          users={discussors}
          customStyle={styles.avatarsContainer}
        />,
      ]}
      paper={paper}
      sectionTitle="Contributors"
    />
  );
}

const styles = StyleSheet.create({
  avatarsContainer: {
    display: "flex",
    justifyContent: "flex-start",
    paddingLeft: 17,
  },
});
