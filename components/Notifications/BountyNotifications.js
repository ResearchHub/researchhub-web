import { Fragment, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Router from "next/router";
import Link from "next/link";
import Ripples from "react-ripples";

// Component
import {
  ExternalLink,
  HyperLink,
  TimeStamp,
  ModeratorDecisionTag,
  PlainText,
  Bold,
} from "./NotificationHelpers";

// Config
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { doesNotExist, truncateText } from "~/config/utils";

const ModeratorBounty = (props) => {
  const { data, notification, markAsRead, closeMenu } = props;
  const {
    type,
    created_by,
    created_date,
    plain_text,
    paper_id,
    paper_official_title,
    slug,
    bounty_amount,
    bounty_approved,
  } = notification;

  const author = created_by.author_profile;
  const authorLink = {
    href: "/user/[authorId]/[tabName]",
    as: `/user/${author.id}/contributions`,
  };
  const paperLink = {
    href: "/paper/[paperId]/[paperName]",
    as: `/paper/${paper_id}/${slug}`,
  };
  const sectionLink = {
    href: "/paper/[paperId]/[paperName]",
    as: `${paperLink}${type === "summary" ? "#summary" : "#takeaways"}`,
  };
  const onClick = (e) => {
    e.stopPropagation();
    markAsRead(data);
    closeMenu();
  };

  return (
    <Fragment>
      {"Approve "}
      <HyperLink
        link={authorLink}
        onClick={onClick}
        style={styles.username}
        text={`${author.first_name} ${author.last_name}'s`}
      />
      <HyperLink
        link={sectionLink}
        onClick={onClick}
        style={styles.link}
        text={type === "bulletpoint" ? "key takeaway," : "summary,"}
      />
      <PlainText text={plain_text} />
      {" in "}
      <HyperLink
        link={paperLink}
        onClick={onClick}
        style={styles.paper}
        dataTip={paper_official_title}
        text={truncateText(paper_official_title)}
      />
      {"for "}
      <Bold text={`${bounty_amount} RSC? `} />
      <TimeStamp date={created_date} />
      {!doesNotExist(bounty_approved) && (
        <ModeratorDecisionTag approved={bounty_approved} />
      )}
    </Fragment>
  );
};

const ContributorBounty = (props) => {
  const { data, notification, markAsRead, closeMenu } = props;
  const {
    type,
    created_date,
    paper_id,
    paper_official_title,
    slug,
    bounty_amount,
    bounty_approval,
  } = notification;

  const paperLink = {
    href: "/paper/[paperId]/[paperName]",
    as: `/paper/${paper_id}/${slug}`,
  };
  const sectionLink = {
    href: "/paper/[paperId]/[paperName]",
    as: `${paperLink}${type === "summary" ? "#summary" : "#takeaways"}`,
  };

  const onClick = (e) => {
    e.stopPropagation();
    markAsRead(data);
    closeMenu();
  };

  const renderGuidelines = () => {
    if (type === "summary") {
      return (
        <Fragment>
          {" Please visit our "}
          <ExternalLink
            style={styles.link}
            href={
              "https://www.notion.so/ResearchHub-Summary-Guidelines-7ebde718a6754bc894a2aa0c61721ae2"
            }
            text={"Summary Submission Guidelines"}
          />
          {" and try again."}
        </Fragment>
      );
    }
  };

  if (bounty_approval) {
    return (
      <Fragment>
        {"Congrats! "}
        {icons.partyPopper()}
        {" Your "}
        <HyperLink
          link={sectionLink}
          onClick={onClick}
          style={styles.link}
          text={type === "bulletpoint" ? "key takeaway" : "summary"}
        />
        {"in "}
        <HyperLink
          link={paperLink}
          onClick={onClick}
          style={styles.paper}
          dataTip={paper_official_title}
          text={truncateText(paper_official_title)}
        />
        {"has been approved for "}
        <Bold text={`${bounty_amount} RSC. `} />
        <TimeStamp date={created_date} />
        <ModeratorDecisionTag approved={true} />
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        {"The bounty reward"}
        <Bold text={` (${bounty_amount} RSC) `} />
        {"for your "}
        <HyperLink
          link={sectionLink}
          onClick={onClick}
          style={styles.link}
          text={type === "bulletpoint" ? "key takeaway" : "summary"}
        />
        {"in "}
        <HyperLink
          link={paperLink}
          onClick={onClick}
          style={styles.paper}
          dataTip={paper_official_title}
          text={truncateText(paper_official_title)}
        />
        {"has been denied by a moderator."}
        {renderGuidelines()}
        <TimeStamp date={created_date} />
        <ModeratorDecisionTag approved={false} />
      </Fragment>
    );
  }
};

const styles = StyleSheet.create({
  username: {
    color: "#000",
    textDecoration: "none",
    fontWeight: "bold",
    cursor: "pointer",
    paddingRight: 4,
    ":hover": {
      color: colors.BLUE(),
    },
  },
  link: {
    color: colors.BLUE(),
    cursor: "pointer",
    textDecoration: "none",
    paddingRight: 4,
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
});

export { ModeratorBounty, ContributorBounty };
