import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons";

const accordionItems = [
  {
    id: "aims",
    title: "Aims & Scope",
    content: `ResearchHub Journal welcomes submissions across all scientific disciplines, with a particular focus on:
    • Agricultural and Biological Sciences
    • Biochemistry, Genetics and Molecular Biology
    • Immunology and Microbiology
    • Neuroscience
    • Pharmacology, Toxicology and Pharmaceutics
    • Reproducible research with open data and code

    Our mission is to accelerate scientific discovery through open science practices and innovative peer review.`
  },
  {
    id: "timeline",
    title: "How long will it take?",
    content: `Our streamlined review process follows this timeline:
    • Initial editorial decision: 1-2 business days
    • Peer review completion: 7-9 days
    • Final decision: Within 14 days of submission
    • Publication: Immediate upon acceptance
    
    We maintain these timelines through our innovative peer review incentive structure and dedicated editorial team.`
  },
  {
    id: "reviewers",
    title: "Our peer reviewers",
    content: `Our peer reviewers are:
    • Active researchers with relevant expertise
    • Compensated $150 per high-quality review
    • Required to complete reviews within 7 days
    • Selected based on publication history and expertise
    
    We maintain a diverse pool of qualified reviewers across disciplines to ensure thorough and timely evaluation of submissions.`
  },
  {
    id: "guidelines",
    title: "Peer reviewer guidelines",
    content: `Reviewers are expected to:
    • Evaluate scientific merit and methodology
    • Assess reproducibility of methods and results
    • Provide constructive feedback for improvement
    • Declare any potential conflicts of interest
    • Complete reviews using our structured review template
    
    Reviews should be thorough, constructive, and actionable.`
  },
  {
    id: "payment",
    title: "Why do we pay peer reviewers?",
    content: `We pay peer reviewers because:
    • Peer review is valuable intellectual work
    • Financial incentives ensure timely reviews
    • It promotes higher quality feedback
    • It recognizes reviewer expertise and time
    
    This model helps maintain our rapid review timeline while ensuring high-quality peer review.`
  },
  {
    id: "dois",
    title: "DOI's for preprints, papers, and peer reviews",
    content: `We provide DOIs for:
    • Preprints upon submission
    • Published papers upon acceptance
    • Peer reviews (if reviewer opts for open review)
    
    This ensures all research outputs are citable and properly credited, promoting transparency in the scientific process.`
  },
  {
    id: "licenses",
    title: "Licenses & Open Access by default",
    content: `All content is published under open licenses:
    • Research articles: CC-BY 4.0
    • Data: CC0 or CC-BY
    • Code: MIT, Apache, or similar open source license
    
    This ensures maximum reusability while maintaining proper attribution.`
  },
  {
    id: "author-guidelines",
    title: "Author guidelines",
    content: `Authors should ensure:
    • Clear and concise writing
    • Complete methodology description
    • Open data and code availability
    • Proper citation of prior work
    • Adherence to reporting standards
    
    Detailed submission guidelines are available in our submission template.`
  },
  {
    id: "submission-template",
    title: "Submission template",
    content: `Our submission template includes:
    • Structured abstract format
    • Methods checklist
    • Data availability statement
    • Code availability statement
    • Author contribution statement
    • Conflict of interest declaration
    
    Download our template to ensure your submission meets all requirements.`
  },
];

export const HowItWorks = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  // Add effect to listen for external state changes
  useEffect(() => {
    const handleSetAccordionState = (event: any) => {
      if (event.detail && event.detail.id) {
        // Force the accordion item open regardless of current state
        setOpenItem(event.detail.id);
      }
    };

    // Listen for the custom event
    window.addEventListener('setAccordionState', handleSetAccordionState);
    
    return () => {
      window.removeEventListener('setAccordionState', handleSetAccordionState);
    };
  }, []); // Empty dependency array since we don't need to re-create the listener

  return (
    <div id="how-it-works" className={css(styles.container)}>
      <div className={css(styles.content)}>
        <h2 className={css(styles.heading)}>How it Works</h2>
        <div className={css(styles.accordion)}>
          {accordionItems.map((item) => (
            <div key={item.id} className={css(styles.accordionItem)}>
              <button
                className={css(styles.trigger)}
                onClick={() => setOpenItem(openItem === item.id ? null : item.id)}
              >
                {item.title}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={css(styles.icon, openItem === item.id && styles.iconOpen)}
                />
              </button>
              {openItem === item.id && (
                <div className={css(styles.accordionContent)}>
                  <div className={css(styles.contentText)}>
                    {item.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: "0px 28px",
  },
  content: {
    width: 800,
    margin: "0 auto",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
  },
  heading: {
    fontSize: 32,
    fontWeight: 600,
    textOverflow: "ellipsis",
    marginBottom: 32,
    textAlign: "center",
    color: colors.BLACK(0.9),
    letterSpacing: "-0.02em",
  },
  accordion: {
    maxWidth: 800,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 12,
    border: `1px solid ${colors.GREY_LINE(0.5)}`,
    overflow: "hidden",
  },
  accordionItem: {
    borderBottom: `1px solid ${colors.GREY_LINE(0.35)}`,
    ":last-child": {
      borderBottom: "none",
    },
  },
  trigger: {
    width: "100%",
    padding: "24px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 600,
    color: colors.BLACK(0.9),
    transition: "all 0.2s ease",
    ":hover": {
      color: colors.NEW_BLUE(),
      background: colors.BLUE(0.02),
    },
  },
  icon: {
    transition: "transform 0.2s ease",
    color: colors.BLACK(0.5),
    fontSize: 14,
    marginLeft: 16,
  },
  iconOpen: {
    transform: "rotate(180deg)",
    color: colors.NEW_BLUE(),
  },
  accordionContent: {
    padding: "0 32px 24px",
    background: colors.BLUE(0.02),
  },
  contentText: {
    color: colors.BLACK(0.7),
    fontSize: 15,
    lineHeight: 1.6,
    whiteSpace: "pre-line",
    "& ul": {
      paddingLeft: 20,
      marginTop: 8,
    },
    "& li": {
      marginBottom: 4,
    },
  },
});
