import DiscussionThreadCard from "~/components/DiscussionThreadCard";

const DiscussionTab = () => {
  const threads = [{}];
  return <div>{renderThreads(threads)}</div>;
};

function renderThreads(threads) {
  return threads.map((data, i) => {
    return <DiscussionThreadCard key={i} data={data} />;
  });
}

export default DiscussionTab;
