import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import PropTypes from "prop-types";

// Config
import colors from "~/config/themes/colors";
import { timeAgoStamp, truncateText } from "~/config/utils";

const HyperLink = (props) => {
  const { text, link, dataTip, onClick, style } = props;
  // link = { href, as }
  return (
    <Link {...link}>
      <a
        onClick={onClick && onClick}
        className={css(style && style)}
        data-tip={dataTip ? dataTip : null}
      >
        {text}
      </a>
    </Link>
  );
};

const TimeStamp = (props) => {
  const { date } = props;

  return (
    <span className={css(styles.timestamp)}>
      <span className={css(styles.timestampDivider)}>•</span>
      {timeAgoStamp(date)}
    </span>
  );
};

const ExternalLink = (props) => {
  const { href, style, text } = props;

  return (
    <a
      className={css(style && style)}
      href={href && href}
      target={"_blank"}
      rel="noreferrer noopener"
    >
      {text}
    </a>
  );
};

const ModeratorDecisionTag = (props) => {
  const { approved, style } = props;

  const classNames = [styles.tag, style && style];

  if (approved) {
    classNames.push(styles.approved);
  } else {
    classNames.push(styles.denied);
  }

  return (
    <span className={css(classNames)}>{approved ? "Approved" : "Denied"}</span>
  );
};

const PlainText = (props) => {
  const { style, text } = props;

  const classNames = [styles.italics, style && style];

  return <span className={css(classNames)}>{truncateText(text)}</span>;
};

const Bold = (props) => {
  const { style, text } = props;

  const classNames = [styles.bold, style && style];

  return <span className={css(classNames)}>{text}</span>;
};

const styles = StyleSheet.create({
  // TIMESTAMP
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
  // MODERATORDECISIONTAG
  tag: {
    fontSize: 8,
    color: "#FFF",
    padding: "3px 8px",
    borderRadius: 4,
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 1,
    marginLeft: 8,
  },
  approved: {
    background: colors.BLUE(),
  },
  denied: {
    background: colors.RED(),
  },
  // PLAINTEXT
  italics: {
    fontStyle: "italic",
  },
  // BOLD
  bold: {
    fontWeight: 500,
  },
});

ExternalLink.propTypes = {
  text: PropTypes.string,
  style: PropTypes.object,
  href: PropTypes.string,
};

HyperLink.propTypes = {
  text: PropTypes.string,
  link: PropTypes.object,
  onClick: PropTypes.func,
  style: PropTypes.object,
  dataTip: PropTypes.string,
};

TimeStamp.propTypes = {
  date: PropTypes.object,
};

ModeratorDecisionTag.propTypes = {
  approved: PropTypes.bool,
  style: PropTypes.object,
};

PlainText.propTypes = {
  style: PropTypes.object,
  text: PropTypes.string,
};

Bold.propTypes = {
  style: PropTypes.object,
  text: PropTypes.string,
};

export {
  ExternalLink,
  HyperLink,
  TimeStamp,
  PlainText,
  ModeratorDecisionTag,
  Bold,
};
