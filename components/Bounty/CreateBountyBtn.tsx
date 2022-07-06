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
          <div onClick={() => setIsModalOpen(true)} className={css(styles.btnContainer)}>
            <span className={css(styles.bountyIcon)}>{icons.plus}</span> Add Bounty
          </div>          
        ) 
      }
    </div>
  )
}

const styles = StyleSheet.create({
  createBountyBtn: {
    color: colors.ORANGE_DARK(),
    fontSize: 15,
    fontWeight: 400,
    cursor: "pointer",

  },
  btnContainer: {
    color: colors.ORANGE_DARK(),
    border: "1px solid",
    borderRadius: 50,
    padding: "7px 16px",
    ":hover": {
      color: colors.ORANGE()
    }
  },
  bountyIcon: {
    fontSize: 14,
  },
  bountyPreview: {

  },
  bountyAmount: {

  }
});


export default CreateBountyBtn;