const fs = require("fs");
const axios = require("axios");
const ProgressBar = require("progress");

const start = new Date();

const LIMIT = 10000;

const writeFile = () => {
  let fileCount = 1; // start at 1
  let fileName = `./Public/sitemap.prod-${fileCount}.xml`; // needs to autoincrement
  let writeStream = fs.createWriteStream(fileName);
  let limit = LIMIT;
  let itemsWritten = 0;
  let footer = "</urlset>";

  let header = '<?xml version="1.0" encoding="UTF-8"?>';

  const writeHeader = () => {
    let header = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    writeStream.write(header);
  };

  const writeStaticUrl = () => {
    const static = [
      `https://researchhub.com`,
      `https://researchhub.com/hubs`,
      `https://researchhub.com/live`,
      `https://researchhub.com/about`,
      `https://researchhub.com/about/tos`,
      `https://researchhub.com/about/privacy`,
    ];

    static.forEach((link) => {
      let path = `
        <url>
          <loc>${link}</loc>
          <lastmod>${formatDate(new Date())}</lastmod>
        </url>`;
      itemsWritten++;
      writeStream.write(path);
    });
    writeStream.write(footer);
  };

  const writePaperUrl = (paperId) => {
    let path = `
    <url>
      <loc>https://researchhub.com/paper/${paperId}</loc>
      <lastmod>${formatDate(new Date())}</lastmod>
    </url>`;
    writeStream.write(path);
  };

  const writeHubUrl = (hub) => {
    let path = `
    <url>
      <loc>https://researchhub.com/hubs/${hub.slug ? hub.slug : hub.name}</loc>
      <lastmod>${formatDate(new Date())}</lastmod>
    </url>
    `;
    writeStream.write(path);
  };

  const configureState = () => {
    fileCount++;
    fileName = `./Public/sitemap.prod-${fileCount}.xml`;
    writeStream = fs.createWriteStream(fileName);
    writeHeader();
  };

  const collectAllPaperIds = async () => {
    var paperWritten = 0;
    var next;
    var count;

    const fetchPapers = () => {
      return axios
        .get(
          next
            ? next
            : "https://backend.researchhub.com/api/paper/?limit=1000&offset=50"
        )
        .then((res) => {
          console.log("next", next);
          console.log("count", count);
          next = res.data.next;
          count = res.data.count;
          let papers = res.data.results;

          papers.forEach((paper) => {
            if (paperWritten < limit) {
              writePaperUrl(paper.id);
              paperWritten++;
            } else {
              writeStream.write(footer);
              configureState();
              writePaperUrl(paper.id);
              paperWritten = 0;
            }
          });

          if (next) {
            return fetchPapers();
          } else {
            return;
          }
        })
        .catch((err) => {
          return;
        });
    };

    return fetchPapers();
  };

  const collectAllHubSlugs = async () => {
    var hubsWritten = 0;
    var next;
    var count;
    const fetchHubs = () => {
      return axios
        .get(
          next
            ? next
            : "https://backend.researchhub.com/api/hub/?page_limit=1000&"
        )
        .then((res) => {
          next = res.data.next;
          count = res.data.count;
          let hubSlugs = res.data.results;

          hubSlugs.forEach((hub) => {
            if (hubsWritten < limit) {
              writeHubUrl(hub);
              hubsWritten++;
            } else {
              configureState();
              writeHubUrl(hub);
              hubsWritten = 0;
            }
          });

          if (next) {
            return fetchPapers();
          } else {
            return;
          }
        })
        .catch((err) => {
          return;
        });
    };

    return fetchHubs();
  };

  writeHeader();
  writeStaticUrl();
  configureState();

  collectAllPaperIds().then(() => {
    writeStream.write(footer);
    configureState();
    collectAllHubSlugs();
  });
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
