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

export { months, range, convertNumToMonth };
