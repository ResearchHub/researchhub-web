import { captureEvent } from "~/config/utils/events";
import sanitizeHtml from "sanitize-html";

interface Props {
  s3Url: string;
  cleanIntroEmptyContent?: boolean;
}

const fetchPostFromS3 = async ({ s3Url, cleanIntroEmptyContent = true }: Props): Promise<any> => {
  try {
    const response = await fetch(s3Url);
    if (!response.ok) {
      captureEvent({
        data: { s3Url, status: response.status },
        msg: `Error fetching post from S3`,
      });
    }
    let _html = await response.text()
    _html = sanitizeHtml(_html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "a", "abbr", "address", "article", "aside", "b", "bdi", "bdo",
        "blockquote", "br", "caption", "cite", "code", "col", "colgroup",
        "data", "dd", "dfn", "div", "dl", "dt", "em", "figcaption", "figure",
        "h1", "h2", "h3", "h4", "h5", "h6", "hgroup", "hr", "i", "img", "kbd",
        "li", "main", "mark", "ol", "p", "pre", "q", "rb", "rp", "rt", "rtc",
        "ruby", "s", "samp", "section", "small", "source", "span", "strong",
        "sub", "sup", "table", "tbody", "td", "tfoot", "th", "thead", "time",
        "tr", "u", "ul", "var", "video", "wbr"
      ]),
      allowedAttributes: {
        a: ["href", "name", "target"],
        img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
        video: [
          "autoplay",
          "controls",
          "height",
          "loop",
          "muted",
          "src",
          "type",
          "width",
        ],
        source: ["src", "type"],
        '*': ["class", "style"],
      },
    });

    if (cleanIntroEmptyContent) {
      // CK Editor saves H1 tags on S3.
      // We want to remove this because we are already outputting an H1 tag in DocumentHeader
      const htmlWithoutH1 = _html.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "");
      // Because we remove the <h1/> we will face a bunch of empty space at the top of the post. Let's remove that too
      const htmlWithoutIntroWhitespace = htmlWithoutH1.replace(
        /<p>((<br\/?>)*|\s*|(&nbsp;)*)*(.*?<\/p>)/,
        "<p>$4"
      );

      // The following appear to be common "empty" content that pushes main content down in CK editor
      const cleanHtml = htmlWithoutIntroWhitespace.replace(
        /^(<p>\s*<\/p>|<p>&nbsp;<\/p>|<h2>&nbsp;<\/h2>|<h3>&nbsp;<\/h3>|<h1>&nbsp;<\/h1>|<h2>\s*<\/h2>|<h3>\s*<\/h3>|<h1>\s*<\/h1>|\s*)*/gi,
        ""
      );

      _html = cleanHtml;
    }

    return _html;
  } catch (error) {
    captureEvent({
      data: { s3Url, error },
      msg: `Error fetching post from S3`,
    });
  }
};

export default fetchPostFromS3;
