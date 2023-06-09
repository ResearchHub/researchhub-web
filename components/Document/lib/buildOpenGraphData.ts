import { GenericDocument } from "./types";

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
        "@id": document.unifiedDocument.id,
        name: document.title,
        datePublished: document.createdDate,
        author: document.authors.map((author) => ({
          givenName: author.firstName,
          familyName: author.lastName,
          "@type": "Person",
        })),
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
