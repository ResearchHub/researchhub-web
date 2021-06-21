import ColumnSection from "./ColumnSection";
import { useState, useEffect } from "react";
import {
  getDiscussionUsersFromPaper,
  getAuthorName,
} from "../../../config/utils";
import AuthorCard from "./AuthorCard";

export default function ColumnContributors({ paper }) {
  const discussors = getDiscussionUsersFromPaper(paper);
  if (discussors.length === 0) {
    return null;
  }
  const discussorCards = discussors.map((user, index) => {
    const name = getAuthorName(user);
    const cardKey = `${name}-discussor-${index}`;
    return <AuthorCard author={user} name={name} key={cardKey} />;
  });
  return (
    <ColumnSection
      items={discussorCards}
      paper={paper}
      sectionTitle="Contributors"
    />
  );
}
