import { StyleSheet, css } from "aphrodite";
import Button from "../Form/Button";
import VerificationModal, { VerifiedBadge } from "./VerificationModal";
import { useState } from "react";


const VerificationSmallBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <VerifiedBadge height={35} width={35} />
      <div className={css(styles.title)}>Become a Verified Author</div>
      <p className={css(styles.description)}>
        Verify your authorship to improve your academic reputation on the platform and earn RSC.
      </p>
      <Button type="primary" onClick={() => setIsModalOpen(true)} size="small">
        Verify now
      </Button>
      <VerificationModal
        handleModalClose={() => setIsModalOpen(false)}
        isModalOpen={isModalOpen}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 500,
  },
  description: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: "19px"
  },
});

export default VerificationSmallBanner;
