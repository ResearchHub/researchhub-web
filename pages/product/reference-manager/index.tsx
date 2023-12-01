import {
  faDiscord,
  faGithub,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRight } from "@fortawesome/pro-regular-svg-icons";
import {
  faBookmark,
  faCircleCheck,
  faRectangleHistory,
  faUsers,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StyleSheet, css } from "aphrodite";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "~/components/Form/Button";
import CollapsibleCard from "~/components/Form/CollapsibleCard";
import HeadComponent from "~/components/Head";
import IconButton from "~/components/Icons/IconButton";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { getIsOnMobileScreenSize } from "~/config/utils/getIsOnMobileScreenSize";
import { RootState } from "~/redux";

const ProductReferenceManager: NextPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const auth = useSelector((state: RootState) => state.auth);
  const isLoggedIn = auth.authChecked && auth.isLoggedIn;

  const handleFaqClick = (index: number) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const isMobileScreen = getIsOnMobileScreenSize();

  return (
    <div className={css(styles.container)}>
      <HeadComponent
        title="Reference Manager | ResearchHub"
        description="A free open-source reference manager for scientific teams."
      />

      <div className={css(styles.headerBackgroundMobile)} />

      <div className={css(styles.headerBackground)}>
        <div className={css(styles.topbar)}>
          <img
            src="/static/products/reference-manager-logo.svg"
            width={158}
            height={38}
            alt="Logo"
          />
          <div className={css(styles.topbarRight)}>
            <Button
              variant="outlined"
              label="Log In"
              customButtonStyle={styles.loginBtn}
              isLink={{
                href: isLoggedIn
                  ? "/reference-manager"
                  : "/login?redirect=/reference-manager",
              }}
            ></Button>
            {!isMobileScreen && (
              <Link href="https://www.researchhub.com" target="_blank">
                <IconButton overrideStyle={styles.publicBtn}>
                  <Image
                    src="/static/ResearchHubTextWhite.png"
                    width={104}
                    height={16.8}
                    alt="ResearchHub"
                  />
                  <FontAwesomeIcon
                    icon={faArrowUpRight}
                    style={{ fontSize: 16, marginRight: 4 }}
                  />
                </IconButton>
              </Link>
            )}
          </div>
        </div>

        <div className={css(styles.section, styles.heroContainer)}>
          <div className={css(styles.heroLeft)}>
            <div className={css(styles.heroTag)}>ResearchHub References</div>
            <h1 className={css(styles.heroTitle)}>
              Scientific collaboration, simplified.
            </h1>
            <div className={css(styles.heroDescription)}>
              A free, open-source reference manager that helps scientific teams
              draft, edit, and publish new research.{" "}
              {isMobileScreen && (
                <>
                  {/* Add line break so description is easier to read on mobile */}
                  <div style={{ marginBottom: 12 }}></div>
                </>
              )}{" "}
              Collaborate within your own private lab, or earn ResearchCoin for
              posting in the public.
            </div>

            <div className={css(styles.heroButtons)}>
              <Button
                variant="contained"
                label="Get Started"
                customButtonStyle={styles.heroButton}
                isLink={{
                  href: isLoggedIn
                    ? "/reference-manager"
                    : "/login?redirect=/reference-manager",
                }}
              />
              {/* <Button
                variant="contained"
                label="Get Browser Extension"
                isWhite
                customButtonStyle={styles.heroButton}
              /> */}
            </div>
          </div>

          <div className={css(styles.heroImageSection)}>
            <img
              src={
                isMobileScreen
                  ? "/static/products/reference-manager-mobile.png"
                  : "/static/products/reference-manager-laptop.png"
              }
              alt="ResearchHub"
              className={css(styles.heroImage)}
            />
          </div>
        </div>
      </div>

      <div className={css(styles.section, styles.cards)}>
        <div className={css(styles.card)}>
          <FontAwesomeIcon icon={faBookmark} style={{ marginBottom: 16 }} />
          <div className={css(styles.cardTitle)}>One click save</div>
          <div className={css(styles.cardDescription)}>
            Everything you need to save and annotate academic papers
          </div>
        </div>
        <div className={css(styles.card)}>
          <FontAwesomeIcon
            icon={faRectangleHistory}
            style={{ marginBottom: 16 }}
          />
          <div className={css(styles.cardTitle)}>Collaborative writing</div>
          <div className={css(styles.cardDescription)}>
            Helping teams research, draft, and edit new manuscripts
          </div>
        </div>
        <div className={css(styles.card)}>
          <FontAwesomeIcon icon={faUsers} style={{ marginBottom: 16 }} />
          <div className={css(styles.cardTitle)}>Share in private groups</div>
          <div className={css(styles.cardDescription)}>
            Like to work in private? Enjoy robust privacy & permissions
          </div>
        </div>
        <div className={css(styles.card)}>
          <img
            src="/static/ResearchHubIconWhite.svg"
            className={css(styles.rhIconStyle)}
            draggable={false}
            alt="RH Logo"
          />
          <div className={css(styles.cardTitle)}>Rewarding open science</div>
          <div className={css(styles.cardDescription)}>
            Prefer sharing in the open? Earn ResearchCoin as a reward
          </div>
        </div>
      </div>

      <div className={css(styles.lightGrey)}>
        <div className={css(styles.section, styles.exploreSection)}>
          <div className={css(styles.exploreContentSection)}>
            <div className={css(styles.exploreTag)}>Working Independently</div>
            <div className={css(styles.exploreTitle)}>
              Organize your research
            </div>
            <div className={css(styles.exploreDescription)}>
              ResearchHub makes it easy for anyone to research, draft, and edit
              new manuscripts. Save papers directly from your browser. Use
              in-line comments to discuss findings within your lab. Draft new
              content in Microsoft Word.
            </div>

            <hr />

            <div className={css(styles.checklist)}>
              <div className={css(styles.checklistItem)}>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  color={colors.NEW_BLUE()}
                  style={{ fontSize: 18 }}
                ></FontAwesomeIcon>
                <div>Save new references with one-click</div>
              </div>
              <div className={css(styles.checklistItem)}>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  color={colors.NEW_BLUE()}
                  style={{ fontSize: 18 }}
                ></FontAwesomeIcon>
                <div>
                  Streamline reviews and discussions with in-line comments
                </div>
              </div>
              <div className={css(styles.checklistItem)}>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  color={colors.NEW_BLUE()}
                  style={{ fontSize: 18 }}
                ></FontAwesomeIcon>
                <div>Collaborate on manuscripts in real time</div>
              </div>
              <div className={css(styles.checklistItem)}>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  color={colors.NEW_BLUE()}
                  style={{ fontSize: 18 }}
                ></FontAwesomeIcon>
                <div>
                  Import all existing references from other citation managers
                </div>
              </div>
            </div>
          </div>
          <div className={css(styles.exploreImageSection)}>
            <img
              src="/static/products/workspace-graphic.svg"
              alt="ResearchHub"
              className={css(styles.exploreImage)}
            />
          </div>
        </div>

        <div
          className={css(
            styles.section,
            styles.exploreSection,
            styles.exploreSection2
          )}
        >
          <div className={css(styles.exploreImageSection)}>
            <img
              src="/static/products/collaboration-graphic.svg"
              alt="ResearchHub"
              className={css(styles.exploreImage)}
            />
          </div>
          <div className={css(styles.exploreContentSection)}>
            <div className={css(styles.exploreTag)}>Working As A Team</div>
            <div className={css(styles.exploreTitle)}>
              Streamlined Collaboration
            </div>
            <div className={css(styles.exploreDescription)}>
              ResearchHub levels up the productivity of scientific teams by
              helping lab mates collaboratively research and write about a
              topic.
            </div>

            <hr />

            <div className={css(styles.checklist)}>
              <div className={css(styles.checklistItem)}>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  color={colors.NEW_BLUE()}
                  style={{ fontSize: 18 }}
                ></FontAwesomeIcon>
                <div>Invite friends and lab mates</div>
              </div>
              <div className={css(styles.checklistItem)}>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  color={colors.NEW_BLUE()}
                  style={{ fontSize: 18 }}
                ></FontAwesomeIcon>
                <div>
                  Follow colleagues to stay up-to-date with their research
                </div>
              </div>
              <div className={css(styles.checklistItem)}>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  color={colors.NEW_BLUE()}
                  style={{ fontSize: 18 }}
                ></FontAwesomeIcon>
                <div>Robust privacy and permissions controls</div>
              </div>
              <div className={css(styles.checklistItem)}>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  color={colors.NEW_BLUE()}
                  style={{ fontSize: 18 }}
                ></FontAwesomeIcon>
                <div>Bring your team together in one place</div>
              </div>
              <div className={css(styles.checklistItem)}>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  color={colors.NEW_BLUE()}
                  style={{ fontSize: 18 }}
                ></FontAwesomeIcon>
                <div>
                  Earn ResearchCoin for sharing openly accessible content
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={css(styles.section, styles.faqSection)}>
        <div className={css(styles.faqTitle)}>Frequently Asked Questions</div>
        <div>
          <CollapsibleCard
            title="Can I import my library from Zotero or Mendeley?"
            isOpen={openFaq === 0}
            setIsOpen={() => handleFaqClick(0)}
            variant="noBorder"
          >
            <div className={css(styles.faqAnswer)}>
              Yes, you can easily import your existing reference library by
              exporting it in BibTeX (.bib) format, and then uploading it to our
              platform.
            </div>
          </CollapsibleCard>
          <hr className={css(styles.faqDivider)} />
          <CollapsibleCard
            title="Can I share references and annotations with my team?"
            isOpen={openFaq === 3}
            setIsOpen={() => handleFaqClick(3)}
            variant="noBorder"
          >
            <div className={css(styles.faqAnswer)}>
              Yes, you can collaborate with your friends and lab mates on
              ResearchHub's Reference Manager.
              <br />
              <br />
              You can invite them by creating or navigating to your
              organization, going to "Settings and Members", and inviting them
              by their email address.
            </div>
          </CollapsibleCard>
          <hr className={css(styles.faqDivider)} />
          <CollapsibleCard
            title="Do you have a browser extension?"
            isOpen={openFaq === 1}
            setIsOpen={() => handleFaqClick(1)}
            variant="noBorder"
          >
            <div className={css(styles.faqAnswer)}>
              Yes, we have a browser extension that allows you to save papers
              directly from your browser.
            </div>
          </CollapsibleCard>
          <hr className={css(styles.faqDivider)} />
          <CollapsibleCard
            title="Can I use Reference Manager on my phone?"
            isOpen={openFaq === 2}
            setIsOpen={() => handleFaqClick(2)}
            variant="noBorder"
          >
            <div className={css(styles.faqAnswer)}>
              Yes, you can access Reference Manager on your phone through your
              browser.
            </div>
          </CollapsibleCard>
          <hr className={css(styles.faqDivider)} />
          <CollapsibleCard
            title="What is ResearchCoin?"
            isOpen={openFaq === 4}
            setIsOpen={() => handleFaqClick(4)}
            variant="noBorder"
          >
            <div className={css(styles.faqAnswer)}>
              ResearchCoin (RSC) is a reward token anyone can earn by sharing,
              curating, and discussing academic science within ResearchHub.
              <br />
              <br />
              ResearchCoin empowers the people who dedicate their time & energy
              to building ResearchHub with additional influence over the type of
              content created within our community.
            </div>
          </CollapsibleCard>
        </div>
      </div>

      <div className={css(styles.blueSection)}>
        <div className={css(styles.section, styles.getStartedSection)}>
          <div className={css(styles.getStartedSubSection1)}>
            <div className={css(styles.getStartedTitle)}>
              Get started with Reference Manager today.
            </div>
            <div className={css(styles.getStartedDescription)}>
              Level up your organization and collaboration, and earn for
              contributing to open science.
            </div>
            <div className={css(styles.getStartedButtons)}>
              <Button
                variant="contained"
                label="Get Started"
                customButtonStyle={styles.heroButton}
                isLink={{
                  href: isLoggedIn
                    ? "/reference-manager"
                    : "/login?redirect=/reference-manager",
                }}
              />
              {/* <Button
                variant="contained"
                label="Get Browser Extension"
                customButtonStyle={styles.heroButton}
              /> */}
            </div>
          </div>
          <div className={css(styles.getStartedSubSection2)}>
            {!isMobileScreen && (
              <img
                src="/static/products/reference-manager-desktop.png"
                alt="ResearchHub"
                className={css(styles.getStartedImage)}
              />
            )}
          </div>
        </div>
      </div>

      <div className={css(styles.footer)}>
        <div className={css(styles.section, styles.footerSection)}>
          © 2023 ResearchHub. All rights reserved.
          <div className={css(styles.footerSocials)}>
            <a
              target="_blank"
              className={css(styles.socialLink)}
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
              className={css(styles.socialLink)}
              href="https://twitter.com/researchhub"
              rel="noreferrer noopener"
            >
              <div className={css(styles.social)}>
                <span className={css(styles.logo)}>
                  {<FontAwesomeIcon icon={faXTwitter}></FontAwesomeIcon>}
                </span>
              </div>
            </a>
            <a
              target="_blank"
              className={css(styles.socialLink)}
              href="https://github.com/ResearchHub"
            >
              <div className={css(styles.social)}>
                <span className={css(styles.logo)}>
                  {<FontAwesomeIcon icon={faGithub}></FontAwesomeIcon>}
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  section: {
    width: "100%",
    maxWidth: 1280,
    margin: "0 auto",
    background: "transparent",
    [`@media only screen and (max-width: ${breakpoints.bigDesktop.str})`]: {
      width: "calc(100% - 64px)",
    },
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      width: "calc(100% - 24px)",
    },
  },

  headerBackground: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: colors.NEW_BLUE(),
    paddingBottom: 200,
    [`@media only screen and (max-width: ${breakpoints.xlarge.str}) and (min-width: ${breakpoints.desktop.str})`]:
      {
        paddingBottom: 120,
      },
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      paddingBottom: 80,
    },
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      paddingBottom: 0,
      backgroundColor: "transparent",
    },
  },
  headerBackgroundMobile: {
    position: "absolute",
    top: 0,
    height: "110vh",
    width: "100%",
    backgroundColor: colors.NEW_BLUE(),
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      display: "block",
    },
  },
  topbar: {
    zIndex: 2,
    width: "calc(100% - 94px)",
    maxWidth: 1280,
    margin: "0 auto",
    padding: 48,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "transparent",
    [`@media only screen and (max-width: ${breakpoints.bigDesktop.str})`]: {
      padding: 32,
      width: "calc(100% - 64px)",
    },
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      padding: 16,
      width: "calc(100% - 32px)",
    },
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  loginBtn: {
    borderColor: colors.WHITE(),
    background: "none",
    color: colors.WHITE(),
  },
  publicBtn: {
    color: "white",
    border: "none",
    boxSizing: "border-box",
    padding: "6px 12px",
    height: 42,
    ":hover": {
      cursor: "pointer",
      backgroundColor: colors.WHITE(0.2),
    },
  },

  // hero
  heroContainer: {
    zIndex: 2,
    width: "100%",
    maxWidth: 1280,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 36,
    gap: 32,
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      flexDirection: "column",
      gap: 48,
      marginBottom: 80,
    },
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      flexDirection: "column",
      minHeight: "unset",
    },
  },
  heroLeft: {
    flex: 1.2,
    textAlign: "left",
    color: colors.WHITE(),
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      alignItems: "center",
      textAlign: "center",
    },
  },
  heroTag: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.2,
    color: colors.WHITE(0.5),
    textTransform: "uppercase",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 56,
    marginBottom: 24,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      fontSize: 48,
    },
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      marginBottom: 20,
      fontSize: 40,
    },
  },
  heroDescription: {
    fontSize: 18,
    lineHeight: 1.6,
    marginBottom: 32,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      maxWidth: 540,
      fontSize: 16,
      marginBottom: 24,
    },
  },
  heroButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      flexDirection: "column",
      width: "100%",
      maxWidth: 360,
      gap: 8,
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "84%",
    },
    [`@media only screen and (max-width: ${breakpoints.xxxsmall.str})`]: {
      width: "100%",
    },
  },
  heroButton: {
    backgroundColor: colors.WHITE(),
    color: colors.NEW_BLUE(),
    minWidth: 196,
    ":hover": {
      opacity: 0.8,
    },
  },
  heroImageSection: {
    flex: 2,
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
  },
  heroImage: {
    width: "100%",
    maxWidth: 1280,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      border: `2px solid ${colors.GREY_BORDER}`,
      borderRadius: 12,
      width: "84%",
    },
  },

  // cards
  cards: {
    zIndex: 2,
    marginTop: 120,
    marginBottom: 120,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      flexWrap: "wrap",
    },
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      gap: 16,
      marginTop: 100,
      marginBottom: 100,
    },
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: colors.NEW_BLUE(1),
    color: colors.WHITE(),
    fontSize: 32,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 256,
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "100%",
      maxWidth: 360,
      minHeight: 124,
    },
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 500,
    textAlign: "center",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 18,
    },
  },
  cardDescription: {
    fontSize: 16,
    lineHeight: 1.4,
    marginTop: 12,
    color: colors.WHITE(0.6),
    textAlign: "center",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 14,
    },
  },
  rhIconStyle: {
    fontSize: 32,
    marginBottom: 16,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 24,
    },
  },

  lightGrey: {
    backgroundColor: colors.LIGHT_GRAY_BACKGROUND(1),
  },

  // explore
  exploreSection: {
    display: "flex",
    flexDirection: "row",
    gap: 96,
    marginTop: 120,
    marginBottom: 120,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      gap: 64,
    },
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      flexDirection: "column-reverse",
      alignItems: "center",
      gap: 32,
      marginTop: 80,
      marginBottom: 80,
    },
  },
  exploreSection2: {
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      flexDirection: "column",
    },
  },
  exploreImageSection: {
    flex: 1.2,
  },
  exploreContentSection: {
    flex: 1,
  },
  exploreImage: {
    borderRadius: 8,
    objectFit: "fit",
    width: "100%",
    height: "100%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      maxWidth: 512,
    },
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      maxWidth: "unset",
      maxHeight: 256,
    },
  },
  exploreTag: {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 1.2,
    color: colors.NEW_BLUE(),
    textTransform: "uppercase",
    marginTop: 28,
    marginBottom: 28,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      marginBottom: 24,
    },
  },
  exploreTitle: {
    textAlign: "left",
    fontSize: 48,
    marginBottom: 24,
    fontWeight: 500,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      fontSize: 40,
    },
  },
  exploreDescription: {
    fontSize: 18,
    lineHeight: 1.6,
    color: colors.MEDIUM_GREY2(),
    marginBottom: 40,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 16,
      marginBottom: 24,
    },
  },

  // checklist
  checklist: {
    marginTop: 40,
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      marginTop: 24,
    },
  },
  checklistItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    fontSize: 18,
    lineHeight: 1.4,
    marginBottom: 24,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 16,
      marginBottom: 20,
    },
  },

  // faq
  faqSection: {
    marginTop: 160,
    marginBottom: 200,
    maxWidth: 624,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      marginTop: 80,
      marginBottom: 120,
      maxWidth: "unset",
    },
  },
  faqTitle: {
    fontSize: 40,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 40,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 32,
    },
  },
  faqAnswer: {
    fontSize: 16,
    color: colors.MEDIUM_GREY2(),
    lineHeight: 1.6,
    marginBottom: 24,
  },
  faqDivider: {
    margin: "0",
  },

  // last section
  blueSection: {
    backgroundColor: colors.NEW_BLUE(),
    width: "100%",
  },
  getStartedSection: {
    marginTop: 120,
    marginBottom: 120,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 64,
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      flexDirection: "column-reverse",
      gap: 24,
      transform: "translateY(-180px)",
      marginBottom: -60,
    },
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      marginTop: 64,
      marginBottom: 80,
      transform: "translateY(0px)",
    },
  },
  getStartedSubSection1: {
    flex: 1,
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  },
  getStartedSubSection2: {
    flex: 1.25,
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      flex: 1,
    },
  },
  getStartedTitle: {
    fontSize: 40,
    fontWeight: 700,
    textAlign: "left",
    color: colors.WHITE(),
    marginTop: 40,
    marginBottom: 32,
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      textAlign: "center",
    },
  },
  getStartedDescription: {
    fontSize: 18,
    lineHeight: 1.6,
    color: colors.WHITE(0.6),
    marginBottom: 40,
    maxWidth: 624,
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      textAlign: "center",
    },
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 16,
    },
  },
  getStartedButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    marginBottom: 64,
    justifyContent: "flex-start",
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      justifyContent: "center",
    },
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      flexDirection: "column",
      width: "100%",
      maxWidth: 360,
      gap: 8,
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "84%",
    },
    [`@media only screen and (max-width: ${breakpoints.xxxsmall.str})`]: {
      width: "100%",
    },
  },
  getStartedImage: {
    objectFit: "cover",
    objectPosition: "top",
    borderRadius: 8,
    border: `2px solid ${colors.GREY_BORDER}`,
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      maxWidth: "unset",
    },
  },

  // footer
  footer: {
    backgroundColor: colors.NEW_BLUE(),
    color: colors.WHITE(),
    paddingTop: 48,
    paddingBottom: 48,
    borderTop: `solid 1px ${colors.WHITE()}`,
  },
  footerSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      flexDirection: "column-reverse",
      alignItems: "center",
      gap: 16,
    },
  },
  socialLink: {
    textDecoration: "none",
  },
  social: {
    height: 36,
    width: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    ":hover": {
      cursor: "pointer",
      opacity: 0.8,
    },
  },
  footerSocials: {
    display: "flex",
    gap: 16,
  },
  legalFooter: {
    display: "flex",
  },
  logo: {
    color: colors.WHITE(),
    fontSize: 20,
  },
});

export default ProductReferenceManager;
