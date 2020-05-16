import React, { Fragment, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { useTransition, useSpring, animated } from "react-spring";

import Collapsible from "~/components/Form/Collapsible";
import Head from "~/components/Head";

import colors from "~/config/themes/colors";

const points = [
  {
    key: 0,
    title: "Accessible to everyone",
    text:
      "The scientific record is too important to be hidden behind paywalls and in ivory towers. \n ResearchHub is accessible to everybody, everywhere, with no content residing behind paywalls \n and no costs to participate. Summaries are written in plain English to improve accessibility.",
    icon: (
      <i
        className="fad fa-globe-americas"
        draggable={false}
        style={{ color: "#4b5bf6" }}
      />
    ),
  },
  {
    key: 1,
    title: "Collaborative",
    text:
      "Academic research is too siloed today. ResearchHub encourages academics and \n non- academics alike to interact in a public and collaborative manner. An incentive for such behavior is provided in the form of ResearchCoin.",
    icon: (
      <i
        className="fad fa-star-half"
        draggable={false}
        style={{ color: colors.YELLOW(1) }}
      />
    ),
  },
  {
    key: 2,
    title: "Prioritized",
    text:
      "There are over two million academic papers published each year, and the number continues to grow. By crowd-sourcing curation and prioritization of articles, ResearchHub enables the scientific community to provide visiblity to research it deems impactful.",
    icon: (
      <i
        className="fad fa-sort-amount-up-alt"
        draggable={false}
        style={{ color: colors.GREEN(1) }}
      />
    ),
  },
  // {
  //   title: "Easy to understand",
  //   text:
  //     "We provide bite sized plain English summaries, and bulleted take-aways, so you can more easily skim papers before deciding whether to read a whole paper.",
  //   icon: (
  //     <i
  //       className="fad fa-head-side-brain"
  //       draggable={false}
  //       style={{ color: "#ed6f85" }}
  //     />
  //   ),
  // },
  // {
  //   title: "Commercializable",
  //   text:
  //     "We would like to make it easier over time for research to be licensed, so that it can lead to commercial applications, with royalties going to researchers.",
  //   icon: (
  //     <i
  //       className="fad fa-file-signature"
  //       draggable={false}
  //       style={{ color: colors.NAVY(1) }}
  //     />
  //   ),
  // },
  // {
  //   title: "Collaborative",
  //   text:
  //     "Research is too siloed today. We would like to help labs and teams collaborate in the future.",
  //   icon: (
  //     <i
  //       className="fad fa-users"
  //       draggable={false}
  //       style={{ color: colors.DARK_YELLOW(1) }}
  //     />
  //   ),
  // },
  // {
  //   title: "Efficient",
  //   text:
  //     "It can take 3-5 years today to go through the process of applying for funding, completing the research, submitting a paper to journals, having it reviewed, and finally getting it published. We believe research could be completed at least one order of magnitude more efficiently.",
  //   icon: (
  //     <i
  //       class="fad fa-angle-double-right"
  //       draggable={false}
  //       style={{ color: "#4c986e" }}
  //     />
  //   ),
  // },
];

const PointCards = (props) => {
  const [items, setItems] = useState(props.points);
  const transitions = useTransition(items, (items) => items.key, {
    trail: 600,
    from: {
      transform: "translate3d(0, -40px, 0)",
      opacity: 0,
    },
    enter: {
      transform: "translate3d(0, 0px, 0)",
      opacity: 1,
    },
  });

  return transitions.map(({ item, props, key }, index) => {
    let { title, text, icon } = item;
    return (
      <animated.div key={key} style={props}>
        <div className={css(styles.itemCard)} key={`item-${index}`}>
          <div className={css(styles.itemIcon)}>
            {typeof icon === "string" ? (
              <img draggable={false} src={icon && icon} />
            ) : (
              icon
            )}
          </div>
          <div className={css(styles.itemTitle)}>{title && title}</div>
          <div className={css(styles.itemText)}>{text && text}</div>
        </div>
      </animated.div>
    );
  });
};

const ReactTransitionComponent = ({ children, state, trail }) => {
  // a component that takes a props and arguments to make a resusable transition component
  const [show, set] = useState(state);
  const transitions = useTransition(show, null, {
    from: {
      transform: "translate3d(0, 40px, 0)",
      opacity: 0,
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

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reveal: false,
      revealText: false,
    };
  }

  componentDidMount() {
    document.body.style.scrollSnapType = "y mandatory";
    setTimeout(() => {
      this.setState({ reveal: true }, () => {
        setTimeout(() => {
          this.setState({ revealText: true });
        }, 200);
      });
    }, 200);
  }

  renderTextContainer = (
    title,
    subtitle,
    image,
    flip,
    portraitOrientation = false
  ) => {
    return (
      <div
        className={css(
          styles.row,
          flip ? styles.top : styles.bottom,
          portraitOrientation && styles.middle
        )}
      >
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
            <div className={css(styles.column, styles.hubImageWrapper)}>
              <img
                className={css(
                  portraitOrientation ? styles.hubImage : styles.image
                )}
                src={image}
              />
            </div>
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
              draggable={false}
              className={css(styles.contactIcon)}
              src={"/static/icons/email.png"}
            />
            <p className={css(styles.contactText)}>{text}</p>
          </Fragment>
        )}
        {type === "phone" && (
          <Fragment>
            <img
              draggable={false}
              className={css(styles.contactIcon)}
              src={"/static/icons/phone.png"}
            />
            <p className={css(styles.contactText)}>{text}</p>
          </Fragment>
        )}
      </div>
    );
  };

  renderItems = (point, index) => {
    let { title, text, icon } = point;
    return (
      <div className={css(styles.itemCard)} key={`item-${index}`}>
        <div className={css(styles.itemIcon)}>
          {typeof icon === "string" ? (
            <img draggable={false} src={icon && icon} />
          ) : (
            icon
          )}
        </div>
        <div className={css(styles.itemTitle)}>{title && title}</div>
        <div className={css(styles.itemText)}>{text && text}</div>
      </div>
    );
  };

  render() {
    return (
      <div className={css(styles.page)}>
        <Head title={"About Researchhub"} description={"What is Researchhub"} />
        <div className={css(styles.banner, this.state.reveal && styles.reveal)}>
          <img
            draggable={false}
            src={"/static/background/background-about.jpg"}
            className={css(styles.bannerOverlay)}
          />
          <ReactTransitionComponent>
            <div className={css(styles.column, styles.titleContainer)}>
              <h1 className={css(styles.title)}>About ResearchHub</h1>
              <h3 className={css(styles.subtitle)}>
                Our Mission is to Accelerate the Pace of Scientific Research.
              </h3>
            </div>
          </ReactTransitionComponent>
        </div>

        <div className={css(styles.column, styles.fullWidth)}>
          <div className={css(styles.valuesContainer)}>
            <div
              className={css(
                styles.pointsTitle,
                this.state.revealText && styles.reveal
              )}
            >
              We Believe Scientific Research Should Be:
            </div>
            <img
              draggable={false}
              src={"/static/about/valueOverlay.png"}
              className={css(styles.bannerOverlay)}
            />
            <div className={css(styles.row, styles.pointCardList)}>
              <div className={css(styles.frontSpace)} />
              <PointCards points={points} />
              <div className={css(styles.endSpace)} />
            </div>
          </div>
        </div>
        <div className={css(styles.infoContainer)}>
          {this.renderTextContainer(
            "A GitHub For Science",
            "ResearchHub's mission is to accelerate the pace of scientific research. Our goal is to make a modern mobile and web application where people can collaborate on scientific research in a more efficient way, similar to what GitHub has done for software engineering. \n \nResearchers are able to upload articles (preprint or postprint) in PDF form, summarize the findings of the work in an attached wiki, and discuss the findings in a completely open and accessible forum dedicated solely to the relevant article.",
            "/static/about/about-1.png",
            true
          )}
          {this.renderTextContainer(
            `"Hubs" as an Alternative to Journals`,
            `Within ResearchHub, papers are grouped in "Hubs" by area of research. Individual Hubs will essentially act as live journals within focused areas, within highly upvoted posts. (i.e the paper and its associated summary and discussion) moving to the top of each Hub.`,
            "/static/about/about-hubs.png",
            false,
            true
          )}
          <div className={css(styles.row, styles.bottom)}>
            <Fragment>
              <div
                className={css(
                  styles.column,
                  styles.textContainer,
                  styles.wideText
                )}
              >
                <h3 className={css(styles.textTitle, styles.centerText)}>
                  A Community Powered by ResearchCoin
                </h3>
                <p className={css(styles.subtext, styles.wideText)}>
                  To help bring this nascent community together and incentivize
                  contribution to the platform, a newly created ERC20 token,
                  ResearchCoin (RSC), has been created. Users receive RSC for
                  uploading new content to the platform, as well as for
                  summarizing and discussion research. Rewards for contributions
                  are proportionate to how valuable the community perceives the
                  actions to be - as measured by upvotes.{"\n \n"}
                  ResearchCoin is also linked to reputation on the
                  platform--with reputation being mesaured as a user's lifetime
                  earnings of ResearchCoin minus erosion due to downvotes.
                  Reputation is linked to certain privileges in the forum, g as
                  a mechanism for moderation within the community.{"\n \n"}
                  Further details about ResearchCoin can also be found on the
                  ResearchHub Notion page.
                </p>
              </div>
            </Fragment>
          </div>
        </div>
        <img className={css(styles.image)} src={"/static/about/about-2.png"} />
        <div className={css(styles.bannerContainer)}>
          <img
            draggable={false}
            src={"/static/about/valueOverlay.png"}
            className={css(styles.bannerOverlay, styles.flipBanner)}
          />
          <div className={css(styles.collapsibleContainer)}>
            <div className={css(styles.faqContainer)}>
              <h3
                className={css(
                  styles.textTitle,
                  styles.centerText,
                  styles.faqTitle
                )}
              >
                Frequently Asked Questions
              </h3>
              <Collapsible
                className={css(styles.collapsibleSection)}
                openedClassName={css(
                  styles.collapsibleSection,
                  styles.sectionOpened
                )}
                triggerClassName={css(styles.maxWidth)}
                triggerOpenedClassName={css(styles.maxWidth)}
                contentInnerClassName={css(styles.collapsibleContent)}
                open={true}
                trigger="- Is content created on ResearchHub open?"
              >
                <p className={css(styles.subtext, styles.wideText)}>
                  <p>
                    Yes. The scientific record is too important to be hidden
                    behind paywalls. Science should be open, not only for
                    reading, but also for reusing.
                  </p>
                  {"\n"}
                  <p>
                    That's why user contributions to ResearchHub are shared
                    under the{" "}
                    <a
                      href="https://creativecommons.org/licenses/by/4.0/"
                      title="Creative Commons Attribution 4.0 International Public License"
                    >
                      Creative Commons Attribution License
                    </a>{" "}
                    (CC BY 4.0). This license allows anyone to reuse the content
                    for any purpose, as long as attribution is provided. We
                    consider a hyperlink or URL back to the source page on
                    ResearchHub sufficient attribution.
                  </p>
                  {"\n"}
                  <p>
                    The CC BY license is the gold standard of open licenses for
                    scholarly content. It is used by publishers such as{" "}
                    <a href="https://www.plos.org/license">PLOS</a>,{" "}
                    <a href="https://elifesciences.org/about/openness">eLife</a>
                    , <a href="https://distill.pub/faq/">Distill</a>, and{" "}
                    <a href="https://www.biomedcentral.com/getpublished/copyright-and-license">
                      BMC
                    </a>
                    . By choosing CC BY, ResearchHub ensures user content can be
                    reused to further science, by way of text mining, sharing,
                    translation, and many other forms of reuse. This sets
                    ResearchHub apart from other places to discuss science, like
                    ResearchGate or Reddit, which do not apply an open license
                    to all user-contributed content.
                  </p>
                </p>
              </Collapsible>
              <Collapsible
                className={css(styles.collapsibleSection)}
                openedClassName={css(
                  styles.collapsibleSection,
                  styles.sectionOpened
                )}
                triggerClassName={css(styles.maxWidth)}
                triggerOpenedClassName={css(styles.maxWidth)}
                contentInnerClassName={css(styles.collapsibleContent)}
                open={false}
                trigger="- What papers can I legally upload to ResearchHub?"
              >
                <p className={css(styles.subtext, styles.wideText)}>
                  <p>
                    Users can create a ResearchHub page for any paper, allowing
                    for summary and discussion. However, due to copyright, only
                    certain papers are eligible for fulltext PDF upload.
                    Specifically, please only upload fulltexts of papers
                    released under one of the following open licenses:{" "}
                    <a
                      href="https://creativecommons.org/licenses/by/4.0/"
                      title="Creative Commons Attribution 4.0 International Public License"
                    >
                      CC BY
                    </a>{" "}
                    or{" "}
                    <a
                      href="https://creativecommons.org/publicdomain/zero/1.0/"
                      title="Creative Commons Universal Public Domain Dedication (CC0 1.0)"
                    >
                      CC0
                    </a>
                    .
                  </p>
                  {"\n"}
                  <p>
                    To determine whether an article is released under one of
                    these licenses, check for any text in the PDF stating a
                    license or refer to the webpage where you downloaded the
                    PDF. If you are the author of a paper and would like to
                    upload the fulltext to ResearchHub, apply a supported
                    license to the paper at an existing publicly available
                    location. In other words, PDFs uploaded to ResearchHub
                    should be available elsewhere on the web with a supported
                    license. We do not currently publish original articles that
                    are not available elsewhere.
                  </p>
                  {"\n"}
                  <p>
                    Disappointed that you cannot upload a paper's PDF due to
                    copyright? We are too. While open access publishing is
                    growing in popularity, many papers are still published in
                    toll access journals without open licenses. We can change
                    this by encouraging scientists to publish in open access
                    journals and use platforms like ResearchHub that remove
                    legal barriers from science.
                  </p>
                </p>
              </Collapsible>
              <Collapsible
                className={css(styles.collapsibleSection)}
                openedClassName={css(
                  styles.collapsibleSection,
                  styles.sectionOpened
                )}
                triggerClassName={css(styles.maxWidth)}
                triggerOpenedClassName={css(styles.maxWidth)}
                contentInnerClassName={css(styles.collapsibleContent)}
                open={false}
                trigger="- Who created this site?"
              >
                <p className={css(styles.subtext, styles.wideText)}>
                  ResearchHub is being developed by a small team of passionate
                  founders working in San Francisco, CA.{"\n\n"}
                  The idea for the site was initially proposed in this{" "}
                  <a
                    className={css(styles.hyperlink)}
                    href={
                      "https://medium.com/@barmstrong/ideas-on-how-to-improve-scientific-research-9e2e56474132"
                    }
                  >
                    blog post
                  </a>
                  .
                </p>
              </Collapsible>
              <Collapsible
                className={css(styles.collapsibleSection)}
                openedClassName={css(
                  styles.collapsibleSection,
                  styles.sectionOpened
                )}
                triggerClassName={css(styles.maxWidth)}
                triggerOpenedClassName={css(styles.maxWidth)}
                contentInnerClassName={css(styles.collapsibleContent)}
                open={false}
                trigger="- How can I help?"
              >
                <p className={css(styles.subtext, styles.wideText)}>
                  {`The easiest way to help the community grow is to sign up and start contributing content.\n\n`}
                  <b>1. Sign up</b>
                  {"\n"}Create your account in just a few clicks, using Google
                  Sign In.{"\n\n"}
                  <b>2. Upload a paper</b>
                  {"\n"}Is there a research paper you thought was particularly
                  insightful?{"\n\n"}
                  <b>3. Write/edit a summary</b>
                  {"\n"}Is there a paper that you can help explain in plain
                  English?{"\n\n"}
                  <b>4. Upvote (or downvote) a paper</b>
                  {"\n"}Is there a paper already on the site that you have an
                  opinion on?{"\n\n"}
                  <b>5. Start a discussion.</b>
                  {"\n"}Is there a question you have about a paper?{"\n\n"}
                  <b>6. Follow us on Twitter</b>
                  {"\n"}Hear our latest updates as we make progress.
                </p>
              </Collapsible>
            </div>
          </div>
        </div>
        <div className={css(styles.contactContainer)}>
          <div className={css(styles.contact)}>
            <h3 className={css(styles.textTitle)}>Contact Us</h3>
            {this.renderContacts("email", "hello@researchhub.com")}
            {/* {this.renderContacts("phone", "+1215 333 333")} */}
          </div>
          <img
            draggable={false}
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
    height: 320,
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    opacity: 0,
    transition: "all ease-in-out 0.5s",
    "@media only screen and (max-width: 800px)": {
      height: 300,
    },
    "@media only screen and (max-width: 415px)": {
      height: 200,
    },
  },
  reveal: {
    opacity: 1,
  },
  flipBanner: {
    transform: "scaleX(-1)",
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
    scrollSnapAlign: "center",
    "@media only screen and (max-width: 1200px)": {
      width: 760,
    },
    "@media only screen and (max-width: 800px)": {
      width: 600,
    },
  },
  top: {
    padding: "50px 0 50px 0",
    "@media only screen and (max-width: 1024px)": {
      width: "100%",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: 50,
      paddingBottom: 0,
    },
  },
  middle: {
    padding: "50px 0 50px 0",
  },
  bottom: {
    padding: "50px 0 50px 0",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: 0,
      paddingBottom: 50,
    },
  },
  infoContainer: {
    scrollSnapType: "y mandatory",
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
    "@media only screen and (max-width: 800px)": {
      fontSize: 30,
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
    "@media only screen and (max-width: 800px)": {
      fontSize: 22,
      width: 400,
      paddingBottom: 0,
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
  hubImage: {
    height: 350,
    objectFit: "contain",
    "@media only screen and (max-width: 1024px)": {
      paddingLeft: 60,
      paddingTop: 50,
    },
    "@media only screen and (max-width: 800px)": {
      paddingTop: 0,
      paddingLeft: 0,
    },
  },
  textContainer: {
    "@media only screen and (max-width: 1200px)": {
      width: "100%",
    },
    "@media only screen and (max-width: 415px)": {
      width: "85%",
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
  centerText: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  subtext: {
    fontSize: 18,
    // color: "#4e4c5f",
    lineHeight: 1.6,
    maxWidth: 515,
    whiteSpace: "pre-wrap",
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
    "@media only screen and (max-width: 800px)": {
      fontSize: 16,
    },
  },
  pointCardList: {
    justifyContent: "space-between",
    overflowX: "scroll",
    scrollSnapType: "x mandatory",
    paddingBottom: 20,
    width: "80%",
    padding: 16,
    "::-webkit-scrollbar": {
      display: "none",
    },
    "@media only screen and (max-width: 800px)": {
      width: 600,
    },
  },
  fullWidth: {
    width: "100%",
    marginTop: 100,
    "@media only screen and (max-width: 800px)": {
      marginTop: 40,
    },
  },
  itemCard: {
    margin: "20px 20px 0 20px",
    padding: "25px 35px 25px 35px",
    display: "flex",
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 40,
    width: 295,
    height: 300,
    minWidth: 295,
    maxWidth: 295,
    backgroundColor: "#FFF",
    scrollSnapAlign: "center",
    boxShadow: "0px 10px 15px 0px rgba(0,0,0,0.1)",
    zIndex: 3,
    "@media only screen and (max-width: 415px)": {
      padding: "20px 25px 20px 25px",
      width: 230,
      minWidth: 230,
      maxWidth: 230,
    },
  },
  itemIcon: {
    height: 80,
    display: "flex",
    justifyContent: "center",
    textAlign: "justify",
    alignItems: "center",
    fontSize: 60,
    objectFit: "contain",
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 18,
    padding: "15px 0 20px 0",
    textTransform: "capitalize",
    fontFamily: "Roboto",
  },
  itemText: {
    fontSize: 16,
    lineHeight: 1.6,
    fontFamily: "Roboto",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  pointsTitle: {
    zIndex: 2,
    fontSize: 28,
    fontWeight: "bold",
    // position: "absolute",
    textAlign: "center",
    top: 0,
    transition: "all ease-in-out 0.6s",
    opacity: 0,
    "@media only screen and (max-width: 415px)": {
      fontSize: 18,
      top: 40,
    },
    "@media only screen and (max-width: 320px)": {
      width: " 90%",
      fontSize: 20,
    },
  },
  frontSpace: {
    width: 30,
    minWidth: 30,
    maxWidth: 30,
    height: "100%",
    "@media only screen and (max-width: 1024px)": {
      width: 150,
      minWidth: 150,
      maxWidth: 150,
    },
    "@media only screen and (max-width: 415px)": {
      width: 135,
      minWidth: 135,
      maxWidth: 135,
    },
    "@media only screen and (max-width: 320px)": {
      width: 140,
      minWidth: 140,
      maxWidth: 140,
    },
  },
  endSpace: {
    width: 30,
    minWidth: 30,
    maxWidth: 30,
    height: "100%",
    "@media only screen and (max-width: 1024px)": {
      width: 200,
      minWidth: 200,
      maxWidth: 200,
    },
    "@media only screen and (max-width: 800px)": {
      width: 200,
      minWidth: 200,
      maxWidth: 200,
    },
  },
  wideText: {
    width: "100%",
    maxWidth: "unset",
    "@media only screen and (max-width: 800px)": {
      paddingBottom: 0,
    },
  },
  bannerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    minHeight: 300,
    width: "100%",
    position: "relative",
    paddingTop: 50,
    paddingBottom: 50,
  },
  faqContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  faqTitle: {
    marginTop: 0,
    marginBottom: 20,
  },
  collapsibleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: 1180,
    height: "100%",
    scrollSnapAlign: "center",
    zIndex: 3,
    padding: 15,
    "@media only screen and (max-width: 1200px)": {
      width: 760,
    },
    "@media only screen and (max-width: 800px)": {
      width: "85%",
    },
  },
  maxWidth: {
    width: 1180,
    minWidth: 1180,
    fontWeight: "bold",
    cursor: "pointer",
    "@media only screen and (max-width: 800px)": {
      fontSize: 16,
    },
  },
  collapsibleSection: {
    width: "100%",
    padding: "15px 0 15px",
    fontSize: 22,
  },
  sectionOpened: {
    paddingTop: 15,
    paddingBottom: 0,
  },
  collapsibleContent: {
    padding: 15,
    whiteSpace: "pre-wrap",
  },
  hyperlink: {
    color: colors.BLUE(1),
    textDecoration: "underline",
    cursor: "pointer",
  },
  hubImageWrapper: {
    width: 500,
    "@media only screen and (max-width: 415px)": {
      width: "85%",
    },
  },
});

export default Index;
