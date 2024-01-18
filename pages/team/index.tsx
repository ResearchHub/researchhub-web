import { NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "~/components/Head";
import colors from "~/config/themes/colors";

import { StyleSheet, css } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { useState } from "react";
import { useTransition, animated } from "react-spring";
import HorizontalTabBar from "~/components/HorizontalTabBar";
import Image from "next/image";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const ReactTransitionComponent = ({ children, state, trail }) => {
  // a component that takes a props and arguments to make a resusable transition component
  const [show, set] = useState(state);
  const transitions = useTransition(show, null, {
    from: {
      transform: "translate3d(0, 0px, 0)",
      opacity: 1,
    },
    enter: {
      transform: "translate3d(0, 0px, 0)",
      opacity: 1,
    },
    unique: true,
  });
  return transitions.map(({ item, key, props }) => (
    <animated.div key={key} style={props}>
      {children}
    </animated.div>
  ));
};

const TeamPage: NextPage = ({}) => {
  const tabs = [
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Team",
      href: "/team",
      isSelected: true,
    },
  ];

  return (
    <div className={css(styles.page)}>
      <Head title={"About ResearchHub"} description={"What is ResearchHub"} />

      <div className={css(styles.banner)}>
        <img
          draggable={false}
          src={"/static/background/background-about.jpg"}
          className={css(styles.bannerOverlay)}
        />
        <ReactTransitionComponent>
          <div className={css(styles.column, styles.titleContainer)}>
            <h1 className={css(styles.title)}>Team</h1>
            <h3 className={css(styles.subtitle)}>
              The people behind ResearchHub
            </h3>
          </div>
        </ReactTransitionComponent>
      </div>
      <div className={css(styles.tabsWrapper)}>
        <HorizontalTabBar
          tabs={tabs}
          tabContainerStyle={styles.tabsContainerOverride}
        />
      </div>
      <div className={css(styles.mainContent)}>

        <p className={css(styles.introText)}>
          We are a small team of builders and thinkers working towards making science better for everyone.
        </p>

        <div className={css(styles.people)}>
          <div className={css(styles.person)}>
            <div className={css(styles.imageWrapper)}>
              <Image
                src={"/static/team/brian.jpeg"}
                className={css(styles.personImg)}
                alt="Kobe Attias"
                width={245}
                height={250}
              />
            </div>
            <Link
              href="https://www.linkedin.com/in/barmstrong/"
              className={css(styles.nameWrapper)}
              target="_blank"
            >
              <FontAwesomeIcon icon={faLinkedin} />
              <div className={css(styles.name)}>Brian Armstrong</div>
            </Link>
            <div className={css(styles.jobTitle)}>Chief Executive Officer</div>
          </div>

          <div className={css(styles.person)}>
            <div className={css(styles.imageWrapper)}>
              <Image
                src={"/static/team/joyce.jpeg"}
                className={css(styles.personImg)}
                alt="Kobe Attias"
                width={245}
                height={250}
              />
            </div>
            <Link
              href="https://www.linkedin.com/in/patrick-joyce-396b953b/"
              className={css(styles.nameWrapper)}
              target="_blank"
            >
              <FontAwesomeIcon icon={faLinkedin} />
              <div className={css(styles.name)}>Patrick Joyce</div>
            </Link>
            <div className={css(styles.jobTitle)}>Chief Operating Officer</div>
          </div>

          <div className={css(styles.person)}>
            <div className={css(styles.imageWrapper)}>
              <Image
                src={"/static/team/kobe.png"}
                className={css(styles.personImg)}
                alt="Kobe Attias"
                width={245}
                height={250}
              />
            </div>
            <Link
              href="https://www.linkedin.com/in/kobe-attias-5a9a9421/"
              className={css(styles.nameWrapper)}
              target="_blank"
            >
              <FontAwesomeIcon icon={faLinkedin} />
              <div className={css(styles.name)}>Kobe Attias</div>
            </Link>
            <div className={css(styles.jobTitle)}>Founding Engineer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  introText: {
    fontSize: 21,
    marginTop: 25,
    marginBottom: 0,
    color: colors.BLACK(0.8),
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      fontSize: 16,
      textAlign: "center",
    }
  },
  mainContent: {
    width: "100%",
    maxWidth: 800,
    margin: "0 auto",
  },
  teamTitle: {
    textAlign: "center",
    fontWeight: 500,
    fontSize: 35,
  },
  people: {
    display: "flex",
    columnGap: "25px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  personImg: {
    borderRadius: "4px",
  },
  person: {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: 35,
  },
  nameWrapper: {
    marginTop: 15,
    color: colors.NEW_BLUE(),
    textDecoration: "none",
    fontWeight: 500,
    gap: "8px",
    display: "flex",
    justifyContent: "center",
    ":hover": {
      textDecoration: "underline",
    },
  },
  name: {},
  imageWrapper: {},
  jobTitle: {
    marginTop: 5,
    color: colors.BLACK(0.8),
  },
  tabsWrapper: {
    width: "100%",
    justifyContent: "center",
    borderBottom: `1px solid #E9EAEF`,
  },
  tabsContainerOverride: {
    justifyContent: "center",
  },
  page: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    maxWidth: "100%",
    overflow: "hidden",
    background: "#FFF",
  },
  banner: {
    height: 210,
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    opacity: 1,
    transition: "all ease-in-out 0.5s",
    "@media only screen and (max-width: 767px)": {
      height: 150,
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    objectFit: "cover",
    height: "100%",
    minHeight: "100%",
    width: "100%",
    minWidth: "100%",
  },
  titleContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100%",
    zIndex: 2,
    transition: "all ease-in-out 0.4s",
  },
  title: {
    color: "#FFF",
    fontSize: 50,
    fontWeight: 400,
    padding: "30px 0 0 0",
    "@media only screen and (max-width: 767px)": {
      padding: "20px 0 0 0",
      fontSize: 33,
    },
  },
  subtitle: {
    color: "#FFF",
    fontSize: 33,
    fontWeight: 300,
    margin: 0,
    padding: 0,
    lineHeight: 1.6,
    textAlign: "center",
    paddingBottom: 90,
    "@media only screen and (max-width: 767px)": {
      fontSize: 22,
      paddingBottom: 0,
    },
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 22,
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      fontSize: 18,
    },
  },
});

export default TeamPage;
