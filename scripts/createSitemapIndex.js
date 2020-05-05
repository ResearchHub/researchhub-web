const fs = require("fs");
const axios = require("axios");
const ProgressBar = require("progress");

const start = new Date();

const LIMIT = 10000;

const writeFile = () => {
  let fileCount = 1; // start at 1
  let fileName = `./public/sitemap-prod2.xml`; // needs to autoincrement
  let writeStream = fs.createWriteStream(fileName);
  let footer = "</sitemapindex>";

  let header = '<?xml version="1.0" encoding="UTF-8"?>';

  const writeHeader = () => {
    let header = `
    <?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    writeStream.write(header);
  };

  writeHeader();

  for (let i = 1; i < 73; i++) {
    let sitemap = `
    <sitemap>
      <loc>https://www.researchhub.com/sitemap.prod-${i}.xml</loc>
    </sitemap>`;
    writeStream.write(sitemap);
  }
  writeStream.write(footer);
};

writeFile();

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
