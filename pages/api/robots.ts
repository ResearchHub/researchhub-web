import { NextApiRequest, NextApiResponse } from "next";

const robotsTxtAllowCrawling = `User-agent: *
Allow: /`;
const robotsTxtDisallowCrawling = `User-agent: *
Disallow: /`;

function handler(_: NextApiRequest, res: NextApiResponse): void {
  const isProduction = process.env.NODE_ENV === "production";
  const robotsTxt = isProduction
    ? robotsTxtAllowCrawling
    : robotsTxtDisallowCrawling;

  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(robotsTxt);
}

export default handler;
