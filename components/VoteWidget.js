import { doesNotExist } from "~/config/utils";

const VoteWidget = (props) => {
  const score = getScore(props);

  return <div>{score}</div>;
};

function getScore(props) {
  const { score } = props;
  if (doesNotExist(score)) {
    return "--";
  }
  return score;
}

export default VoteWidget;
