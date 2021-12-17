import API from "~/config/api";
import JupyterViewer from "@thomasvu/react-jupyter-notebook";
import withWebSocket from "~/components/withWebSocket";
import { Helpers } from "@quantfive/js-web-config";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { isNullOrUndefined } from "~/config/utils/nullchecks";

const CustomJupyterViewer = forwardRef(({ uid, wsResponse }, ref) => {
  const [jupyterContent, setJupyterContent] = useState(null);

  useEffect(() => {
    if (!isNullOrUndefined(wsResponse)) {
      const { data: jupyterData, type: responseType } = JSON.parse(wsResponse);

      switch (responseType) {
        case "loading_progress":
          break;
        case "update":
          setJupyterContent(jupyterData);
          break;
      }
    }
  }, [wsResponse]);

  useEffect(() => {
    const _fetchJupyter = async () => {
      const params = {
        filename: "Untitled",
      };
      const response = await fetch(
        API.JUPYTER({ uid }),
        API.POST_CONFIG(params)
      );
      const parsed = await Helpers.parseJSON(response);
      setJupyterContent(parsed.data.content);
    };

    _fetchJupyter();
  }, []);

  const updateJupyterContent = (jupyterContent) => {
    setJupyterContent(jupyterContent);
  };

  useImperativeHandle(ref, () => {
    return {
      updateJupyterContent: updateJupyterContent,
    };
  });

  return (
    <>
      {jupyterContent ? (
        <>
          <div>{uid}</div>
          <a
            href={`https://staging-jupyter.researchhub.com/login?researchhub-login=${uid}`}
          >
            Loading JupyterHub
          </a>
          <JupyterViewer rawIpynb={jupyterContent} />
        </>
      ) : (
        <>
          <div>{uid}</div>
          <a
            href={`https://staging-jupyter.researchhub.com/login?researchhub-login=${uid}`}
          >
            Loading JupyterHub
          </a>
        </>
      )}
    </>
  );
});

export default withWebSocket(CustomJupyterViewer);
