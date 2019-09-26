import DiscussionThreadCard from "~/components/DiscussionThreadCard";

const DiscussionTab = () => {
  const threads = [{}];
  return <div>{renderThreads(threads)}</div>;
};

function renderThreads(threads) {
  return threads.map((data) => <DiscussionThreadCard data={data} />);
}

export default DiscussionTab;
