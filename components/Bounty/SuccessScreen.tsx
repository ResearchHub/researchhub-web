import { css, StyleSheet } from "aphrodite";
import Image from "next/image";
import { ReactElement } from "react";
import icons from "~/config/themes/icons";

type Props = {
  bountyAmount: number;
  bountyText: string;
  postId: number;
  postSlug: string;
};

function SuccessScreen({
  bountyAmount,
  bountyText,
  postId,
  postSlug,
}: Props): ReactElement {
  const twitterPreText = `Help me with my bounty on ResearchHub worth ${bountyAmount} RSC!`;

  const link = process.browser
    ? window.location.protocol +
      "//" +
      window.location.hostname +
      `/post/${postId}/${postSlug}`
    : "";

  const twitterBountyPreview = `\n\n"${bountyText.slice(
    0,
    249 - twitterPreText.length - link.length
  )}"\n\n${link}`;

  return (
    <div className={css(styles.container)}>
      <Image src="/static/icons/success2.png" width={62} height={62} />
      <h2 className={css(styles.title)}>Your Bounty has been started!</h2>
      <p className={css(styles.description)}>
        Share this bounty to get a quicker response.
      </p>
      <div className={css(styles.shareRow)}>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURI(
            twitterPreText + twitterBountyPreview
          )}`}
          data-size="large"
          target="_blank"
          className={css(styles.link)}
        >
          <div className={css(styles.twitter)}>
            {icons.twitter}
            <span className={css(styles.twitterText)}>Share on Twitter</span>
          </div>
        </a>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    // padding: 40,
    // width: "100%",
    width: 500,
    "@media only screen and (max-width: 767px)": {
      width: "unset",
    },
  },
  title: {
    marginTop: 24,
    fontSize: 26,
    fontWeight: 500,
  },
  description: {
    lineHeight: "20px",
    marginTop: 16,
  },
  twitter: {
    background: "#3971FF",
    width: 200,
    height: 50,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  twitterText: {
    marginLeft: 7,
    fontWeight: 500,
  },
  link: {
    textDecoration: "none",
  },
  shareRow: {
    display: "flex",
    marginTop: 16,
  },
});

export default SuccessScreen;
