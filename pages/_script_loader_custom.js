/*
  NOTE: This modifies next.js internal api behavior and may break your application.
  Tested on next.js version: 9.2.1
*/

import React from "react";
import { compact, flatten } from "lodash";
import { NextScript } from "next/document";

class NextScriptCustom extends NextScript {
  render() {
    const orgNextScripts = flatten(super.render().props.children);
    const scripts = compact(
      orgNextScripts.map((child) => {
        if (child && child.props && child.props.id === "__NEXT_DATA__") {
          return {
            props: { ...child.props },
            content: child.props.dangerouslySetInnerHTML.__html,
          };
        }
        if (child && child.type === "script") {
          return {
            props: { ...child.props },
            content: "",
          };
        }
        return null;
      })
    );
    const initialFilterer = (props) =>
      !props.src || !props.src.includes("chunk");
    const initialLoadScripts = scripts.filter(({ props }) =>
      initialFilterer(props)
    );
    const chunkedScripts = scripts.filter(
      ({ props }) => !initialFilterer(props)
    );
    const jsContent = `
      var chunkedScripts = ${JSON.stringify(chunkedScripts)};
      function mapChunkedScripts(e) {
        clearTimeout(timeout)
        chunkedScripts.map((script) => {
          if (!script || !script.props) return;
          try {
            var scriptTag = document.createElement('script');
            scriptTag.src = script.props.src;
            scriptTag.async = script.props.async;
            scriptTag.defer = script.props.defer;
            if (script.props.id) scriptTag.id = script.props.id;
            if (script.content) scriptTag.innerHTML = script.content;
            document.body.appendChild(scriptTag);
            document.onclick = null
            document.onscroll = null
          }
          catch(err) {
            console.log(err);
          }
        });
        if (e) {
          if (e.type == "click") {
            if (e.target.nodeName == "BUTTON" || e.target.type == "submit" || e.target.type == "button") {
              var clickTimeout = setTimeout(() => {
                e.target.click()
              }, 400);
            }
          }
        }
      }
      var timeout = setTimeout(() => {
        mapChunkedScripts()
      // 1800ms seems like when PageSpeed Insights stop waiting for more js       
      }, 1800);
      document.onclick = mapChunkedScripts
      document.onscroll = mapChunkedScripts
    `;
    return (
      <>
        {initialLoadScripts.map(({ props }) => (
          <script key={props.id} {...props} src={props.src} />
        ))}
        <script
          id="__NEXT_SCRIPT_CUSTOM"
          defer
          dangerouslySetInnerHTML={{ __html: jsContent }}
        />
      </>
    );
  }
}

export default NextScriptCustom;
