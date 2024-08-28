import { connect, useDispatch } from "react-redux";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { useState } from "react";
import { HyperLink, TimeStamp } from "./NotificationHelpers";
import { NotificationActions } from "~/redux/notification";
import { StyleSheet, css } from "aphrodite";
import AuthorAvatar from "../AuthorAvatar";
import colors from "../../config/themes/colors";
import Ripples from "react-ripples";
import Router from "next/router";
import VerifiedBadge from "../Verification/VerifiedBadge";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCirclePlus,
  faMemoCircleCheck,
} from "@fortawesome/pro-solid-svg-icons";
import { truncateText } from "~/config/utils/string";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import useCurrentUser from "~/config/hooks/useCurrentUser";
import { RSCIcon } from "~/config/themes/icons";
import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import ContentBadge from "~/components/ContentBadge";
import numeral from "numeral";
import HubTag from "../Hubs/HubTag";
import { parseHub } from "~/config/types/hub";
import { parseUnifiedDocument } from "~/config/types/root_types";

const NotificationEntry = (props) => {
  const { notification, data } = props;
  const [isRead, toggleRead] = useState(data.read);
  const currentUser = useCurrentUser();
  const dispatch = useDispatch();

  if (isNullOrUndefined(notification) || !currentUser) {
    // if no notification object is passed, dont render anything
    return null;
  }

  const markAsRead = async (data) => {
    if (isRead) {
      return;
    }
    await dispatch(NotificationActions.markAsRead(data.id));
    toggleRead(true);
    props.closeMenu();
  };

  const handleNavigation = (e) => {
    e && e.stopPropagation();
    const { navigation_url } = notification;

    if (navigation_url == null) {
      return;
    }

    Router.push(navigation_url).then(() => {
      markAsRead(props.data);
      props.closeMenu(); // added as a fallback
    });
  };

  const formatStyles = (customStyles) => {
    if (customStyles != null) {
      const parsedStyles = JSON.parse(customStyles);
      const formatedStyles = parsedStyles.map((key) => {
        switch (key) {
          case "bold":
            return styles.bold;
          case "italic":
            return styles.italic;
          case "flex":
            return styles.flex;
          case "link":
            return styles.link;
          case "rsc_color":
            return styles.rscColor;
          default:
            return null;
        }
      });
      return formatedStyles;
    }
    return [];
  };

  const formatBody = (notification, data) => {
    try {
      const { notification_type } = data;
      const { body } = notification;
      const onClick = (e) => {
        e.stopPropagation();
        markAsRead(data);
        props.closeMenu();
      };

      if (notification_type === "IDENTITY_VERIFICATION_UPDATED") {
        return "Congratulations! Your account has been verified by the ResearchHub team. ";
      } else if (notification_type === "PAPER_CLAIM_PAYOUT") {
        return "Congratulations! Your claim has been approved and RSC has been awarded to your account.";
      } else if (notification_type === "BOUNTY_FOR_YOU") {
        const rawHub = JSON.parse(data.extra.hub_details);
        const hub = parseHub(rawHub);

        let unifiedDocument = null;
        let url = null;

        // When websocket fires, it does not include unified_document property.
        // This property seems to only be included as part of the notification endpoint.
        if (data.unified_document) {
          unifiedDocument = parseUnifiedDocument(data.unified_document);
          url = getUrlToUniDoc(unifiedDocument);
        }

        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              A new bounty earning opportunity is recommended for you based on
              your expertise {` `}
              {unifiedDocument?.document && (
                <>
                  on{" "}
                  <HyperLink
                    link={{ href: url + "/bounties" }}
                    onClick={onClick}
                    style={styles.link}
                    text={unifiedDocument.document?.title}
                  />
                </>
              )}
            </div>
            <span>
              <div
                style={{
                  display: "flex",
                  columnGap: 5,
                  alignItems: "center",
                  marginTop: 6,
                  marginBottom: 6,
                }}
              >
                <HubTag hub={hub} />
                <ContentBadge
                  badgeOverride={styles.badge}
                  contentType="bounty"
                  bountyAmount={data.extra.amount}
                  label={
                    <div style={{ display: "flex" }}>
                      <div style={{ flex: 1 }} className={css(styles.mobile)}>
                        {numeral(
                          formatBountyAmount({
                            amount: data.extra.amount,
                          })
                        ).format("0,0a")}{" "}
                        RSC
                      </div>
                    </div>
                  }
                />
              </div>
            </span>
          </div>
        );
      } else if (notification_type === "PUBLICATIONS_ADDED") {
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>Publications were added to your profile. {` `}</span>
            <HyperLink
              link={{ href: currentUser.authorProfile.url + "/publications" }}
              onClick={onClick}
              style={styles.link}
              text={"View publications"}
            />
          </div>
        );
      } else if (body == null) {
        return null;
      }

      return (
        <div>
          {body.map((element, i) => {
            const value = truncateText(element.value, 100);

            const extraStyles = formatStyles(element.extra);
            switch (element.type) {
              case "link":
                const link = { href: element.link };
                return (
                  <HyperLink
                    key={i}
                    link={link}
                    onClick={onClick}
                    style={extraStyles}
                    text={value}
                  />
                );
              case "text":
                return (
                  <span key={i} className={css(...extraStyles)}>
                    {" "}
                    {value}{" "}
                  </span>
                );
              case "break":
                return <br key={i}></br>;
              default:
                return <span key={i}>ERROR</span>;
            }
          })}
        </div>
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const renderMessage = () => {
    const { notification, data } = props;
    const { body, created_date } = notification;
    const timeStamp = <TimeStamp date={created_date} />;
    const notificationType = data?.notification_type;
    const formatedBody = formatBody(notification, data);

    return (
      <div className={css(styles.message)}>
        {formatedBody}
        {timeStamp}
      </div>
    );
  };

  const message = renderMessage();
  const notificationType = data?.notification_type;

  return (
    <Ripples
      className={css(styles.container, isRead && styles.read)}
      onClick={handleNavigation}
    >
      <div className={css(styles.authorAvatar)}>
        {notificationType === "IDENTITY_VERIFICATION_UPDATED" ? (
          <div style={{ marginLeft: -3 }}>
            <VerifiedBadge showTooltipOnHover={false} height={40} width={40} />
          </div>
        ) : notificationType === "BOUNTY_FOR_YOU" ? (
          <div style={{ marginLeft: -3 }}>
            <ResearchCoinIcon
              version={2}
              height={40}
              width={40}
              color={colors.ORANGE_DARK2()}
            />
          </div>
        ) : notificationType === "PUBLICATIONS_ADDED" ? (
          <FontAwesomeIcon
            icon={faFileCirclePlus}
            style={{ color: colors.NEW_BLUE() }}
            fontSize={30}
          />
        ) : notificationType === "PAPER_CLAIM_PAYOUT" ? (
          <ResearchCoinIcon
            version={4}
            height={35}
            width={35}
            color={colors.NEW_GREEN()}
          />
        ) : (
          <AuthorAvatar
            size={35}
            author={notification?.created_by?.author_profile ?? ""}
          />
        )}
      </div>
      <div className={css(styles.body)}>{message}</div>
    </Ripples>
  );
};

const styles = StyleSheet.create({
  badge: {
    padding: "4px 12px",
    fontWeight: 400,
    marginRight: 10,
    borderRadius: "50px",
    fontSize: 13,
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  flex: {
    display: "flex",
  },
  rscColor: {
    color: colors.ORANGE_DARK2(),
  },
  container: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    boxSizing: "border-box",
    padding: 20,
    borderBottom: "1px solid #dddfe2",
    backgroundColor: "#EDf2FA",
    position: "relative",
    ":hover": {
      backgroundColor: "#EDf2FA",
    },
  },
  read: {
    backgroundColor: "#fff",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  authorAvatar: {
    marginRight: 15,
  },
  body: {},
  message: {
    fontSize: 13,
    lineHeight: 1.5,
    width: "100%",
    wordBreak: "break-word",
  },
  atag: {
    color: "unset",
    textDecoration: "unset",
  },
  username: {
    color: "#000",
    textDecoration: "none",
    // fontWeight: "bold",
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  link: {
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    textDecoration: "none",
    ":hover": {
      textDecoration: "underline",
    },
  },
  paper: {
    cursor: "pointer",
    color: colors.BLUE(),
    cursor: "pointer",
    paddingRight: 4,
    textDecoration: "unset",
    wordBreak: "break-word",
    ":hover": {
      textDecoration: "underline",
    },
    maxWidth: 5,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  rsc: {
    fontWeight: 500,
  },
  timestamp: {
    fontWeight: "normal",
    color: "#918f9b",
    fontSize: 12,
    fontFamily: "Roboto",
  },
  timestampDivider: {
    fontSize: 18,
    paddingRight: 4,
    color: colors.GREY(1),
    lineHeight: "100%",
    verticalAlign: "middle",
  },
  stripeLogo: {
    position: "absolute",
    height: 20,
    right: 0,
    bottom: 0,
  },
  italics: {
    fontStyle: "italic",
  },
  row: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    height: 25,
    width: "100%",
  },
  buttonApprove: {
    height: 25,
    width: "100%",
    marginLeft: 10,
  },
  buttonDeny: {
    height: 25,
    width: "100%",
    backgroundColor: colors.RED(0.8),
    ":hover": {
      backgroundColor: colors.RED(),
    },
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 400,
  },
  tagApproved: {
    fontSize: 8,
    color: "#FFF",
    padding: "3px 8px",
    background: colors.BLUE(),
    borderRadius: 4,
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 1,
    marginLeft: 8,
  },
  tagDenied: {
    fontSize: 8,
    color: "#FFF",
    padding: "3px 8px",
    background: colors.RED(),
    borderRadius: 4,
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 1,
    marginLeft: 8,
  },
  iconCongrats: {
    height: 15,
  },
});

const mapDispatchToProps = {
  updateNotification: NotificationActions.updateNotification,
};

export default connect(null, mapDispatchToProps)(NotificationEntry);
