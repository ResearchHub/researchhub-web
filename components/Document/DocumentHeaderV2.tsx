import Bounty from "~/config/types/bounty";
import { TopLevelDocument } from "~/config/types/root_types";
import ContentBadge from "../ContentBadge";
import { StyleSheet, css } from "aphrodite";

interface Props {
  document: TopLevelDocument;
}

type BProps =  {
  document: TopLevelDocument;
}

const DocumentBadges = ({ document }: BProps) => {
  return (
    <div>
      <ContentBadge
        contentType={document.documentType}
        label={document.documentType}
        size={"large"}
      />
    </div>
  )
}

const DocumentHeader = ({ document }: Props) => {
  return (
    <div>
      <div className={css(styles.badgesWrapper)}>
        <DocumentBadges document={document} />
      </div>
      <h1>{document.title}</h1>
    </div>
  )
}

const styles = StyleSheet.create({
  badgesWrapper: {
    display: "flex",
  }
})

export default DocumentHeader;

