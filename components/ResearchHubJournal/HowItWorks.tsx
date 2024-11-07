import styles from "./HowItWorks.module.css";
import { useState, useEffect, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faArrowUpRightFromSquare } from "@fortawesome/pro-solid-svg-icons";

const accordionItems = [
  {
    id: "aims",
    title: "Aims and scope",
    content: (
      <>
        <p className={styles.contentText}>ResearchHub Journal welcomes submissions across all scientific disciplines, with a particular focus on:</p>
        <ul>
          <li className={styles.contentText}>Biological and Biomedical Sciences</li>
          <li className={styles.contentText}>Biochemistry, Genetics and Molecular Biology</li>
          <li className={styles.contentText}>Immunology and Microbiology</li>
          <li className={styles.contentText}>Neuroscience</li>
          <li className={styles.contentText}>Pharmacology, Toxicology and Pharmaceutics</li>
          <li className={styles.contentText}>Reproducible research with open data and code</li>
        </ul>
        <p className={styles.contentText}>Our mission is to accelerate scientific discovery through open science practices and innovative peer review.</p>
      </>
    )
  },
  {
    id: "publication-types",
    title: "Article types",
    content: (
      <>
        <p className={styles.contentText}>We accept the following types of submissions:</p>

        <p className={styles.contentText}><strong>Original Research Articles</strong></p>
        <ul>
          <li className={styles.contentText}>Full research papers presenting novel findings</li>
          <li className={styles.contentText}>Complete methodology and results required</li>
          <li className={styles.contentText}>No length restrictions, but clarity and conciseness valued</li>
        </ul>

        <p className={styles.contentText}><strong>Short Communications</strong></p>
        <ul>
          <li className={styles.contentText}>Brief reports of significant findings</li>
          <li className={styles.contentText}>Maximum 3,000 words</li>
          <li className={styles.contentText}>Ideal for time-sensitive or preliminary results</li>
        </ul>

        <p className={styles.contentText}><strong>Case Studies</strong></p>
        <ul>
          <li className={styles.contentText}>Detailed examination of specific real-world contexts</li>
          <li className={styles.contentText}>Must include clear implications and lessons learned</li>
          <li className={styles.contentText}>Structured methodology and analysis required</li>
        </ul>

        <p className={styles.contentText}><strong>Review Articles (Invitation Only)</strong></p>
        <ul>
          <li className={styles.contentText}>Comprehensive analysis of existing literature</li>
          <li className={styles.contentText}>Must provide novel synthesis or perspective</li>
          <li className={styles.contentText}>By invitation only - contact Editorial Board if interested</li>
          <li className={styles.contentText}>Systematic reviews particularly welcomed</li>
        </ul>
      </>
    )
  },
  {
    id: "timeline",
    title: "Timeline",
    content: (
      <>
        <p className={styles.contentText}>Our streamlined review process follows this timeline following submission:</p>
        <ul>
          <li className={styles.contentText}>Immediate: Preprint available</li>
          <li className={styles.contentText}>14 days: Peer review completion</li>
          <li className={styles.contentText}>21 days: Publication decision</li>
        </ul>
        <p className={styles.contentText}>We maintain these timelines through our innovative peer review incentive structure and dedicated editorial team.</p>
      </>
    )
  },
  {
    id: "author-guidelines",
    title: "Author guidelines",
    content: (
      <>
        <p className={styles.contentText}>Authors should ensure:</p>
        <ul>
          <li className={styles.contentText}>Clear and concise writing</li>
          <li className={styles.contentText}>Complete methodology description</li>
          <li className={styles.contentText}>Open data and code availability</li>
          <li className={styles.contentText}>Proper citation of prior work</li>
          <li className={styles.contentText}>Adherence to reporting standards</li>
        </ul>
        <p className={styles.contentText}>For specific guidelines, please consult our author guidelines document, which also contains a submission template. Contact the editorial team if you have any questions.</p>
        <div className={styles.reviewerCta}>
          <p style={{ margin: 0, marginBottom: 12, fontSize: 16, fontWeight: 500 }}>
          </p>
          <a 
            href="https://docs.google.com/document/d/1a3WrTSDOCvWXxWetbPn-TDav56Y7EFwpyzK5B8Ll3Io/edit?tab=t.0" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.ctaButton}
          >
            View Author Guidelines
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className={styles.buttonIcon} />
          </a>
        </div>
      </>
    )
  },
  {
    id: "guidelines",
    title: "Review guidelines",
    content: (
      <>
        <p className={styles.contentText}>Reviewers are expected to:</p>
          <ul>
            <li className={styles.contentText}>Evaluate scientific merit and methodology</li>
            <li className={styles.contentText}>Assess reproducibility of methods and results</li>
            <li className={styles.contentText}>Provide constructive feedback for improvement</li>
            <li className={styles.contentText}>Declare any potential conflicts of interest</li>
            <li className={styles.contentText}>Complete reviews using our{' '}
              <a 
                href="https://drive.google.com/file/d/1t7NpL39ghnBY9ImWjuunbc6gzmzrhqUt/view?ref=blog.researchhub.foundation" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.link}
              >
                structured review template
              </a>
            </li>
          </ul>
          <p className={styles.contentText}>Reviews should be thorough, constructive, and actionable. Please contact a member of the editorial team if you believe your peer reviews did not meet these standards.</p>
      </>
    )
  },
  {
    id: "reviewers",
    title: "Peer reviewers",
    content: (
      <>
        <p className={styles.contentText}>Our peer reviewers are:</p>
        <ul>
          <li className={styles.contentText}>Researchers with strong publication history and relevant expertise</li>
          <li className={styles.contentText}>Compensated $150 per high-quality peer review</li>
          <li className={styles.contentText}>Required to complete reviews within 14 days</li>
          <li className={styles.contentText}>Provide constructive and actionable feedback using our{' '}
              <a 
                href="https://drive.google.com/file/d/1t7NpL39ghnBY9ImWjuunbc6gzmzrhqUt/view?ref=blog.researchhub.foundation" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.link}
              >
                structured review template
              </a>
            </li>
        </ul>
        <p className={styles.contentText}>We strive to maintain a diverse pool of qualified reviewers across disciplines to ensure thorough and timely evaluation of submissions. We choose to pay peer reviewers to share their reviews openly because:</p>
        <ul>
          <li className={styles.contentText}>Peer review is valuable intellectual work</li>
          <li className={styles.contentText}>Financial incentives ensure timely reviews</li>
          <li className={styles.contentText}>Open peer reviews promote higher quality, constructive feedback</li>
        </ul>
        <p className={styles.contentText}>This model helps maintain our rapid review timeline while ensuring high-quality peer review.</p>
        
        <div className={styles.reviewerCta}>
          <p style={{ margin: 0, marginBottom: 12, fontSize: 16, fontWeight: 500 }}>
          </p>
          <a 
            href="https://airtable.com/apptLQP8XMy1kaiID/pag5tkxt0V18Xobje/form" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.ctaButton}
          >
            Apply to be a peer reviewer
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className={styles.buttonIcon} />
          </a>
        </div>
      </>
    )
  },
  {
    id: "apc",
    title: "Article processing charge",
    content: (
      <>
        <p className={styles.contentText}>Our pricing structure is designed to support quality peer review while maintaining accessibility:</p>
        
        <p className={styles.contentText}><strong>Preprint Submission - Free</strong></p>
        <ul>
          <li className={styles.contentText}>Immediate preprint availability</li>
          <li className={styles.contentText}>DOI assignment</li>
          <li className={styles.contentText}>Community engagement (upvotes, comments, tips)</li>
          <li className={styles.contentText}>ResearchCoin rewards eligibility</li>
        </ul>

        <p className={styles.contentText}><strong>Peer-Reviewed Publication - $1,000</strong></p>
        <ul>
          <li className={styles.contentText}>All preprint benefits included</li>
          <li className={styles.contentText}>2+ expert open peer reviews within 14 days</li>
          <li className={styles.contentText}>21 days to publication decision</li>
          <li className={styles.contentText}>Immediate publication in the ResearchHub journal upon acceptance</li>
        </ul>

        <p className={styles.contentText}>The APC supports our innovative peer review system. We compensate expert reviewers for their valuable contributions especially in the open. Authors receive comprehensive feedback to improve their work regardless of the final editorial decision, enhancing the quality and visibility of their research.</p>
      </>
    )
  },
  {
    id: "dois",
    title: "DOI's for preprints, papers, and peer reviews",
    content: (
      <>
        <p className={styles.contentText}>We leverage <a href="https://www.crossref.org/services/content-registration/#:~:text=When%20you%20join%20Crossref%20as,via%20machine%20or%20human%20interfaces." target="_blank" rel="noopener noreferrer">CrossRef</a> to provide DOIs for:</p>
        <ul>
          <li className={styles.contentText}>Preprints upon submission</li>
          <li className={styles.contentText}>Peer reviews</li>
          <li className={styles.contentText}>Published papers upon acceptance</li>
        </ul>
        <p className={styles.contentText}>This ensures all research outputs are citable and properly credited, promoting transparency in the scientific process.</p>
      </>
    )
  },
  {
    id: "licenses",
    title: "Open access policies",
    content: (
      <>
        <p className={styles.contentText}>All content is published under open licenses:</p>
        <ul>
          <li className={styles.contentText}>Manuscripts: CC-BY 4.0</li>
        </ul>
        <p className={styles.contentText}>Additionally, we highly recommend leveraging existing repositories such as Zenodo to provide open access to data and GitHub to provide open source software access alongside your publication. </p>
        <ul>
          <li className={styles.contentText}>Data: CC0 or CC-BY</li>
          <li className={styles.contentText}>Code: MIT, Apache, or similar open source license</li>
        </ul>
        <p className={styles.contentText}>This ensures maximum reusability and increases the likelihood of your work replicating in the future, while maintaining proper attribution.</p>
      </>
    )
  }
];

export const HowItWorks = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

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
    <div id="how-it-works" className={styles.howItWorksContainer}>
      <div className={styles.howItWorksContent}>
        <h2 className={styles.howItWorksHeading}>How it Works</h2>
        <div className={styles.accordion}>
          {accordionElements}
        </div>
      </div>
    </div>
  );
};

const AccordionItem = ({ item, isOpen, onToggle }) => (
  <div className={styles.accordionItem}>
    <button
      className={styles.trigger}
      onClick={onToggle}
    >
      {item.title}
      <FontAwesomeIcon
        icon={faChevronDown}
        className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}
      />
    </button>
    {isOpen && (
      <div className={styles.accordionContent}>
        <div className={styles.contentText}>
          {item.content}
        </div>
      </div>
    )}
  </div>
);
