import { Hub } from "~/config/types/hub";
import camelCase from "lodash/camelCase";

type Args = {
  isBountyCreator: boolean;
  hubs?: Hub[];
  bountyAmount?: number;
  bountyText?: string;
};

const buildTwitterUrl = ({
  isBountyCreator,
  bountyText,
  bountyAmount,
  hubs = [],
}: Args) => {
  const baseTwitterUrl =
    "https://twitter.com/intent/tweet?utm_campaign=twitter_bounty";
  if (!(bountyText && bountyAmount)) {
    return baseTwitterUrl;
  }

  const hubsStr = (hubs || []).map((h) => camelCase(h.name)).join(",");

  let twitterPreText: string;
  if (isBountyCreator) {
    twitterPreText = `I created a ${bountyAmount} RSC bounty on @researchhub for solutions to:`;
  } else {
    twitterPreText = `Check out this ${bountyAmount} RSC bounty on @researchhub:`;
  }

  const link = process.browser
    ? window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname
    : "";

  const twitterBountyPreview = `\n\n"${bountyText.slice(
    0,
    249 - twitterPreText.length - link.length
  )}"\n\n${link}?utm_campaign=twitter_bounty`;

  return `${baseTwitterUrl}&text=${encodeURI(
    twitterPreText + twitterBountyPreview
  )}&hashtags=${hubsStr}`;
};

export default buildTwitterUrl;
