import { css, StyleSheet } from "aphrodite";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
} from "@fortawesome/pro-solid-svg-icons";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

const BountyInfoSection = ({ }) => {

  const [openInfoSections, setOpenInfoSections] = useState<string[]>([]);

  const toggleInfoSection = (section: string) => {
    if (openInfoSections.includes(section)) {
      setOpenInfoSections(openInfoSections.filter((s) => s !== section));
    } else {
      setOpenInfoSections([...openInfoSections, section]);
    }
  };

  return (
    <div className={css(styles.info, styles.infoSection)}>
      <div className={css(styles.aboutRSC, styles.infoBlock)}>
        <div className={css(styles.infoLabel)}>
          <ResearchCoinIcon version={4} height={25} width={25} />
          About ResearchCoin
        </div>
        <div className={css(styles.aboutRSCContent)}>
          ResearchCoin (RSC) is a digital currency that aims to incentivize
          individuals that contribute to the scientific ecosystem. Currently,
          anyone can earn RSC by sharing, curating, and peer reviewing
          scientific research on ResearchHub.
        </div>
      </div>

      <div className={css(styles.doingThingsWithRSC, styles.infoBlock)}>
        <div className={css(styles.infoLabel)}>
          Doing things with ResearchCoin
        </div>
        <div className={css(styles.collapsable)}>
          <div
            className={css(styles.collapsableHeader)}
            onClick={() => toggleInfoSection("create-bounty")}
          >
            <div className={css(styles.collapsableHeaderTitle)}>
              <div>Create a grant</div>
              <div>
                {openInfoSections.includes("create-bounty") ? (
                  <FontAwesomeIcon icon={faAngleDown} />
                ) : (
                  <FontAwesomeIcon icon={faAngleRight} />
                )}{" "}
              </div>
            </div>
          </div>
          <div
            className={css(
              styles.collapsableContent,
              openInfoSections.includes("create-bounty") &&
              styles.collapsableContentOpen
            )}
          >
            <div>
              RSC empowers the Grant system used on ResearchHub, connecting
              researchers with tailored opportunities specific to their
              quantifiable expertise. Users can create grants to engage
              expert researchers for specific tasks, from processing datasets
              to conducting literature reviews or conducting paid peer review.
              This flexible system facilitates targeted collaborations,
              enabling efficient knowledge exchange and task completion within
              the scientific community.
            </div>
          </div>
        </div>
        <div className={css(styles.collapsable)}>
          <div
            className={css(styles.collapsableHeader)}
            onClick={() => toggleInfoSection("reward-contributions")}
          >
            <div className={css(styles.collapsableHeaderTitle)}>
              <div>Reward quality contributions</div>
              <div>
                <FontAwesomeIcon icon={faAngleRight} />
              </div>
            </div>
          </div>
          <div
            className={css(
              styles.collapsableContent,
              openInfoSections.includes("reward-contributions") &&
              styles.collapsableContentOpen
            )}
          >
            <div>
              RSC serves as the underlying incentive layer for the ResearchHub
              ecosystem, providing targeted incentives for individual actions
              (e.g. peer reviews) and broader research goals (e.g. increasing
              reproducibility). Importantly, the reward algorithm is governed
              entirely by the community of researchers. This bottom-up
              approach ensures that those with the most relevant expertise—the
              researchers themselves—determine what should be incentivized in
              their fields.
            </div>
          </div>
        </div>
        <div className={css(styles.collapsable)}>
          <div
            className={css(styles.collapsableHeader)}
            onClick={() => toggleInfoSection("fund-open-science")}
          >
            <div className={css(styles.collapsableHeaderTitle)}>
              <div>Fund open science</div>
              <div>
                {openInfoSections.includes("fund-open-science") ? (
                  <FontAwesomeIcon icon={faAngleDown} />
                ) : (
                  <FontAwesomeIcon icon={faAngleRight} />
                )}{" "}
              </div>
            </div>
          </div>
          <div
            className={css(
              styles.collapsableContent,
              openInfoSections.includes("fund-open-science") &&
              styles.collapsableContentOpen
            )}
          >
            <div>
              RSC enables the ResearchHub community to participate in
              scientific funding. By leveraging preregistrations (i.e. open
              access grant applications), we streamline the process of
              proposing and funding open research projects. This approach
              incentivizes frequent updates, reduces administrative overhead,
              and promotes transparency—ultimately fostering more reproducible
              and collaborative science.
            </div>
          </div>
        </div>
      </div>

      <div className={css(styles.doingThingsWithRSC, styles.infoBlock)}>
        <div className={css(styles.infoLabel)}>Earning ResearchCoin</div>
        <div className={css(styles.collapsable)}>
          <div
            className={css(styles.collapsableHeader)}
            onClick={() => toggleInfoSection("peer-review")}
          >
            <div className={css(styles.collapsableHeaderTitle)}>
              <div>Share a peer review</div>
              <div>
                {openInfoSections.includes("peer-review") ? (
                  <FontAwesomeIcon icon={faAngleDown} />
                ) : (
                  <FontAwesomeIcon icon={faAngleRight} />
                )}{" "}
              </div>
            </div>
          </div>
          <div
            className={css(
              styles.collapsableContent,
              openInfoSections.includes("peer-review") &&
              styles.collapsableContentOpen
            )}
          >
            <div>
              Researchers can earn RSC by peer reviewing preprints on
              ResearchHub. Once you verify your identity, we will surface peer
              review opportunities to you here.
            </div>
          </div>
        </div>
        <div className={css(styles.collapsable)}>
          <div
            className={css(styles.collapsableHeader)}
            onClick={() => toggleInfoSection("answer-bounty")}
          >
            <div className={css(styles.collapsableHeaderTitle)}>
              <div>Answer a grant</div>
              <div>
                {openInfoSections.includes("answer-bounty") ? (
                  <FontAwesomeIcon icon={faAngleDown} />
                ) : (
                  <FontAwesomeIcon icon={faAngleRight} />
                )}{" "}
              </div>
            </div>
          </div>
          <div
            className={css(
              styles.collapsableContent,
              openInfoSections.includes("answer-bounty") &&
              styles.collapsableContentOpen
            )}
          >
            <div>
              Researchers can earn RSC by answering grants on
              ResearchHub. These tasks range from peer-reviewing preprints from
              platforms like bioRxiv and arXiv, to providing specialized
              research troubleshooting and data processing. This flexible
              system allows researchers to monetize their expertise, offering
              valuable assistance to grant creators while receiving fair
              compensation.
            </div>
          </div>
        </div>
        <div className={css(styles.collapsable)}>
          <div
            className={css(styles.collapsableHeader)}
            onClick={() => toggleInfoSection("reproducible")}
          >
            <div className={css(styles.collapsableHeaderTitle)}>
              <div>Do reproducible research</div>
              <div>
                {openInfoSections.includes("reproducible") ? (
                  <FontAwesomeIcon icon={faAngleDown} />
                ) : (
                  <FontAwesomeIcon icon={faAngleRight} />
                )}{" "}
              </div>
            </div>
          </div>
          <div
            className={css(
              styles.collapsableContent,
              openInfoSections.includes("reproducible") &&
              styles.collapsableContentOpen
            )}
          >
            <div>
              Researchers can earn RSC by completing grants on
              ResearchHub.These tasks range from peer-reviewing preprints from
              platforms like bioRxiv and arXiv, to providing specialized
              research troubleshooting and data processing. This flexible
              system allows researchers to monetize their expertise, offering
              valuable assistance to grant creators while receiving fair
              compensation.
            </div>
          </div>
        </div>
        <div className={css(styles.collapsable)}>
          <div
            className={css(styles.collapsableHeader)}
            onClick={() => toggleInfoSection("upvotes")}
          >
            <div className={css(styles.collapsableHeaderTitle)}>
              <div>Get upvotes on your content</div>
              <div>
                {openInfoSections.includes("upvotes") ? (
                  <FontAwesomeIcon icon={faAngleDown} />
                ) : (
                  <FontAwesomeIcon icon={faAngleRight} />
                )}{" "}
              </div>
            </div>
          </div>
          <div
            className={css(
              styles.collapsableContent,
              openInfoSections.includes("upvotes") &&
              styles.collapsableContentOpen
            )}
          >
            <div>
              Researchers also earn RSC by contributing to open scientific
              discourse on ResearchHub, by receiving upvotes on their
              comments, posts, peer reviews, and papers. We recognize that
              scientific progress often stems from informal exchanges and
              critical discussions. We want to incentivize users to have these
              conversations in the open, as we believe this leads to a more
              innovative and dynamic research ecosystem.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  info: {
    maxWidth: 320,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  infoSection: {},
  aboutRSC: {
    border: `1px solid ${colors.BLACK(0.2)}`,
    borderRadius: 4,
  },
  infoBlock: {
    border: `1px solid ${colors.BLACK(0.2)}`,
    borderRadius: 8,
    marginTop: 30,
    backgroundColor: "rgb(255, 255, 255)",
    ":first-child": {
      marginTop: 0,
    },
  },
  infoLabel: {
    fontWeight: 500,
    padding: 15,
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 18,
    borderBottom: `1px solid ${colors.BLACK(0.2)}`,
  },
  aboutRSCContent: {
    padding: 15,
    fontSize: 15,
    lineHeight: "20px",
  },
  doingThingsWithRSC: {},
  collapsable: {
    // borderBottom: `1px solid ${colors.BLACK(0.2)}`,
  },
  collapsableHeader: {
    userSelect: "none",
    padding: 15,
    ":hover": {
      background: colors.LIGHTER_GREY(1.0),
      cursor: "pointer",
    },
  },
  collapsableHeaderTitle: {
    justifyContent: "space-between",
    display: "flex",
  },
  collapsableContent: {
    display: "none",
  },
  collapsableContentOpen: {
    display: "block",
    padding: 15,
    background: colors.LIGHTER_GREY(0.3),
    ":hover": {
      background: colors.LIGHTER_GREY(0.3),
    },
    color: colors.BLACK(0.9),
    fontSize: 14,
  },
})

export default BountyInfoSection;
