import AuthorCard from "./AuthorCard";
import ColumnAuthors from "./ColumnAuthors";
import ColumnSection from "./ColumnSection";
import {
  getDiscussionUsersFromPaper,
  getAuthorName,
} from "../../../config/utils";

export default function ColumnContributors({ paper }) {
  const discussors = getDiscussionUsersFromPaper(paper);
  if (discussors.length === 0) {
    return null;
  }
  // TODO: briansantoso - implement user list similar to github contributors
  // const discussorCards = discussors.map((user, index) => {
  //   const name = getAuthorName(user);
  //   const cardKey = `${name}-discussor-${index}`;
  //   return <AuthorCard author={user} name={name} key={cardKey} />;
  // });
  // return (
  //   <ColumnSection
  //     items={discussorCards}
  //     paper={paper}
  //     sectionTitle="Contributors"
  //   />
  // );
  return (
    <ColumnAuthors
      title="Contributors"
      paper={paper}
      authors={discussors}
      paperId={paper.id}
    />
  );
}
