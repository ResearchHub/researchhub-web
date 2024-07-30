import { AuthorProfile } from "~/config/types/root_types";
import { getDocumentCard } from "~/components/UnifiedDocFeed/utils/getDocumentCard";
import { css, StyleSheet } from "aphrodite";

const AuthorWorks = ({ works }: { works: any }) => {
  return (
    <div className={css(styles.wrapper)}>
      <div className={css(styles.sectionHeader)}>Top Works</div>
      <div className={css(styles.contentWrapper)}>
        <div>
          {/* @ts-ignore */}
          {getDocumentCard({ unifiedDocumentData: works, noPreview: true})}
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
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
});

export default AuthorWorks;
