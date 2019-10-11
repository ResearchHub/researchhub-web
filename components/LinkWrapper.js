import { css, StyleSheet } from "aphrodite";
import Link from "next/link";
import PropTypes from "prop-types";

export const ServerLinkWrapper = (props) => {
  const { path, styling } = props;

  const classNames = [styles.linkWrapperContainer];
  if (styling) {
    classNames.push(...styling);
  }

  return (
    <a href={path} className={css(...classNames)}>
      {props.children}
    </a>
  );
};

ServerLinkWrapper.propTypes = {
  path: PropTypes.string,
  styling: PropTypes.array,
};

export const ClientLinkWrapper = (props) => {
  const { dynamicHref, path, styling } = props;

  const classNames = [styles.linkWrapperContainer];
  if (styling) {
    classNames.push(...styling);
  }

  return (
    <Link href={dynamicHref} as={path}>
      <a className={css(...classNames)}>{props.children}</a>
    </Link>
  );
};

ClientLinkWrapper.propTypes = {
  dynamicHref: PropTypes.string,
  path: PropTypes.string,
  styling: PropTypes.array,
};

const styles = StyleSheet.create({
  linkWrapperContainer: {
    textDecoration: "none",
  },
});
