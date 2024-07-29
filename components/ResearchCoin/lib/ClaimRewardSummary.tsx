type Props = {
  isOpenAccess: boolean;
  isOpenData: boolean;
  isPreregistered: boolean;
  baseReward: number;
  preregistrationMultiplier?: number;
  openDataMultiplier?: number;
}

const ClaimRewardSummary = ({
  baseReward,
  isOpenAccess,
  isOpenData,
  isPreregistered,
  preregistrationMultiplier = 0,
  openDataMultiplier = 0
}: Props) => {

  const calculatedRewards = {
    openAccess: isOpenAccess ? baseReward : 0,
    openData: isOpenData ? baseReward * openDataMultiplier : 0,
    preregistration: isPreregistered ? baseReward * preregistrationMultiplier : 0,
    total: 0,
  }

  calculatedRewards.total = calculatedRewards.openAccess + calculatedRewards.openData + calculatedRewards.preregistration;

  return (
    <div>
      <div>Rewards Summary:</div>
      <div>Open Access: {calculatedRewards.openAccess + " RSC"}</div>
      <div>
        Open Data: {calculatedRewards.openData + " RSC"}
        <span>{openDataMultiplier && ` ${openDataMultiplier}x`}</span>
      </div>
      <div>
        Preregistration: {calculatedRewards.preregistration + " RSC"}
        <span>{preregistrationMultiplier && ` ${preregistrationMultiplier}x`}</span>
      </div>
      <div>
        Total: {calculatedRewards.total + " RSC"}
      </div>
    </div>
  )
}

export default ClaimRewardSummary;