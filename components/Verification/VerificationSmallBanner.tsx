import { StyleSheet, css } from "aphrodite";
import Button from "../Form/Button";
import VerificationModal from "./VerificationModal";
import { useState } from "react";

const VerificationSmallBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className={css(styles.title)}>Become a Verified Author</div>
      <p className={css(styles.description)}>
        Verify your authorship to get access to the best ResearchHub has to
        offer.
      </p>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Verify
      </Button>
      <VerificationModal
        handleModalClose={() => setIsModalOpen(false)}
        isModalOpen={isModalOpen}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  title: {},
  description: {},
});

export default VerificationSmallBanner;
