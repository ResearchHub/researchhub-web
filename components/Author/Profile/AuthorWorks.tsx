import { AuthorProfile } from "~/config/types/root_types"
import CoAuthors from "./CoAuthors";
import { getDocumentCard } from "~/components/UnifiedDocFeed/utils/getDocumentCard";
import { css, StyleSheet } from "aphrodite";

const AuthorWorks = ({ works, coauthors }: { works: any, coauthors: AuthorProfile[] }) => {
  return (
    <div>
      <div>Top Works</div>
      <div>
        {/* @ts-ignore */}
        {getDocumentCard({ unifiedDocumentData: works })}
      </div>

      <CoAuthors coauthors={coauthors} />
    </div>
  )
}

const styles = StyleSheet.create({
})

export default AuthorWorks;