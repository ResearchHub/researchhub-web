import { AuthorProfile } from "~/config/types/root_types"
import CoAuthors from "./CoAuthors";
import { getDocumentCard } from "~/components/UnifiedDocFeed/utils/getDocumentCard";
import { css, StyleSheet } from "aphrodite";

const AuthorWorks = ({ works, coauthors }: { works: any, coauthors: AuthorProfile[] }) => {
  return (
    <div className={css(styles.wrapper)}>
      <div className={css(styles.sectionHeader)}>Top Works</div>
      <div className={css(styles.contentWrapper)}>
        <div>
          {/* @ts-ignore */}
          {getDocumentCard({ unifiedDocumentData: works })}
        </div>

        <div className={css(styles.coauthorsSection)}>
          <CoAuthors coauthors={coauthors} />
        </div>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  wrapper: {
  },
  contentWrapper: {
    display: "flex",
  },
  sectionHeader: {
    color: "rgb(139, 137, 148, 1)",
    textTransform: "uppercase",
    fontWeight: 500,
    letterSpacing: "1.2px",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
    marginTop: 20,
  },  
  coauthorsSection: {
    backgroundColor: "rgb(250, 250, 250)",
    borderRadius: 20,
    border: "1px solid #F5F5F9",
    padding: 20,
    minWidth: 245,
    height: "max-content",
  }
  
})

export default AuthorWorks;