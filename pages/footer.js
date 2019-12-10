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
              className={css(styles.tabLink, styles.tab)}
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
        <img
          src="/static/white_logo.png"
          className={css(styles.researchHubLogo)}
        />
        <div className={css(styles.linkSection, styles.tabContainer)}>
          {tabs}
        </div>
        <div className={css(styles.legal, styles.tabContainer)}>
          <div className={css(styles.tab)}>Terms of Service</div>
          <div className={css(styles.tab)}>Privacy Policy</div>
          <div className={css(styles.arr)}>
            © {new Date().getFullYear()} ResearchHub &amp; Contributors.
            User contributions licensed under
            <a href="https://creativecommons.org/licenses/by/4.0/"
              title="Creative Commons Attribution 4.0 International Public License">
              CC BY 4.0
            </a>.
          </div>
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
    "@media only screen and (min-width: 1024px)": {
      padding: 32,
      paddingLeft: 62,
      paddingRight: 62,
    },
  },
  linkSection: {
    marginLeft: "5%",
  },
  tab: {
    color: "#fff",
    opacity: 0.8,
    marginRight: 16,
    cursor: "pointer",
    textDecoration: "none",
  },
  legal: {
    marginLeft: "auto",
  },
  tabContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 10,
  },
  researchHubLogo: {
    width: 190,
    objectFit: "contain",
  },
  arr: {
    color: "#fff",
    opacity: 0.8,
  },
});

export default Footer;
