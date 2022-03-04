import Html from "slate-html-serializer";
import ModalImage from "react-modal-image";
import { css, StyleSheet } from "aphrodite";
import QuillToPlaintext from "quill-to-plaintext";
import Plain from "slate-plain-serializer";

export function convertEditorValueToHtml(value) {
  if (typeof value === "object" && value.hasOwnProperty("ops")) {
    return value;
  }

  const styles = StyleSheet.create({
    added: {
      background: "rgba(19, 145, 26, .2)",
      color: "rgba(19, 145, 26)",
    },
    removed: {
      background: "rgba(173, 34, 21, .2)",
      color: "rgb(173, 34, 21)",
    },
    image: {
      display: "block",
      maxWidth: "100%",
      maxHeight: 500,
      opacity: 1,
    },
    deleteImage: {
      position: "absolute",
      top: 10,
      right: 10,
      fontSize: 30,
      color: "#fff",
      cursor: "pointer",
      zIndex: 3,
    },
    imageContainer: {
      position: "relative",
      width: "fit-content",
    },
    imageBlock: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "auto",
      marginRight: "auto",
    },
    imageOverlay: {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      opacity: "0%",
      opacity: 1,
      ":hover": {
        background: "linear-gradient(#000 1%, transparent 100%)",
        opacity: "100%",
      },
    },
    iframeContainer: {
      position: "relative",
      paddingBottom: "56.25%",
      paddingTop: 30,
      height: 0,
      overflow: "hidden",
    },
    iframe: {
      width: 543,
      height: 305.5,

      "@media only screen and (max-width: 767px)": {
        width: "100%",
      },
    },
    smallOverlay: {
      height: 60,
    },
    bold: {
      fontWeight: 500,
      color: "#241F3A",
    },
    stickyBottom: {
      position: "sticky",
      backgroundColor: "#fff",
      top: 59,
      zIndex: 3,
    },
    removeStickyToolbar: {
      position: "unset",
    },
    urlToolTip: {
      top: 60,
      bottom: "unset",
    },
    imgToolTip: {
      top: 60,
      bottom: "unset",
    },
  });

  const renderBlock = (node, children) => {
    let { attributes } = node;
    switch (node.type) {
      case "line":
      case "paragraph":
        return <p {...attributes}>{children}</p>;
      case "block-quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "heading-one":
        return (
          <h2
            style={{ fontSize: 22, fontWeight: 500, paddingBottom: 10 }}
            {...attributes}
          >
            {children}
          </h2>
        );
      case "heading-two":
        return (
          <h3
            style={{ fontSize: 20, fontWeight: 500, marginBottom: 10 }}
            {...attributes}
          >
            {children}
          </h3>
        );
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      case "video":
        let video = node.data.get("url");
        let youtubeID = getUrlParameter("v", video);
        return (
          <div className={css(styles.imageBlock)} {...attributes}>
            <div className={css(styles.imageContainer)} contentEditable={false}>
              {video.includes("youtube") ? (
                <div className={""}>
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeID}`}
                    frameborder="0"
                    className={css(styles.iframe)}
                    allow="accelerometer;autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              ) : (
                <video
                  src={node.data.get("url")}
                  className={css(styles.image)}
                />
              )}
            </div>
          </div>
        );
      case "image":
        return (
          <div className={css(styles.imageBlock)} {...attributes}>
            <div className={css(styles.imageContainer)} contentEditable={false}>
              <ModalImage
                small={node.data.get("url")}
                large={node.data.get("url")}
                className={css(styles.image)}
              />
            </div>
          </div>
        );
      default:
        return;
    }
  };

  const renderMark = (mark, children) => {
    let { attributes } = mark;
    switch (mark.type) {
      case "bold":
        return <strong {...attributes}>{children}</strong>;
      case "code":
        return <code {...attributes}>{children}</code>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      case "underlined":
        return <u {...attributes}>{children}</u>;
      case "added":
        return (
          <span {...attributes} className={css(styles.added)}>
            {children}
          </span>
        );
      case "removed":
        return (
          <s {...attributes} className={css(styles.removed)}>
            {children}
          </s>
        );
      case "link":
        let url = mark.data.get("url");
        let isUrl = mark.data.get("isUrl");
        if (isUrl) {
          return (
            <a
              {...attributes}
              href={children}
              target={"_blank"}
              rel="noreferrer noopener"
            >
              {children}
            </a>
          );
        }
        return (
          <a
            {...attributes}
            href={url}
            target={"_blank"}
            rel="noreferrer noopener"
          >
            {children}
          </a>
        );
      case "line":
        return;
      default:
        return;
    }
  };

  const getUrlParameter = (name, url) => {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(url);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  const rules = [
    {
      serialize: renderBlock,
    },
    {
      serialize: renderMark,
    },
  ];

  const html = new Html({
    rules,
    parseHtml: null,
  });

  return value && html.serialize(value); // hmtl
}

export function convertToEditorToHTML(text) {
  if (!text) {
    return null;
  }
  if (isQuillDelta(text)) {
    return text;
  }

  if (typeof text === "string") {
    return convertEditorValueToHtml(Plain.deserialize(text));
  }

  return undefined;
}

export function isQuillDelta(value) {
  if (typeof value === "object" && value !== null) {
    if (value.hasOwnProperty("ops")) {
      return true;
    }
  } else {
    return false;
  }
}

export function convertToEditorValue(text) {
  if (isQuillDelta(text)) {
    return text;
  }

  if (typeof text === "string") {
    return Plain.deserialize(text);
  }

  if (text.hasOwnProperty("object")) {
    const htmlStr = convertEditorValueToHtml(text);
    return htmlStr;
  }

  return undefined;
}

export function convertDeltaToText(delta) {
  return QuillToPlaintext(delta);
}

export function getSummaryText(summary) {
  if (summary.summary) {
    if (summary.summary_plain_text) {
      return summary.summary_plain_text;
    }
    if (isQuillDelta(summary.summary)) {
      return convertDeltaToText(summary.summary);
    }
    return convertToEditorValue(summary.summary).document.text
      ? convertToEditorValue(summary.summary).document.text
      : "";
  } else {
    return "";
  }
}
