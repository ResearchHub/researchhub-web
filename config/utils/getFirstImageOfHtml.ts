import ReactHtmlParser from "react-html-parser";

export function firstImageFromHtml(text: string | TrustedHTML): string | null {
  const elements = ReactHtmlParser(text);
  for (const element of elements) {
    if (element?.type === "figure") {
      return element.props.children[0].props.src;
    }
  }
  return null;
}
