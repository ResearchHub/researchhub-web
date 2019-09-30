import { useRouter } from "next/router";

import DiscussionThreadCard from "~/components/DiscussionThreadCard";
import DiscussionThreadActionBar from "~/components/DiscussionThreadActionBar";
import { endsWithSlash } from "~/config/utils/routing";
import { doesNotExist } from "~/config/utils";

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

DiscussionTab.getInitialProps = async ({ store, query }) => {
  let { discussion } = store.getState();

  if (doesNotExist(discussion.id)) {
    const { paperId, threadId } = query;
    await store.dispatch(DiscussionActions.fetchThread(paperId, threadId));
  }

  return {};
};

export default DiscussionTab;
