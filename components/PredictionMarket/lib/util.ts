const computeProbability = (
  {
    total,
    yes,
  }: {
    total: number;
    yes: number;
    no: number;
  } = {
    total: 0,
    yes: 0,
    no: 0,
  }
): number | undefined => {
  if (total === 0) {
    return undefined;
  }

  return (yes / total) * 100;
};

const computePotentialPayout = (
  {
    pool,
    userAmount,
    userVote,
    addUserAmountToPool,
  }: {
    pool: {
      yes: number;
      no: number;
    };
    userAmount: number;
    userVote: boolean;
    // this is used for when we're computing the payout
    // for a new vote that isn't in the total pool yet.
    addUserAmountToPool?: boolean;
  } = {
    pool: {
      yes: 0,
      no: 0,
    },
    userAmount: 0,
    userVote: false,
    addUserAmountToPool: false,
  }
): number => {
  if (userAmount === 0) {
    return 0;
  }

  if (addUserAmountToPool) {
    const winningPool = pool.yes + pool.no + userAmount;

    const userWinningShare = userVote
      ? userAmount / (pool.yes + userAmount)
      : userAmount / (pool.no + userAmount);

    return userWinningShare * winningPool;
  }
  const winningPool = pool.yes + pool.no;

  const userWinningShare = userVote
    ? userAmount / pool.yes
    : userAmount / pool.no;

  return userWinningShare * winningPool;
};

const predMarketUtils = {
  computeProbability,
  computePotentialPayout,
};
export default predMarketUtils;
