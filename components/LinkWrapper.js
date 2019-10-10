import { css, StyleSheet } from "aphrodite";
import Link from "next/link";

export const ServerLinkWrapper = (props) => {
  /**
   * We are not using the Link component from next.js here for the following
   * reason:
   *
   * The Link component allows for client side routing so that the page
   * does not have to be fetched from the server upon subsequent visits. This
   * makes for smooth, quick transitions. It also causes the data on the page
   * to go unchanged if that data is being fetched only in getInitialProps. To
   * solve this we can either fetch the data both serverside and clientside in
   * the page that the link points to, or we must not use the Link component to
   * ensure the correct data is fetched.
   */
  const { path, style } = props;

  const classNames = [styles.linkWrapperContainer];
  if (style) {
    classNames.push(style);
  }

  return (
    <a href={path} className={css(...classNames)}>
      {props.children}
    </a>
  );
};

const ClientLinkWrapper = (props) => {
  const { dynamicHref, path, style } = props;

  const classNames = [styles.linkWrapperContainer];
  if (style) {
    classNames.push(style);
  }

  return (
    <Link href={dynamicHref} as={path}>
      <a className={css(...classNames)}>{props.children}</a>
    </Link>
  );
};

const styles = StyleSheet.create({
  linkWrapperContainer: {
    textDecoration: "none",
  },
});
