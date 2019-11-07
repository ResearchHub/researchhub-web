import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

import colors from "../config/themes/colors";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderTextContainer = (title, subtitle, image, flip) => {
    return (
      <div className={css(styles.row, flip ? styles.top : styles.bottom)}>
        {flip ? (
          <Fragment>
            <img className={css(styles.image, styles.topImage)} src={image} />
            <div
              className={css(
                styles.column,
                styles.textContainer,
                styles.topText
              )}
            >
              <h3 className={css(styles.textTitle)}>{title && title}</h3>
              <p className={css(styles.subtext)}>{subtitle && subtitle}</p>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className={css(styles.column, styles.textContainer)}>
              <h3 className={css(styles.textTitle)}>{title && title}</h3>
              <p className={css(styles.subtext)}>{subtitle && subtitle}</p>
            </div>
            <img className={css(styles.image)} src={image} />
          </Fragment>
        )}
      </div>
    );
  };

  renderValues = (text, index) => {
    return (
      <div
        className={css(styles.value, index === 2 && styles.lastValue)}
        key={`values_${index}`}
      >
        <div className={css(styles.valueIcon)}></div>
        <div className={css(styles.valueText)}>
          Carbonic anhydrase IX (CAIX) is a membrane spanning protein involved
          in the enzymatic regulation of tumoracid base balance. CAIX has been
          shown
        </div>
      </div>
    );
  };

  renderContacts = (type, text) => {
    return (
      <div className={css(styles.contactRow)}>
        {type === "email" && (
          <Fragment>
            <img
              className={css(styles.contactIcon)}
              src={"/static/icons/email.png"}
            />
            <p className={css(styles.contactText)}>{text}</p>
          </Fragment>
        )}
        {type === "phone" && (
          <Fragment>
            <img
              className={css(styles.contactIcon)}
              src={"/static/icons/phone.png"}
            />
            <p className={css(styles.contactText)}>{text}</p>
          </Fragment>
        )}
      </div>
    );
  };

  render() {
    return (
      <div className={css(styles.page)}>
        <div className={css(styles.banner)}>
          <img
            src={"/static/background/background-about.png"}
            className={css(styles.bannerOverlay)}
          />
          <div className={css(styles.column, styles.titleContainer)}>
            <h1 className={css(styles.title)}>About Research Hub</h1>
            <h3 className={css(styles.subtitle)}>
              Company description or slogan. Example text we dive into what
              makes your business special. Together we expand the vision, create
              plans, and make it happen.
            </h3>
          </div>
        </div>
        <div className={css(styles.infoContainer)}>
          {this.renderTextContainer(
            "What We Do",
            "Carbonic anhydrase IX (CAIX) is a membrane spanning protein involved in the enzymatic regulation of tumoracid-base balance. CAIX has been shown to be elevated in a number of hypoxic tumor types. The purpose of this study wasto determine the efficiency of intact and IgG fragments of cG250.",
            "/static/about/about-1.png",
            true
          )}
          {this.renderTextContainer(
            "Our Mission",
            "Carbonic anhydrase IX (CAIX) is a membrane spanning protein involved in the enzymatic regulation of tumoracid-base balance. CAIX has been shown to be elevated in a number of hypoxic tumor types. The purpose of this study wasto determine the efficiency of intact and IgG fragments of cG250.",
            "/static/about/about-2.png",
            false
          )}
        </div>
        <div className={css(styles.valuesContainer)}>
          <img
            src={"/static/about/valueOverlay.png"}
            className={css(styles.bannerOverlay)}
          />
          <h3 className={css(styles.textTitle, styles.valuesTitle)}>
            Our Values
          </h3>
          <div className={css(styles.row, styles.valuesList)}>
            {[0, 0, 0].map((el, i) => {
              return this.renderValues("", i);
            })}
          </div>
        </div>
        <div className={css(styles.contactContainer)}>
          <div className={css(styles.contact)}>
            <h3 className={css(styles.textTitle)}>Contact Us</h3>
            {this.renderContacts("email", "researchhub@example.com")}
            {this.renderContacts("phone", "+1215 333 333")}
          </div>
          <img
            src={"/static/about/about-3.png"}
            className={css(styles.contactImage)}
          />
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    maxWidth: "100vw",
    overflow: "hidden",
  },
  banner: {
    height: 378,
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
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
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: 1180,
    "@media only screen and (max-width: 1200px)": {
      width: 760,
    },
    "@media only screen and (max-width: 800px)": {
      width: 600,
    },
  },
  top: {
    padding: "150px 0 50px 0",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: 50,
      paddingBottom: 0,
    },
  },
  bottom: {
    padding: "50px 0 150px 0",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: 0,
      paddingBottom: 50,
    },
  },
  titleContainer: {
    zIndex: 2,
  },
  title: {
    color: "#FFF",
    fontSize: 50,
    fontWeight: 400,
    margin: "60px 0 30px 0",
    padding: 0,
    "@media only screen and (max-width: 800px)": {
      fontSize: 30,
    },
  },
  subtitle: {
    color: "#FFF",
    fontSize: 26,
    maxWidth: 628,
    fontWeight: 300,
    margin: 0,
    padding: 0,
    lineHeight: 1.6,
    "@media only screen and (max-width: 800px)": {
      fontSize: 22,
      textAlign: "justify",
      width: 400,
    },
    "@media only screen and (max-width: 415px)": {
      width: 280,
      fontSize: 18,
    },
  },
  image: {
    height: 380,
    objectFit: "contain",
    "@media only screen and (max-width: 1200px)": {
      height: 250,
    },
    "@media only screen and (max-width: 800px)": {
      height: 200,
    },
  },
  textContainer: {
    alignItems: "flex-start",
    "@media only screen and (max-width: 1200px)": {
      maxWidth: 300,
    },
    "@media only screen and (max-width: 800px)": {
      width: 250,
    },
    "@media only screen and (max-width: 415px)": {
      alignItems: "center",
    },
  },
  textTitle: {
    fontSize: 33,
    color: "#241F3A",
    "@media only screen and (max-width: 800px)": {
      fontSize: 28,
    },
    "@media only screen and (max-width: 415px)": {
      textAlign: "center",
      width: "100%",
    },
  },
  subtext: {
    fontSize: 18,
    color: "#4e4c5f",
    lineHeight: 1.6,
    maxWidth: 515,
    "@media only screen and (max-width: 800px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 415px)": {
      textAlign: "justify",
      paddingBottom: 50,
    },
  },
  valuesContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 570,
    width: "100%",
    position: "relative",
  },
  valuesTitle: {
    zIndex: 2,
    marginBottom: 50,
    "@media only screen and (max-width: 415px)": {
      marginBottom: 30,
    },
  },
  value: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginRight: 100,
    "@media only screen and (max-width: 800px)": {
      marginRight: 20,
    },
    "@media only screen and (max-width: 415px)": {
      flexDirection: "row",
      justifyContent: "center",
      marginRight: 0,
      marginBottom: 10,
    },
  },
  lastValue: {
    marginRight: 0,
    "@media only screen and (max-width: 800px)": {
      margin: 0,
    },
  },
  valuesList: {
    zIndex: 2,
    "@media only screen and (max-width: 415px)": {
      flexDirection: "column",
      justifyContent: "flex-start",
    },
  },
  valueIcon: {
    width: 40,
    height: 40,
    borderRadius: 3,
    backgroundColor: colors.BLUE(1),
    marginBottom: 50,
    "@media only screen and (max-width: 415px)": {
      marginBottom: 0,
      marginRight: 15,
      marginTop: 5,
      width: 20,
      height: 20,
    },
  },
  valueText: {
    maxWidth: 327,
    fontSize: 18,
    color: "#4e4c5f",
    lineHeight: 1.6,
    "@media only screen and (max-width: 800px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 415px)": {
      textAlign: "justify",
      width: 230,
    },
  },
  contactContainer: {
    height: 400,
    width: 1180,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 50,
    "@media only screen and (max-width: 1200px)": {
      width: 760,
    },
    "@media only screen and (max-width: 800px)": {
      width: 600,
      marginTop: 0,
    },
    "@media only screen and (max-width: 415px)": {
      width: "unset",
      height: "unset",
      flexDirection: "column",
      alignItems: "center",
    },
  },
  contact: {
    height: 378,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    "@media only screen and (max-width: 415px)": {
      height: "unset",
      marginBottom: 50,
    },
  },
  contactRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  contactImage: {
    height: 378,
    objectFit: "contain",
    "@media only screen and (max-width: 800px)": {
      height: 250,
    },
  },
  contactIcon: {
    width: 20,
    height: 18,
    marginRight: 20,
  },
  contactText: {
    color: "#4e4c5f",
    fontSize: 18,
  },
  "@media only screen and (max-width: 800px)": {
    fontSize: 16,
  },
});

export default Index;
