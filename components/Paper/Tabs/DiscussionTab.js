import { useRouter } from "next/router";

import DiscussionThreadCard from "~/components/DiscussionThreadCard";
import DiscussionThreadActionBar from "~/components/DiscussionThreadActionBar";
import { endsWithSlash } from "~/config/utils/routing";

const DiscussionTab = () => {
  const router = useRouter();
  const basePath = formatBasePath(router.asPath);

  const threads = [{ key: "key", data: "data", path: basePath + "1" }];

  return <div>{renderThreads(threads)}</div>;
};

function formatBasePath(path) {
  if (endsWithSlash(path)) {
    return path;
  }
  return path + "/";
}

function renderThreads(threads) {
  return threads.map((t, i) => {
    return (
      <DiscussionThreadCard key={t.key} data={t.data} path={t.path}>
        <DiscussionThreadActionBar />
      </DiscussionThreadCard>
    );
  });
}

export default DiscussionTab;
