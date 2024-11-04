import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { useState, useEffect, useCallback, useMemo } from "react";
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
  {
    id: "publication-types",
    title: "Publication Types",
    content: `We accept the following types of submissions:

    Original Research Articles
    • Full research papers presenting novel findings
    • Complete methodology and results required
    • No length restrictions, but clarity and conciseness valued
    
    Short Communications
    • Brief reports of significant findings
    • Maximum 3,000 words
    • Ideal for time-sensitive or preliminary results
    
    Case Studies
    • Detailed examination of specific real-world contexts
    • Must include clear implications and lessons learned
    • Structured methodology and analysis required
    
    Review Articles (Invitation Only)
    • Comprehensive analysis of existing literature
    • Must provide novel synthesis or perspective
    • By invitation only - contact Editorial Board if interested
    • Systematic reviews particularly welcomed`,
  },
];

export const HowItWorks = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  // Memoize event handler
  const handleSetAccordionState = useCallback((event: any) => {
    if (event.detail?.id) {
      setOpenItem(event.detail.id);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('setAccordionState', handleSetAccordionState);
    return () => {
      window.removeEventListener('setAccordionState', handleSetAccordionState);
    };
  }, [handleSetAccordionState]);

  // Memoize accordion items to prevent unnecessary re-renders
  const accordionElements = useMemo(() => 
    accordionItems.map((item) => (
      <AccordionItem 
        key={item.id}
        item={item}
        isOpen={openItem === item.id}
        onToggle={() => setOpenItem(openItem === item.id ? null : item.id)}
      />
    )), [openItem]);

  return (
    <div id="how-it-works" className={css(styles.container)}>
      <div className={css(styles.content)}>
        <h2 className={css(styles.heading)}>How it Works</h2>
        <div className={css(styles.accordion)}>
          {accordionElements}
        </div>
      </div>
    </div>
  );
};

// 2. Split accordion item into separate component
const AccordionItem = ({ item, isOpen, onToggle }) => (
  <div className={css(styles.accordionItem)}>
    <button
      className={css(styles.trigger)}
      onClick={onToggle}
    >
      {item.title}
      <FontAwesomeIcon
        icon={faChevronDown}
        className={css(styles.icon, isOpen && styles.iconOpen)}
      />
    </button>
    {isOpen && (
      <div className={css(styles.accordionContent)}>
        <div className={css(styles.contentText)}>
          {item.content}
        </div>
      </div>
    )}
  </div>
);

const styles = StyleSheet.create({
  container: {
    padding: "0px 28px",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: "0px 16px",
    },
  },
  content: {
    width: 800,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 28,
      marginBottom: 24,
      padding: "0 16px",
    },
  },
  accordion: {
    maxWidth: 800,
    width: "100%",
    margin: "0 auto",
    background: "#fff",
    borderRadius: 12,
    border: `1px solid ${colors.GREY_LINE(0.5)}`,
    overflow: "hidden",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      maxWidth: 400,
      width: "90%",
      minWidth: 280,
    },
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
    textAlign: "left",
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: "20px 24px",
      fontSize: 16,
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: "0 24px 20px",
    },
  },
  contentText: {
    color: colors.BLACK(0.7),
    fontSize: 15,
    lineHeight: 1.6,
    whiteSpace: "pre-line",
    textAlign: "left",
    "& ul": {
      paddingLeft: 20,
      marginTop: 8,
    },
    "& li": {
      marginBottom: 4,
      textAlign: "left",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 14,
    },
  },
});
