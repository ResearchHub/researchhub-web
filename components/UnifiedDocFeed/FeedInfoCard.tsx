import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import { ReactElement, ReactNode, useState } from "react";
import AuthorFacePile from "../shared/AuthorFacePile";
import colors, { genericCardColors } from "~/config/themes/colors";
import Image from "next/image";
import {
  getCurrMediaWidth,
  useEffectOnScreenResize,
} from "~/config/utils/useEffectOnScreenResize";

type Props = {
  hub: any;
  hubSubscribeButton?: ReactNode | null;
  isHomePage: Boolean;
  mainHeaderText: string;
};

const EDITOR_HORIZONTAL_VIEW_SIZE = breakpoints.xxsmall.int;

export default function FeedInfoCard({
  hub,
  hubSubscribeButton,
  isHomePage,
  mainHeaderText,
}: Props): ReactElement<"div"> | null {
  if (!window) {
    return null;
  }
  const [editorsHorizontalView, setEditorsHorizontalView] = useState<boolean>(
    getCurrMediaWidth() > EDITOR_HORIZONTAL_VIEW_SIZE
  );

  useEffectOnScreenResize({
    onResize: (newMediaWidth): void =>
      setEditorsHorizontalView(newMediaWidth > EDITOR_HORIZONTAL_VIEW_SIZE),
  });
  console.warn("editorsHorizontalView: ", editorsHorizontalView);
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
  const editorProfiless = [...editorProfiles, ...editorProfiles];
  return (
    <div className={css(styles.feedInfoCard)}>
      <Image
        height={64}
        layout="fixed"
        objectFit="cover"
        src={hubImage ?? "/static/background/hub-placeholder.svg"}
        width={68}
      />
      <div className={css(styles.bodyContainer)}>
        <div className={css(styles.titleContainer)}>
          <h1 className={css(styles.title) + " clamp2"}>{mainHeaderText}</h1>
          <div className={css(styles.subscribeContainer)}>
            {nullthrows(hubSubscribeButton)}
          </div>
        </div>
        <div className={css(styles.detailRow)}>
          <div className={css(styles.detailRowLabel)}>
            <FontAwesomeIcon
              color={colors.LIGHT_GREY_TEXT}
              icon={faUser}
              style={{
                marginRight: 14,
                width: "16px",
              }}
            />
            <span style={{ fontWeight: 500, marginRight: 8 }}>{"Users "}</span>
            <span style={{ color: colors.TEXT_GREY(1) }}>{subCount}</span>
          </div>
        </div>
        {!isEmpty(editorProfiles) && (
          <div
            className={css(styles.detailRow)}
            style={{
              flexDirection: !editorsHorizontalView ? "column" : "row",
              alignItems: !editorsHorizontalView ? "start" : "center",
            }}
          >
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
                  margin: "0 12px",
                }}
              >{`Editor${editorProfiles.length > 1 ? "s" : ""} `}</span>
            </div>
            <div
              style={{
                margin: !editorsHorizontalView ? "16px 0 0 32px" : 0,
              }}
            >
              <AuthorFacePile
                authorProfiles={editorProfiless}
                horizontal={editorsHorizontalView}
                imgSize={22}
                labelSpacing={6}
                loadOffset={1}
                withAuthorName
              />
            </div>
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
    padding: 16,
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 16,
    width: "100%",
  },
  detailRow: {
    alignItems: "center",
    display: "flex",
    fontSize: 16,
    margin: "8px 0",
    overflowX: "scroll",
    justifyContent: "flex-start",
  },
  detailRowLabel: {
    alignItems: "center",
    display: "flex",
    marginRight: 8,
  },
  subscribeContainer: {
    marginLeft: 16,
    minWidth: 100,
  },
  title: {
    color: colors.TEXT_DARKER_GREY,
    fontSize: 30,
    fontWeight: 400,
    margin: 0,
    padding: 0,
    textOverflow: "ellipsis",
    [`@media only screen and max-width: ${breakpoints.large.str}`]: {
      fontSize: 30,
    },
    [`@media only screen and max-width: ${breakpoints.small.str}`]: {
      display: "flex",
      fontSize: 25,
      justifyContent: "center",
      textAlign: "center",
      whiteSpace: "pre-wrap",
      wordBreak: "normal",
    },
    [`@media only screen and max-width: ${breakpoints.xxsmall.str}`]: {
      fontSize: 25,
    },
    [`@media only screen and max-width: ${breakpoints.xxxsmall.str}`]: {
      fontSize: 20,
    },
  },
  titleContainer: { display: "flex", width: "100%", marginBottom: 8 },
});
