import { css, StyleSheet } from "aphrodite";
import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/router';
import FeedCard from "~/components/Author/Tabs/FeedCard";
import { breakpoints } from "~/config/themes/screen";
import colors from "~/config/themes/colors";
import JournalLayout from "~/components/ResearchHubJournal/JournalLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faFile, faComments, faFire, faBolt, faArrowUp, faChevronDown } from "@fortawesome/pro-solid-svg-icons";

export default function PublishedPage() {
  const [activeSort, setActiveSort] = useState("trending");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2024");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mock data for layout purposes
  const mockPapers = [
    {
      id: 1,
      title: "Epidemiological Study and Analysis of Factors Related to Skin Lesions",
      authors: [{ firstName: "Jing-Yi", lastName: "Hu" }],
      abstract: "Latest research on epidemiological factors affecting skin conditions...",
      created_date: "2024-03-15",
    },
    // Add 2-3 more mock papers...
  ];

  const handleEarlySubmit = () => {
    // TODO: Implement toast notification
    console.log("Early submission recorded");
  };

  const sortOptions = [
    { id: "trending", label: "Trending", icon: faFire },
    { id: "newest", label: "Newest", icon: faBolt },
    { id: "most-discussed", label: "Most Discussed", icon: faComments },
    { id: "most-upvoted", label: "Most Upvoted", icon: faArrowUp }
  ];

  const activeSortOption = sortOptions.find(option => option.id === activeSort);

  return (
    <JournalLayout>
      <div className={css(styles.container)}>
        <div className={css(styles.mainContent)}>
          {/* Left content area */}
          <div className={css(styles.feedSection)}>
            <div className={css(styles.header)}>
              <h1 className={css(styles.title)}>ResearchHub Journal (Published)</h1>
              <p className={css(styles.description)}>
                Provides preprints and publications in biological sciences, including subfields like neuroscience, genomics, and physiology. We incentivize peer reviewers to provide feedback in the open because we believe that science is best served by open and transparent communication.
              </p>
              <div className={css(styles.statsRow)}>
                <div className={css(styles.stat)}>
                  <FontAwesomeIcon icon={faFile} className={css(styles.statIcon)} />
                  <span>0 Papers</span>
                </div>
                <div className={css(styles.stat)}>
                  <FontAwesomeIcon icon={faComments} className={css(styles.statIcon)} />
                  <span>0 Discussions</span>
                </div>
              </div>
              <div className={css(styles.divider)} />
              <div className={css(styles.filterRow)}>
                <div ref={dropdownRef} className={css(styles.dropdownContainer)}>
                  <button 
                    className={css(styles.dropdownTrigger)}
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  >
                    <FontAwesomeIcon 
                      icon={activeSortOption?.icon} 
                      className={css(styles.dropdownIcon)} 
                    />
                    {activeSortOption?.label}
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={css(styles.chevron, isSortDropdownOpen && styles.chevronOpen)} 
                    />
                  </button>
                  
                  {isSortDropdownOpen && (
                    <div className={css(styles.dropdownMenu)}>
                      {sortOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setActiveSort(option.id);
                            setIsSortDropdownOpen(false);
                          }}
                          className={css(
                            styles.dropdownItem,
                            activeSort === option.id && styles.activeDropdownItem
                          )}
                        >
                          <FontAwesomeIcon 
                            icon={option.icon} 
                            className={css(styles.dropdownItemIcon)} 
                          />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <select 
                  className={css(styles.yearSelect)}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="2024">Issue: 2024</option>
                  <option value="2023">Issue: 2023</option>
                </select>
              </div>
            </div>

            <div className={css(styles.feedCards)}>
              {mockPapers.map((paper) => (
                <div key={paper.id} className={css(styles.cardWrapper)}>
                  <FeedCard {...paper} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Right sidebar */}
          <div className={css(styles.sidebar)}>
            <div className={css(styles.specialIssueCard)}>
              <h2 className={css(styles.sidebarTitle)}>Special Issue</h2>
              <h3 className={css(styles.issueTitle)}>
                Longevity Escape Velocity
              </h3>
              <p className={css(styles.issueDescription)}>
                This special issue examines cutting-edge research in extending human life expectancy, focusing on advancements that outpace the aging process.
              </p>
              <div className={css(styles.issueStats)}>
                <div className={css(styles.statItem)}>
                  <span>Papers:</span> 0
                </div>
                <div className={css(styles.statItem)}>
                  <span>Deadline:</span> December 31, 2024
                </div>
              </div>
              <button 
                onClick={handleEarlySubmit}
                className={css(styles.submitButton)}
              >
                Submit Early
                <FontAwesomeIcon 
                  icon={faArrowRight} 
                  className={css(styles.buttonIcon)}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </JournalLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.GREY(0.1),
    minHeight: "100vh",
  },
  mainContent: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "20px 24px",
    display: "flex",
    gap: 24,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
      padding: "24px 16px",
    },
  },
  yearSelect: {
    padding: "8px 16px",
    borderRadius: 4,
    border: `1px solid ${colors.GREY_LINE()}`,
    background: colors.WHITE(),
    fontSize: 15,
    color: colors.BLACK(0.8),
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
    ":hover": {
      borderColor: colors.NEW_BLUE(0.6),
    },
    ":focus": {
      borderColor: colors.GREY_LINE(0.5),
      outline: "none",
    },
    ":active": {
      borderColor: colors.GREY_LINE(0.5),
      outline: "none",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flex: 1,
    },
  },
  feedSection: {
    flex: 1,
    maxWidth: 800,
  },
  header: {
    background: colors.WHITE(),
    padding: "32px",
    borderRadius: "4px 4px 0 0",
  },
  title: {
    fontSize: 32,
    fontWeight: 500,
    color: colors.BLACK(0.9),
    margin: 0,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: "24px",
    color: colors.BLACK(0.7),
    margin: 0,
    marginBottom: 24,
    paddingBottom: 24,
  },
  statsRow: {
    display: "flex",
    gap: 24,
    paddingBottom: 24,
  },
  stat: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: colors.BLACK(0.8),
    fontSize: 15,
  },
  statIcon: {
    color: colors.BLACK(0.5),
    fontSize: 14,
  },
  divider: {
    height: 2,
    background: colors.GREY_LINE(0.5),
    marginBottom: 20,
  },
  filterRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    marginBottom: -50,
    paddingBottom: 16,
    borderBottom: `1px solid ${colors.GREY_LINE(0.5)}`,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "row",
      gap: 12,
      width: "100%",
    },
  },

  dropdownContainer: {
    position: "relative",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flex: 1,
    },
  },

  dropdownTrigger: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    background: colors.WHITE(),
    border: `1px solid ${colors.GREY_LINE()}`,
    borderRadius: 4,
    fontSize: 15,
    color: colors.BLACK(0.8),
    cursor: "pointer",
    transition: "all 0.2s ease",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
    ":hover": {
        borderColor: colors.NEW_BLUE(0.6),
      },
  },

  dropdownIcon: {
    fontSize: 14,
    color: colors.BLACK(0.5),
  },

  chevron: {
    fontSize: 12,
    marginLeft: 4,
    transition: "transform 0.2s ease",
  },

  chevronOpen: {
    transform: "rotate(180deg)",
  },

  dropdownMenu: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    background: colors.WHITE(),
    border: `1px solid ${colors.GREY_LINE()}`,
    borderRadius: 4,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    minWidth: 200,
    zIndex: 10,
  },

  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: "12px 16px",
    border: "none",
    background: "none",
    fontSize: 15,
    color: colors.BLACK(0.8),
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s ease",
    ":hover": {
      background: colors.GREY(0.1),
    },
  },

  dropdownItemIcon: {
    fontSize: 14,
    color: colors.BLACK(0.5),
  },

  activeDropdownItem: {
    color: colors.NEW_BLUE(),
    background: colors.NEW_BLUE(0.1),
    ":hover": {
      background: colors.NEW_BLUE(0.15),
    },
  },

  cardWrapper: {
    marginBottom: 0,
    paddingBottom: 24,
    ":last-child": {
      paddingBottom: 0,
      borderBottom: "none",
    },
  },
  feedCards: {
    display: "flex",
    flexDirection: "column",
    background: colors.WHITE(),
    padding: "16px 32px",
    borderRadius: "0 0 4px 4px",
  },
  placeholderWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  sidebar: {
    width: 300,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      display: "none",
    },
  },
  specialIssueCard: {
    background: colors.WHITE(),
    border: `1px solid ${colors.GREY_LINE(0.5)}`,
    borderRadius: 4,
    padding: 24,
    position: "sticky",
    top: 24,
  },
  sidebarTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.BLACK(0.6),
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: 0,
    marginBottom: 16,
  },
  issueTitle: {
    fontSize: 18,
    fontWeight: 500,
    color: colors.BLACK(0.9),
    marginTop: 0,
    marginBottom: 12,
    lineHeight: "24px",
  },
  issueDescription: {
    fontSize: 14,
    lineHeight: "20px",
    color: colors.BLACK(0.6),
    marginBottom: 24,
  },
  issueStats: {
    borderTop: `1px solid ${colors.GREY_LINE(0.5)}`,
    paddingTop: 16,
    marginBottom: 24,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  statItem: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    color: colors.BLACK(0.8),
    "& span": {
      color: colors.BLACK(0.6),
    },
  },
  submitButton: {
    width: "100%",
    padding: "12px 20px",
    background: colors.NEW_BLUE(),
    borderRadius: 4,
    color: colors.WHITE(),
    fontSize: 15,
    fontWeight: 500,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.2s ease",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      background: colors.NEW_BLUE(0.9),
    },
  },
  buttonIcon: {
    fontSize: 14,
    transition: "transform 0.2s ease",
  },
  loadMoreWrapper: {
    marginTop: 24,
    display: "flex",
    justifyContent: "center",
  },
}); 