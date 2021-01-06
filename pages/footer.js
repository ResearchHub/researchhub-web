import React, { Fragment } from "react";

// NPM Modules
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

class Footer extends React.Component {
  tabData = [
    { label: "Hubs", route: "/hubs", icon: "hub" },
    { label: "About", route: "/about", icon: "info-circle" },
    { label: "Help", route: "/help", icon: "help" },
  ];

  renderTabs = () => {
    let tabs = this.tabData.map((tab, index) => {
      if (tab.icon === "home") {
        return null;
      }
      if (tab.label === "Help") {
        return (
          <div
            key={index}
            className={css(
              styles.tab,
              index === 0 && styles.firstTab,
              index === 2 && styles.lastTab
            )}
          >
            <a
              className={css(
                styles.tabLink,
                styles.tab,
                index === 2 && styles.lastTab
              )}
              href={
                "https://www.notion.so/ResearchHub-Help-a25e87a91d0449abb71b2b30ba0acf93"
              }
              target="_blank"
            >
              {tab.label}
            </a>
          </div>
        );
      }

      return (
        <Link href={tab.route} key={`navbar_tab_${index}`}>
          <div className={css(styles.tab, index === 0 && styles.firstTab)}>
            {tab.label}
          </div>
        </Link>
      );
    });
    return tabs;
  };

  render() {
    let tabs = this.renderTabs();
    return (
      <footer className={css(styles.footer)}>
        <div className={css(styles.imgTab)}>
          <img
            src="/static/white_logo.png"
            className={css(styles.researchHubLogo)}
          />
          <div className={css(styles.linkSection, styles.tabContainer)}>
            {tabs}
          </div>
        </div>
        <div className={css(styles.legal, styles.tabContainer)}>
          <div className={css(styles.socials)}>
            <a
              target="_blank"
              className={css(styles.link)}
              href="https://join.slack.com/t/researchhub-community/shared_invite/zt-iqred46f-f0j0M6_ZxtliD~UszPyWEQ"
            >
              <div className={css(styles.social)}>
                <i className={css(styles.logo) + " fab fa-slack"}></i>
              </div>
            </a>
            <a
              target="_blank"
              className={css(styles.link)}
              href="https://twitter.com/researchhub"
            >
              <div className={css(styles.social)}>
                <i className={css(styles.logo) + " fab fa-twitter"}></i>
              </div>
            </a>
            <a
              target="_blank"
              className={css(styles.link)}
              href="https://www.reddit.com/r/ResearchHub/"
            >
              <div className={css(styles.social)}>
                <i className={css(styles.logo) + " fab fa-reddit"}></i>
              </div>
            </a>
          </div>
          <Link href={"/about/tos"} as={"/about/tos"}>
            <a className={css(styles.link)}>
              <div className={css(styles.tab)}>Terms of Service</div>
            </a>
          </Link>
          <Link href={"/about/privacy"} as={"/about/privacy"}>
            <a className={css(styles.link)}>
              <div className={css(styles.tab)}>Privacy Policy</div>
            </a>
          </Link>
        </div>
      </footer>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    background: "#1F2532",
    display: "flex",
    padding: 16,
    alignItems: "center",
    flexWrap: "wrap",
    // height: 97,
    "@media only screen and (max-width: 767px)": {
      justifyContent: "center",
    },
    "@media only screen and (min-width: 1024px)": {
      padding: 32,
      paddingLeft: 62,
      paddingRight: 62,
    },
  },
  imgTab: {
    display: "flex",

    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
    "@media only screen and (max-width: 415px)": {
      justifyContent: "space-between",
    },
  },
  lastTab: {
    marginRight: 0,
  },
  linkSection: {
    "@media only screen and (min-width: 768px)": {
      marginLeft: "5%",
    },
  },
  link: {
    textDecoration: "none",
  },
  social: {
    background: "rgba(255, 255, 255, .7)",
    height: 35,
    width: 35,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    marginRight: 12,
  },
  socials: {
    marginRight: 24,
    display: "flex",
  },
  logo: {
    color: "#282936",
    fontSize: "1.1em",
    marginTop: 3,
  },
  ccby: {
    color: "#fff",
    marginLeft: 5,
  },
  tab: {
    color: "#fff",
    opacity: 0.8,
    marginRight: 16,
    cursor: "pointer",
    textDecoration: "none",
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  legal: {
    marginTop: 16,
    marginBottom: 16,
    "@media only screen and (min-width: 768px)": {
      marginLeft: "auto",
      marginTop: 0,
      marginBottom: 0,
    },
  },
  tabContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 10,
  },
  researchHubLogo: {
    width: 190,
    objectFit: "contain",
    "@media only screen and (max-width: 767px)": {
      height: 35,
    },
    "@media only screen and (max-width: 415px)": {
      width: 120,
    },
  },
  arr: {
    color: "#fff",
    opacity: 0.8,
  },
});

export default Footer;
