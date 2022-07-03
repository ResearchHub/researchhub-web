import { ReactElement, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import BountyModal from "./BountyModal";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

function CreateBountyBtn({ withPreview = true, onBountyChange }): ReactElement {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bountyAmountDetails, setBountyAmountDetails] = useState<null | any>(null)

  return (
    <div className={css(styles.createBountyBtn)}>
      <BountyModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        handleBountyAdded={(amountDetails) => {
          setBountyAmountDetails(amountDetails);
          onBountyChange(amountDetails);
        }}
        withPreview={withPreview}
      />
      {bountyAmountDetails && withPreview
        ? (
          <div className={css(styles.bountyPreview)}>
            <div className={css(styles.bountyAmount)}>{icons.bountySolid} {bountyAmountDetails?.netBountyAmount} RSC bounty added</div>
            <span onClick={() => {
              setBountyAmountDetails(null);
              onBountyChange(null);
            }}>remove bounty {icons.times}</span>
          </div>
        ) : (
          <div onClick={() => setIsModalOpen(true)}>
            <span className={css(styles.bountyIcon)}>{icons.plusThick}</span> Add ResearchCoin Bounty
          </div>          
        ) 
      }
    </div>
  )
}

const styles = StyleSheet.create({
  createBountyBtn: {
    color: colors.ORANGE_DARK(),
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    ":hover": {
      color: colors.ORANGE()
    }
  },
  bountyIcon: {
    fontSize: 16,
  },
  bountyPreview: {

  },
  bountyAmount: {

  }
});


export default CreateBountyBtn;