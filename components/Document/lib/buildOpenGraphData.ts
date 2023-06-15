import dayjs from "dayjs";
import { GenericDocument, isPaper } from "./types";

export type OpenGraphData = {
  meta: any;
  graph: any;
};

export default function buildOpenGraphData({
  document,
  description,
  url,
}: {
  document: GenericDocument;
  description: string;
  url: string;
}): OpenGraphData {
  const graph = {
    "@context": "https://schema.org/",
    "@graph": [
      {
        "@type": "Article",
        "headline": document.title,
        "name": document.title,
        "image": document?.images[0]?.url,
        "datePublished": dayjs(document.createdDate).format("YYYY-MM-DD"),
        "author": document.authors.map((author) => ({
          "@type": "Person",
          "name": author.firstName + " " + author.lastName,
        })),
        "publisher": {
          "@type": "Organization",
          "name": isPaper(document) ? document.journal : "ResearchHub",
        },
      },
    ],
  };

  const meta = {
    title: document.title,
    keywords: document.title + " researchhub " + " research hub ",
    description,
    datePublished: document.createdDate,
    url: "https://" + process.env.HOST + url,
  };

  if (document.images.length > 0) {
    meta["socialImageUrl"] = document.images[0]?.url;
  }

  return { meta, graph };
}
