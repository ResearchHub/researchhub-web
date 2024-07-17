import { css, StyleSheet } from "aphrodite";
import { useState } from "react";
import colors from "~/config/themes/colors";
import PendingBadge from "~/components/shared/PendingBadge";
import VerifyPublicationsModal from "~/components/Author/Profile/VerifyPublicationsModal";
import Button from "~/components/Form/Button";
import { authorProfileContext } from "../lib/AuthorProfileContext";

const VerifyPublicationsSection = () => {
  const [isPublicationsModalOpen, setIsPublicationsModalOpen] = useState(false);
  const {
    fullAuthorProfile,
  } = authorProfileContext();

  if (fullAuthorProfile.hasVerifiedPublications) {
    return null;
  }

  return (
    <div className={css(styles.verifyPublications)}>
      <VerifyPublicationsModal isOpen={isPublicationsModalOpen} setIsOpen={setIsPublicationsModalOpen} />
      <div>
        <div className={css(styles.verifyPublicationsTitle)}>Is this accurate?</div>
        <div className={css(styles.verifyPublicationsDescription)}>Please confirm you have authored or co-authored the publications listed below. Once confirmed the <div style={{ display: "inline-flex", marginTop: 5, }}><PendingBadge /></div> will be removed.</div>
      </div>
      <div style={{ width: 150 }}>
        <Button variant="outlined" onClick={() => setIsPublicationsModalOpen(true)} fullWidth>Looks good</Button>
      </div>
    </div>    
  )
}

const styles = StyleSheet.create({
  verifyPublications: {
    border: `1px solid ${colors.YELLOW2()}`,
    borderRadius: 8,
    display: "flex",
    padding: "15px 20px",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: "100px",
  },
  verifyPublicationsTitle: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 3
  },
  verifyPublicationsDescription: {
    color: colors.MEDIUM_GREY2(),
    fontSize: 15,
    lineHeight: "18px"
  },
})

export default VerifyPublicationsSection;