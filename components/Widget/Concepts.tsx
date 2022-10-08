import { Concept } from "~/config/types/root_types";

interface ConceptsProps {
  concepts: Array<Concept>;
}

export default function Concepts({ concepts }: ConceptsProps): JSX.Element {
  if (!concepts) {
    return <></>;
  }
  const conceptElems = concepts.map((concept) => (
    <span
      style={{
        fontFamily: "Roboto Condensed",
        fontSize: "10pt",
        display: "inline-block",
        color: "rgb(70, 70, 70)",
        background: "rgb(245, 245, 245)",
        borderRadius: "4px",
        padding: "0px 5px 0px 5px",
        margin: "1.75px 2px",
      }}
      title={concept.description}
    >
      {concept.displayName}
    </span>
  ));
  return <>{conceptElems}</>;
}
