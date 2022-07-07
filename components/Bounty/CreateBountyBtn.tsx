import { ReactElement, useState, useEffect } from "react";
import { css, StyleSheet } from "aphrodite";
import BountyModal from "./BountyModal";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import ReactTooltip from "react-tooltip";

function CreateBountyBtn({ withPreview = true, onBountyChange }): ReactElement {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bountyAmountDetails, setBountyAmountDetails] = useState<null | any>(null)


  return (
    <div className={css(styles.createBountyBtn)} onClick={() => setIsModalOpen(true)}>
      <ReactTooltip
        id="bountyTooltip"
        effect="solid"
        place="top"
        className={css(bountyTooltip.tooltipContainer)}
        delayShow={500}
      >
        <div className={css(bountyTooltip.bodyContainer)}>
          <div className={css(bountyTooltip.title)}>
            Add ResearchCoin Bounty
          </div>
          <div className={css(bountyTooltip.desc)}>
            <div>• Offer ResearchCoin to the best solution</div>
            <div>• Improves chances of quality submissions</div>
          </div>
        </div>
      </ReactTooltip>      
      <BountyModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        handleBountyAdded={(amountDetails) => {
          setBountyAmountDetails(amountDetails);
          onBountyChange(amountDetails);
        }}
        appliedBounty={bountyAmountDetails}
        withPreview={withPreview}
        removeBounty={() => setBountyAmountDetails(null)}
      />
      {bountyAmountDetails && withPreview
        ? (
          <span 
            className={css(styles.bountyPreview)}
          >
            <div className={css(styles.bountyAmount)}>
              <img
                className={css(styles.coinIcon)}
                src={"/static/icons/coin-filled.png"}
                alt="RSC Coin"
              />              
              {bountyAmountDetails?.netBountyAmount} RSC bounty
            </div>
          </span>
        ) : (
          <div
            data-tip={""}
            data-for="bountyTooltip"
          >
            <span className={css(styles.bountyIcon)}>
              {icons.plus}
            </span>Add Bounty
          </div>          
        ) 
      }
    </div>
  )
}

const popover = StyleSheet.create({
  container: {
    position: "absolute",
    display: "none",
    zIndex: 1,
    background: "white",
    padding: "15px 0 10px 0",
    border: `1px solid ${colors.GREY()}`,
    borderRadius: 4,
    marginTop: 5,
    width: 100,
    boxShadow: "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",    
  },
  open: {
    display: "block"
  }
})

const bountyTooltip = StyleSheet.create({
  tooltipContainer: {
    textAlign: "left",
    maxWidth: 300,
    padding: 15,
  },
  bodyContainer: {},
  title: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    lineHeight: "20px",
  },
});

const styles = StyleSheet.create({
  createBountyBtn: {
    color: colors.ORANGE_DARK(),
    fontSize: 15,
    fontWeight: 400,
    cursor: "pointer",
    border: "1px solid",
    borderRadius: 50,
    padding: "7px 16px",
    ":hover": {
      color: colors.ORANGE()
    },
    boxSizing: "border-box",
    height: 34,
  },
  coinIcon: {
    height: 18,
    marginRight: 8,
  },  
  bountyIcon: {
    fontSize: 14,
  },
  bountyPreview: {

  },
  bountyAmount: {
    display: "flex",
    alignItems: "center",
  }
});


export default CreateBountyBtn;