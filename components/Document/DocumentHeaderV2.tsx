import { TopLevelDocument } from "~/config/types/root_types";

interface Props {
  document: TopLevelDocument;
}

const DocumentHeader = ({ document }: Props) => {
  return (
    <div>
      <h1>Document Header</h1>
    </div>
  )
}

export default DocumentHeader;

