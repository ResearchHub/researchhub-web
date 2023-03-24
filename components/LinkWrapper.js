import { css, StyleSheet } from "aphrodite";
import Link from "next/link";
import PropTypes from "prop-types";
import Ripples from "react-ripples";

export const ServerLinkWrapper = (props) => {
  const { path, styling } = props;

  const classNames = [styles.linkWrapperContainer];
  if (styling) {
    classNames.push(...styling);
  }

  return (
    <a href={path} className={css(...classNames)}>
      <Ripples>{props.children}</Ripples>
    </a>
  );
};

ServerLinkWrapper.propTypes = {
  path: PropTypes.string,
  styling: PropTypes.array,
};

export const ClientLinkWrapper = (props) => {
  const { id, dynamicHref, path, styling } = props;
  const classNames = [styles.linkWrapperContainer];
  if (styling) {
    classNames.push(...styling);
  }

  return (
    <Link href={dynamicHref} as={path} id={id} className={css(...classNames)}>
      {props.children}
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
