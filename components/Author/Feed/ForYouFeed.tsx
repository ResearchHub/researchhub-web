import React, { ReactElement, useEffect, useState } from "react";
import fetchForYouFeedApi from "./api/fetchForYouFeedApi";
import { StyleSheet, css } from "aphrodite";
import ForYouFeedCard from "./ForYouFeedCard";
import { useRouter } from "next/router";

export type ForYouFeedProps = {};

const ForYouFeed = ({}: ForYouFeedProps): ReactElement => {
  const router = useRouter();
  const { userId } = router.query;

  const [feedItems, setFeedItems] = useState<any[]>([]); // TODO: type this
  const [fetchStatus, setFetchStatus] = useState<
    "idle" | "pending" | "fulfilled" | "rejected"
  >("idle");

  useEffect(() => {
    setFetchStatus("pending");
    fetchForYouFeedApi({
      userId: userId as string,
      onSuccess: (items) => {
        setFeedItems(items.filter((item) => item !== null));
        setFetchStatus("fulfilled");
      },
      onError: (error) => {
        console.log('error', error)
        setFetchStatus("rejected");
      },
    });
  }, []);

  // TODO: Add loading state
  return (
    <div className={css(styles.feedContainer)}>
      <h2>Personalized content (beta)</h2>
      {feedItems.map((item) => (
        <>
          <ForYouFeedCard item={item} />
          <div className={css(styles.divider)} />
        </>
      ))}
    </div>
  );
};

const styles = StyleSheet.create({
  feedContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "0 28px",
    width: "800px",
    margin: "0 auto",
  },
  divider: {
    margin: "0 auto",
    display: "flex",
    borderLeft: "unset",
    borderBottom: `1px solid #E9EAEF`,
    width: "100%",
  },
});

export default ForYouFeed;
