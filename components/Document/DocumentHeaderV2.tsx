import { TopLevelDocument } from "~/config/types/root_types";
import { StyleSheet, css } from "aphrodite";
import DocumentBadges from "./DocumentBadges";
import DocumentLineItems from "./DocumentLineItems";


interface Props {
  document: TopLevelDocument;
}

const DocumentHeader = ({ document }: Props) => {
  return (
    <div>
      <div className={css(styles.badgesWrapper)}>
        <DocumentBadges document={document} />
      </div>
      <h1>{document.title}</h1>
      <DocumentLineItems document={document} />
    </div>
  )
}

const styles = StyleSheet.create({
  badgesWrapper: {
    display: "flex",
    marginBottom: 10,
  }
})

export default DocumentHeader;

