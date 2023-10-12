import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import AuthorFacePile from "../shared/AuthorFacePile";
import colors, { genericCardColors } from "~/config/themes/colors";
import Image from "next/image";
import { parseHub } from "~/config/types/hub";
import { PaperIcon } from "~/config/themes/icons";
import { faComments } from "@fortawesome/pro-solid-svg-icons";
import Button from "../Form/Button";
import api, { generateApiUrl } from "~/config/api";
import { subscribeToHub, unsubscribeFromHub } from "~/config/fetch";
import { capitalize } from "~/config/utils/string";

type Props = {
  hub: any;
  hubSubscribeButton?: ReactNode | null;
  isHomePage: boolean;
  mainHeaderText: string;
};

export default function FeedInfoCard({
  hub,
  hubSubscribeButton,
  isHomePage,
  mainHeaderText,
}: Props): ReactElement<"div"> | null {
  const {
    description,
    editor_permission_groups = [],
    hub_image: hubImage,
    subscriber_count: subCount,
  } = hub ?? {};

  const [userIsSubscribed, setUserIsSubscribed] = useState(false);
  const [hubJoinHovered, setHubJoinedHovered] = useState(false);

  const editorProfiles = editor_permission_groups.map(
    (editor_group: any): any => editor_group?.user?.author_profile
  );
  const parsedHub = parseHub(hub);
  const numPapers = parsedHub.numDocs || 0;
  const numComments = parsedHub.numComments || 0;
  const formattedDescription = (description || "").replace(/\.$/, "");

  const getUserIsSubscribedToHub = async () => {
    const url = generateApiUrl(`hub/${hub.id}/check_subscribed`);
    const res = await fetch(url, api.GET_CONFIG());
    const json = await res.json();
    setUserIsSubscribed(json.is_subscribed);
  };

  useEffect(() => {
    setUserIsSubscribed(false);
    getUserIsSubscribedToHub();
  }, [hub]);

  const leaveOrJoinHub = () => {
    const SUBSCRIBE_API = userIsSubscribed
      ? unsubscribeFromHub
      : subscribeToHub;
    const hubName = hub.name && capitalize(hub.name);
    SUBSCRIBE_API({ hubId: hub.id }).then((_) =>
      userIsSubscribed ? setUserIsSubscribed(false) : setUserIsSubscribed(true)
    );
  };

  return (
    <div className={css(styles.feedInfoCard)}>
      <div className={css(styles.detailRow)}>
        <div className={css(styles.titleContainer)}>
          <h1 className={css(styles.title) + " clamp2"}>{mainHeaderText}</h1>
        </div>
        <div
          onMouseEnter={() => setHubJoinedHovered(true)}
          onMouseLeave={() => setHubJoinedHovered(false)}
        >
          <Button
            label={
              userIsSubscribed
                ? hubJoinHovered
                  ? "Leave Hub"
                  : "Joined"
                : "Join Hub"
            }
            customButtonStyle={[
              styles.joinHubButtonStyle,
              userIsSubscribed && hubJoinHovered && styles.leaveButtonStyle,
            ]}
            onClick={leaveOrJoinHub}
            isWhite
          />
        </div>
      </div>
      <div className={css(styles.bodyContainer)}>
        {formattedDescription?.length > 0 && (
          <div className={css(styles.description)}>{formattedDescription}.</div>
        )}
        {!isEmpty(editorProfiles) && (
          <div className={css(styles.detailRow, styles.editors)}>
            <div className={css(styles.detailRowLabel)}>
              <Image
                height={20}
                alt={"Editor Image"}
                src="/static/icons/editor-star.png"
                width={20}
                layout="fixed"
              />
              <span
                style={{
                  margin: "0px 0px 0px 5px",
                }}
              >{`Editor${editorProfiles.length > 1 ? "s" : ""}: `}</span>
            </div>
            <AuthorFacePile
              authorProfiles={[editorProfiles]}
              horizontal
              imgSize={20}
              fontSize={14}
              labelSpacing={6}
              withAuthorName
            />
          </div>
        )}
        <div className={css(styles.detailRow, styles.metadata)}>
          <div className={css(styles.dataPoint)}>
            {/* @ts-ignore */}
            <PaperIcon height={13} width={14} color="#918F9B" />
            <span>
              {numPapers === 1 ? `${numPapers} Paper` : `${numPapers} Papers`}
            </span>
          </div>
          <div className={css(styles.dataPoint)}>
            <FontAwesomeIcon
              icon={faComments}
              style={{ color: "#918F9B", fontSize: 12 }}
            />
            <span>
              {numComments === 1
                ? `${numComments} Discussion`
                : `${numComments} Discussions`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  metadata: {
    display: "flex",
    alignItems: "center",
    columnGap: "25px",
    color: "#545161",
    marginTop: 15,
  },
  editors: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    // columnGap: "25px",
    color: "#545161",
    marginTop: 15,
  },
  dataPoint: {
    fontSize: 14,
    fontWeight: 400,
    display: "flex",
    alignItems: "center",
    columnGap: "3px",
  },
  feedInfoCard: {
    backgroundColor: "#fff",
    borderRadius: 4,
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
  },
  hubImage: {
    borderRadius: 4,
    height: 68,
    width: 68,
    objectFit: "cover",
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  detailRow: {
    alignItems: "center",
    display: "flex",
    fontSize: 16,
    justifyContent: "flex-start",
    marginBottom: 16,
  },
  detailRowLabel: {
    alignItems: "center",
    display: "flex",
    marginRight: 8,
  },
  description: {
    fontSize: 15,
    "::first-letter": {
      textTransform: "uppercase",
    },
  },
  subscribeContainer: {
    marginLeft: 20,
    minWidth: 100,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      minWidth: 70,
    },
  },
  title: {
    fontSize: 30,
    marginBottom: 0,
    fontWeight: 500,
    textOverflow: "ellipsis",
  },
  titleContainer: {
    alignItems: "center",
    display: "flex",
    width: "100%",
    flex: 1,
  },
  joinHubButtonStyle: {
    marginLeft: "auto",
    ":hover": {
      opacity: 1,
      // borderColor: "red",
      // color: "red",
    },
  },
  leaveButtonStyle: {
    ":hover": {
      opacity: 1,
      // borderColor: "red",
      // color: "red",
    },
  },
});
