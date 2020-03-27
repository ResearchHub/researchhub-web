import { useEffect, useState } from "react";
import Head from "next/head";

export default (props) => {
  const title = props.title || "ResearchHub | Open Science Community";
  const description =
    props.description ||
    "We're a community seeking to improve prioritization, collaboration, reproducibility, and funding of scientific research. Discuss and discover academic research on Research Hub";
  const url = props.url || ""; // (window && window.location);
  const socialImage = props.socialImage || "url of image from s3";

  return (
    <Head>
      <title>{title}</title>
      <meta key="description" name="description" content={description} />
      {/* Social meta tags */}
      <meta property="og:description" content={description} />
      {/* Image dimensions: minimum 200x200; recommended 1500x1500 */}
      {/* <meta property="og:image" content={socialImage} /> */}
      <meta property="og:image" content="https://ogi.sh?title=Hello%20World" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:secure_url" content={socialImage} />
      <meta property="og:image:type" content={"image/png"} />
      <meta property="og:image:width" content={"1500"} />
      <meta property="og:image:height" content={"1500"} />
      <meta property="og:title" content={title} />
      <meta property="og:type" content={"article"} />
      <meta property="og:site_name" content={"ResearchHub"} />
      <meta property="og:url" content={url} />
      {/* Twitter meta tags */}
      <meta property="twitter:card" content={"summary_large_image"} />
      <meta property="twitter:description" value={description} />
      <meta property="twitter:image" content={socialImage} />
      {/* Left */}
      <meta property="twitter:label1" value={title} />
      <meta property="twitter:data1" value={title} />
      {/* Right */}
      <meta property="twitter:label2" value={title} />
      <meta property="twitter:data2" value={title} />
      <meta property="twitter:title" value={title} />
      <meta property="twitter:url" value={url} />
      {props.children}
    </Head>
  );
};
