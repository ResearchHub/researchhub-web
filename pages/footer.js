import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faReddit } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faMedium } from "@fortawesome/free-brands-svg-icons";
import { Component } from "react";

// NPM Modules
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

// Config
import colors from "~/config/themes/colors";

class Footer extends Component {
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
                "https://researchhub.notion.site/ResearchHub-a2a87270ebcf43ffb4b6050e3b766ba0"
              }
              target="_blank"
              rel="noreferrer noopener"
            >
              {tab.label}
            </a>
          </div>
        );
      }

      return (
        <Link href={tab.route} key={`navbar_tab_${index}`} legacyBehavior>
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
    return typeof window !== "undefined" &&
      window.location.pathname.split("/")[2] !== "notebook" ? (
      <footer className={css(styles.footer)}>
        <div className={css(styles.imgTab)}>
          <img
            src="/static/white_logo.png"
            className={css(styles.researchHubLogo)}
            alt="RH Logo White"
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
              href="https://medium.com/researchhub"
              rel="noreferrer noopener"
            >
              <div className={css(styles.social)}>
                <span className={css(styles.logo)}>
                  {<FontAwesomeIcon icon={faMedium}></FontAwesomeIcon>}
                </span>
              </div>
            </a>
            <a
              target="_blank"
              className={css(styles.link)}
              href="https://discord.gg/ZcCYgcnUp5"
              rel="noreferrer noopener"
            >
              <div className={css(styles.social)}>
                <span className={css(styles.logo)}>
                  {<FontAwesomeIcon icon={faDiscord}></FontAwesomeIcon>}
                </span>
              </div>
            </a>
            <a
              target="_blank"
              className={css(styles.link)}
              href="https://twitter.com/researchhub"
              rel="noreferrer noopener"
            >
              <div className={css(styles.social)}>
                <span className={css(styles.logo)}>
                  {<FontAwesomeIcon icon={faTwitter}></FontAwesomeIcon>}
                </span>
              </div>
            </a>
            <a
              target="_blank"
              className={css(styles.link)}
              href="https://www.reddit.com/r/ResearchHub/"
            >
              <div className={css(styles.social)}>
                <span className={css(styles.logo)}>
                  {<FontAwesomeIcon icon={faReddit}></FontAwesomeIcon>}
                </span>
              </div>
            </a>
            <a
              target="_blank"
              className={css(styles.link)}
              href="https://github.com/ResearchHub"
            >
              <div className={css(styles.social)}>
                <span className={css(styles.logo)}>
                  {<FontAwesomeIcon icon={faGithub}></FontAwesomeIcon>}
                </span>
              </div>
            </a>
          </div>
          <div className={css(styles.legalFooter)}>
            <Link
              href={"/about/tos"}
              as={"/about/tos"}
              className={css(styles.link)}
            >
              <div className={css(styles.tab)}>Terms of Service</div>
            </Link>
            <Link
              href={"/about/privacy"}
              as={"/about/privacy"}
              className={css(styles.link)}
            >
              <div className={css(styles.tab)}>Privacy Policy</div>
            </Link>
          </div>
        </div>
      </footer>
    ) : null;
  }
}

const styles = StyleSheet.create({
  footer: {
    background: colors.VERY_DARK_BLUE2(),
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
    flex: 1,

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
    background: colors.WHITE(0.7),
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

    "@media only screen and (max-width: 767px)": {
      marginBottom: 16,
    },
  },
  legalFooter: {
    display: "flex",
  },
  logo: {
    color: colors.VERY_DARK_GRAYISH_BLUE6(),
    fontSize: "1.1em",
    // marginTop: 3,
  },
  ccby: {
    color: colors.WHITE(),
    marginLeft: 5,
  },
  tab: {
    color: colors.WHITE(),
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
    flexWrap: "wrap",
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
    color: colors.WHITE(),
    opacity: 0.8,
  },
});

export default Footer;
