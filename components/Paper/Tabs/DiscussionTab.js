import { useRouter } from "next/router";

import DiscussionThreadCard from "~/components/DiscussionThreadCard";
import DiscussionThreadActionBar from "~/components/DiscussionThreadActionBar";
import { endsWithSlash } from "~/config/utils/routing";
import { doesNotExist } from "~/config/utils";

const DiscussionTab = (props) => {
  const { threads } = props;
  const router = useRouter();
  const basePath = formatBasePath(router.asPath);
  const formattedThreads = formatThreads(threads, basePath);

  return <div>{renderThreads(formattedThreads)}</div>;
};

function formatBasePath(path) {
  if (endsWithSlash(path)) {
    return path;
  }
  return path + "/";
}

function formatThreads(threads, basePath) {
  return threads.map((thread) => {
    return {
      key: thread.id,
      data: thread,
      path: basePath + thread.id,
    };
  });
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
