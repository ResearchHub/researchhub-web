import VoteWidget from "./VoteWidget";

const DiscussionThreadCard = () => {
  return (
    <div>
      <VoteWidget score={5} />
      <div>User component</div>
      <div>Thread title</div>
      <div>Number of comments</div>
      <div>share button</div>
      <div>read button</div>
    </div>
  );
};

export default DiscussionThreadCard;
