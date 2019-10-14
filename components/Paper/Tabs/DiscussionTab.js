import { useRouter } from "next/router";

import DiscussionThreadCard from "~/components/DiscussionThreadCard";
import { endsWithSlash } from "~/config/utils/routing";
import ComponentWrapper from "../../ComponentWrapper";

const DiscussionTab = (props) => {
  const { hostname, threads } = props;
  const router = useRouter();
  const basePath = formatBasePath(router.asPath);
  const formattedThreads = formatThreads(threads, basePath);

  function renderThreads(threads) {
    return (
      threads &&
      threads.map((t, i) => {
        return (
          <DiscussionThreadCard
            key={t.key}
            data={t.data}
            hostname={hostname}
            hoverEvents={true}
            path={t.path}
          />
        );
      })
    );
  }

  return (
    <ComponentWrapper>
      {renderThreads(formattedThreads, hostname)}
    </ComponentWrapper>
  );
};

function formatBasePath(path) {
  if (endsWithSlash(path)) {
    return path;
  }
  return path + "/";
}

function formatThreads(threads, basePath) {
  return (
    threads &&
    threads.map((thread) => {
      return {
        key: thread.id,
        data: thread,
        path: basePath + thread.id,
      };
    })
  );
}

export default DiscussionTab;
