import { useRouter } from "next/router";

import DiscussionThreadCard from "~/components/DiscussionThreadCard";

const DiscussionTab = () => {
  const router = useRouter();
  const basePath = router.asPath;

  const threads = [{ key: "key", data: "data", path: basePath + "/" + "1" }];

  return <div>{renderThreads(threads)}</div>;
};

function renderThreads(threads) {
  return threads.map((t, i) => {
    return <DiscussionThreadCard key={t.key} data={t.data} path={t.path} />;
  });
}

export default DiscussionTab;
