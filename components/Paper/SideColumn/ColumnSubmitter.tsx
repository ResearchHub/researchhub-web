import ColumnSection from "./ColumnSection";
import { useState } from "react";

export default function ColumnSubmitter({ paper }) {
  const [submitter, setSubmitter] = useState("");
  return <ColumnSection items={[submitter]} />;
}
