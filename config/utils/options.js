const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const range = (min, max) => {
  let options = [];
  for (let i = min; i <= max; i++) {
    options.push({
      value: i < 10 ? "0" + String(i) : String(i),
      label: i < 10 ? "0" + String(i) : String(i),
    });
  }
  return options;
};

const convertNumToMonth = {
  "01": "January",
  "02": "Februrary",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

const convertMonthToNum = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
};

const cslFields = [
  { label: "Item Type", key: "type" },
  { label: "Title", key: "title" },
  { label: "Author", key: "author" },
  { label: "Publication", key: "publisher" },
  { label: "Volume", key: "volume" },
  { label: "Issue", key: "issue" },
  { label: "Pages", key: "page" },
  { label: "Source", key: "source" },
  { label: "Date", key: "date" },
  { label: "Journal Abbr", key: "journalAbbreviation" },
  { label: "DOI", key: "DOI" },
  { label: "ISSN", key: "ISSN" },
];

const filterOptions = [
  {
    value: "hot",
    label: "Trending",
    disableScope: true,
  },
  {
    value: "top_rated",
    label: "Top Rated",
  },
  {
    value: "newest",
    label: "Newest",
    disableScope: true,
  },
  {
    value: "most_discussed",
    label: "Most Discussed",
  },
];

const scopeOptions = [
  {
    value: "day",
    label: "Today",
  },
  {
    value: "week",
    label: "This Week",
  },
  {
    value: "month",
    label: "This Month",
  },
  {
    value: "year",
    label: "This Year",
  },
  {
    value: "all-time",
    label: "All Time",
  },
];

const degrees = [
  "Highschool Diploma",
  "Associate's Degree",
  "Associate of Arts - AA",
  "Associate of Arts and Science - AAS",
  "Associate of Science - AS",
  "Bachelor's Degree",
  "Engineer's Degree",
  "Foundation Degree",
  "Licentiate Degree",
  "Master's Degree",
  "Bachelor of Applied Science - BASc",
  "Bachelor of Architecture - BArch",
  "Bachelor of Arts - BA",
  "Bachelor of Business Administration - BBA",
  "Bachelor of Commerce - BCom",
  "Bachelor of Education - BEd",
  "Bachelor of Engineering - BE",
  "Bachelor of Fine Arts - BFA",
  "Bachelor of Laws - LLB",
  "Bachelor of Medicine, Bachelor of Surgery - MBBS",
  "Bachelor of Pharmacy - BPharm",
  "Bachelor of Science - BS",
  "Bachelor of Technology - BTech",
  "Master of Architecture - MArch",
  "Master of Arts - MA",
  "Master of Business Administration - MBA",
  "Master of Computer Applications - MCA",
  "Master of Divinity - MDiv",
  "Master of Education - MEd",
  "Master of Engineering - MEng",
  "Master of Fine Arts - MFA",
  "Master of Laws - LLM",
  "Master of Library & Information Science - MLIS",
  "Master of Philosophy - MPhil",
  "Master of Public Administration - MPA",
  "Master of Public Health - MPH",
  "Master of Science - MS",
  "Master of Social Work - MSW",
  "Master of Technology - MTech",
  "Doctor of Education - EdD",
  "Doctor of Law - JD",
  "Doctor of Medicine - MD",
  "Doctor of Pharmacy - PharmD",
  "Doctor of Philosophy - PhD",
];

export {
  degrees,
  months,
  range,
  convertNumToMonth,
  convertMonthToNum,
  cslFields,
  filterOptions,
  scopeOptions,
};
