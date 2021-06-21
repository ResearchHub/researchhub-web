import ColumnSection from "./ColumnSection";
import { useState, useEffect } from "react";
import { getUploaderFromPaper, getAuthorName } from "../../../config/utils";
import AuthorCard from "./AuthorCard";

export default function ColumnSubmitter({ paper }) {
  const submitter = getUploaderFromPaper(paper);
  if (!submitter) {
    return null;
  }
  const name = getAuthorName(submitter);
  const cardKey = `${name}-submitter`;
  const submitterCard = (
    <AuthorCard author={submitter} name={name} key={cardKey} />
  );
  return (
    <ColumnSection
      items={[submitterCard]}
      paper={paper}
      sectionTitle="Submitter"
    />
  );
}
