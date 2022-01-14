import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import { ReactElement, ReactNode } from "react";
import AuthorFacePile from "../shared/AuthorFacePile";
import colors, { genericCardColors } from "~/config/themes/colors";
import Image from "next/image";

type Props = {
  hub: any;
  hubSubscribeButton?: ReactNode | null;
  isHomePage: Boolean;
  mainHeaderText: string;
};

export default function FeedInfoCard({
  hub,
  hubSubscribeButton,
  isHomePage,
  mainHeaderText,
}: Props): ReactElement<"div"> | null {
  if (!window) {
    return null;
  }

  if (isHomePage || isEmpty(hub)) {
    return <h1 className={css(styles.title) + " clamp2"}>{mainHeaderText}</h1>;
  }

  const {
    description,
    editor_permission_groups = [],
    hub_image: hubImage,
    subscriber_count: subCount,
  } = hub;
  const editorProfiles = editor_permission_groups.map(
    (editor_group: any): any => editor_group?.user?.author_profile
  );

  return (
    <div className={css(styles.feedInfoCard)}>
      <div className={css(styles.detailRow)}>
        <div>
          <Image
            className={css(styles.hubImage)}
            height={68}
            hidden={false}
            layout="fixed"
            objectFit="cover"
            src={hubImage ?? "/static/background/hub-placeholder.svg"}
            width={68}
          />
        </div>
        <div className={css(styles.titleContainer)}>
          <h1 className={css(styles.title) + " clamp2"}>{mainHeaderText}</h1>
          <div className={css(styles.subscribeContainer)}>
            {nullthrows(hubSubscribeButton)}
          </div>
        </div>
      </div>
      <div className={css(styles.bodyContainer)}>
        <div className={css(styles.detailRow)}>
          <div className={css(styles.detailRowLabel)}>
            <FontAwesomeIcon
              color={colors.LIGHT_GREY_TEXT}
              icon={faUser}
              style={{
                marginRight: 8,
                width: "16px",
              }}
            />
            <span style={{ fontWeight: 500, marginRight: 8 }}>{"Members"}</span>
            <span style={{ color: colors.TEXT_GREY(1) }}>{subCount}</span>
          </div>
        </div>
        {!isEmpty(editorProfiles) && (
          <div className={css(styles.detailRow)}>
            <div className={css(styles.detailRowLabel)}>
              <Image
                height={20}
                src="/static/icons/editor-star.png"
                width={20}
                layout="fixed"
              />
              <span
                style={{
                  fontWeight: 500,
                  margin: "0px 8px 0px 5px",
                }}
              >{`Editor${editorProfiles.length > 1 ? "s" : ""} `}</span>
            </div>
            <AuthorFacePile
              authorProfiles={editorProfiles}
              horizontal
              imgSize={22}
              labelSpacing={6}
              withAuthorName
            />
          </div>
        )}
        <div className={css(styles.detailRow)}>
          {isEmpty(description) ? null : description}
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  feedInfoCard: {
    backgroundColor: "#fff",
    border: `1px solid ${genericCardColors.BORDER}`,
    borderRadius: 4,
    display: "flex",
    flexDirection: "column",
    padding: 16,
  },
  hubImage: {
    borderRadius: 4,
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
    margin: "8px",
  },
  detailRowLabel: {
    alignItems: "center",
    display: "flex",
    marginRight: 8,
  },
  subscribeContainer: {
    marginLeft: 20,
    minWidth: 100,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      minWidth: 70,
    }
  },
  title: {
    fontSize: 30,
    fontWeight: 500,
    textOverflow: "ellipsis",
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      fontSize: 30,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 24,
    },
    [`@media only screen and (max-width: ${breakpoints.xxxsmall.str})`]: {
      fontSize: 20,
    },
  },
  titleContainer: {
    alignItems: "center",
    display: "flex",
    marginLeft: 20,
    width: "100%",
  },
});
