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
    key: "trending",
  },
  {
    value: "top_rated",
    label: "Top Rated",
    key: "top-rated",
  },
  {
    value: "newest",
    label: "Newest",
    disableScope: true,
    key: "newest",
  },
  {
    value: "most_discussed",
    label: "Most Discussed",
    key: "most-discussed",
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
  {
    value: "HSD",
    label: "Highschool Diploma",
  },
  {
    value: "AA",
    label: "Associate's Degree",
  },
  {
    value: "AA",
    label: "Associate of Arts",
  },
  {
    value: "AS",
    label: "Asscoiate of Science",
  },
  {
    value: "AAS",
    label: "Associate of Arts and Science",
  },
  {
    value: "BA",
    label: "Bachelor's Degree",
  },
  {
    value: "Engineer's Degree",
    label: "Engineer's Degree",
  },
  {
    value: "Foundation Degree",
    label: "Foundation Degree",
  },
  {
    value: "Licentiate Degree",
    label: "Licentiate Degree",
  },
  {
    value: "Master's Degree",
    label: "Master's Degree",
  },
  {
    value: "BASc",
    label: "Bachelor of Applied Science",
  },
  {
    value: "BArch",
    label: "Bachelor of Architecture",
  },
  {
    value: "BA",
    label: "Bachelor of Arts",
  },
  {
    value: "BBA",
    label: "Bachelor of Business Administration",
  },
  {
    value: "BCom",
    label: "Bachelor of Commerce",
  },
  {
    value: "BEd",
    label: "Bachelor of Education",
  },
  {
    value: "BE",
    label: "Bachelor of Engineering",
  },
  {
    value: "BFA",
    label: "Bachelor of Fine Arts",
  },
  {
    value: "LLB",
    label: "Bachelor of Laws",
  },
  {
    value: "MBBS",
    label: "Bachelor of Medicine, Bachelor of Surgery",
  },
  {
    value: "BPharm",
    label: "Bachelor of Pharmacy",
  },
  {
    value: "BS",
    label: "Bachelor of Science",
  },
  {
    value: "BTech",
    label: "Bachelor of Technology - BTech",
  },
  {
    value: "MArch",
    label: "Master of Architecture",
  },
  {
    value: "MA",
    label: "Master of Arts",
  },
  {
    value: "MBA",
    label: "Master of Business Administration",
  },
  {
    value: "MCA",
    label: "Master of Computer Applications",
  },
  {
    value: "MDiv",
    label: "Master of Divinity",
  },
  {
    value: "MEd",
    label: "Master of Education",
  },
  {
    value: "MEng",
    label: "Master of Engineering",
  },
  {
    value: "MFA",
    label: "Master of Fine Arts",
  },
  {
    value: "LLM",
    label: "Master of Laws",
  },
  {
    value: "MLIS",
    label: "Master of Library & Information Science",
  },
  {
    value: "MPhil",
    label: "Master of Philosophy",
  },
  {
    value: "MPA",
    label: "Master of Public Administration",
  },
  {
    value: "MPH",
    label: "Master of Public Health",
  },
  {
    value: "MS",
    label: "Master of Science",
  },
  {
    value: "MSW",
    label: "Master of Social Work",
  },
  {
    value: "MTech",
    label: "Master of Technology",
  },
  {
    value: "EdD",
    label: "Doctor of Education",
  },
  {
    value: "JD",
    label: "Doctor of Law",
  },
  {
    value: "MD",
    label: "Doctor of Medicine",
  },
  {
    value: "PharmD",
    label: "Doctor of Pharmacy",
  },
  {
    value: "PhD",
    label: "Doctor of Philosophy",
  },
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
