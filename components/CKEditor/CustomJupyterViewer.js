import API from "~/config/api";
import JupyterViewer from "@thomasvu/react-jupyter-notebook";
import nb_test from "./nb_test.json"; // You need to read the .ipynb file into a JSON Object.
import { Helpers } from "@quantfive/js-web-config";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const CustomJupyterViewer = forwardRef((props, ref) => {
  const [jupyterContent, setJupyterContent] = useState(null);

  useEffect(() => {
    const _fetchJupyter = async () => {
      const params = {
        file_name: "RunningCode.ipynb",
      };

      const response = await fetch(
        API.JUPYTER({ noteId: 264 }),
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
      {/*
      <div
        onClick={async () => {
          const baseUrl = "https://staging-jupyter.researchhub.com";
          //const authToken = typeof window !== "undefined" ? window.localStorage[AUTH_TOKEN] : "";
          const authToken = "da1407bc28207a66f9d78cf60223fb62b355a495";
          const jupyterUrl = `${baseUrl}/login?researchhub-login=${authToken}&note_id=${264}`;
          window.open(jupyterUrl);
        }}
      >
        Login
      </div>
      <div
        onClick={async () => {
          const params = {
            file_name: "RunningCode.ipynb",
          };

          const response = await fetch(
            API.JUPYTER({ noteId: 264 }),
            API.POST_CONFIG(params)
          );
          const parsed = await Helpers.parseJSON(response);
          console.log(parsed.data.content);
          console.log(nb_test);
          setJupyterContent(parsed.data.content);
        }}
      >
        Refresh
      </div>
      <div
        onClick={() => {
          console.log(jupyterContent);
          console.log(nb_test);
        }}
      >
        Print
      </div>
      */}
      {jupyterContent && <JupyterViewer rawIpynb={jupyterContent} />}
    </>
  );
});

export default CustomJupyterViewer;
