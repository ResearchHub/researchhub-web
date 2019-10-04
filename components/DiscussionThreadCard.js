import { css, StyleSheet } from "aphrodite";
import Link from "next/link";
import PropTypes from "prop-types";
import { Fragment } from "react";

import DiscussionCard from "./DiscussionCard";
import DiscussionPostMetadata from "./DiscussionPostMetadata";
import DiscussionThreadActionBar from "~/components/DiscussionThreadActionBar";
import VoteWidget from "./VoteWidget";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { getNestedValue } from "~/config/utils";

const DYNAMIC_HREF = "/paper/[paperId]/[tabName]/[discussionThreadId]";

const DiscussionThreadCard = (props) => {
  const { path } = props;

  const data = getNestedValue(props, ["data"]);

  let date = "";
  let title = "";
  let username = "";
  let commentCount = "";

  if (data) {
    commentCount = data.commentCount;
    date = data.createdDate;
    title = data.title;
    username = createUsername(data);
  }

  return (
    <Link href={DYNAMIC_HREF} as={path}>
      <a className={css(styles.discussionContainer)}>
        <DiscussionCard
          top={
            <Fragment>
              <VoteWidget score={5} fontSize={"16px"} width={"44px"} />
              <DiscussionPostMetadata username={username} date={date} />
              <ReadButton threadPath={path} />
            </Fragment>
          }
          info={<Title text={title} />}
          action={<DiscussionThreadActionBar count={commentCount} />}
        />
      </a>
    </Link>
  );
};

function createUsername({ createdBy }) {
  const { firstName, lastName } = createdBy;
  return `${firstName} ${lastName}`;
}

DiscussionThreadCard.propTypes = {
  date: PropTypes.object,
  path: PropTypes.string,
  title: PropTypes.string,
  username: PropTypes.string,
};

const Title = (props) => {
  const title = formatTitle(props.text);

  return <div className={css(styles.title)}>{title}</div>;
};

function formatTitle(title) {
  const limit = 80;
  if (title.length > limit) {
    return title.substring(0, limit) + "...";
  }
  return title;
}

const ReadButton = (props) => {
  const { threadPath } = props;
  return (
    <Link href={DYNAMIC_HREF} as={threadPath}>
      <a className={css(styles.readContainer)}>
        Read <span className={css(styles.readArrow)}>{icons.chevronRight}</span>
      </a>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {},
  topContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "12px",
    whiteSpace: "nowrap",
  },
  timestampDivider: {
    padding: "0px 10px",
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    color: colors.GREY(1),
    fontSize: 14,
  },
  discussionContainer: {
    textDecoration: "none",
  },
  readContainer: {
    border: "solid 1px",
    borderColor: colors.BLUE(1),
    color: colors.BLUE(1),
    borderRadius: "2px",
    height: "30px",
    width: "90px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    fontWeight: "lighter",
    boxSizing: "border-box",
    textDecoration: "none",
  },
  readArrow: {
    fontSize: 10,
    marginLeft: 9,
  },
  title: {
    fontSize: 22,
    paddingBottom: 10,
    color: colors.BLACK(1),
  },
});

export default DiscussionThreadCard;
