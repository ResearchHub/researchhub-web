const fs = require("fs");
const axios = require("axios");

const LIMIT = 10000;

const getConfig = () => {
  console.log("Reading Config");
  let data = fs.readFileSync("./public/config.txt", {
    encoding: "utf8",
    flag: "r",
  });

  if (data) {
    console.log("Found Config:", JSON.parse(data));
    return JSON.parse(data);
  } else {
    console.log("No Config Found");
  }
};

const writeFile = () => {
  let config = getConfig();
  let paperCount = config && config.paperCount ? config.paperCount : 0;
  let offset = config && config.paperCount ? config.paperCount : null;
  let hubCount = config && config.hubCount ? config.hubCount : 0;
  let fileCount = config && config.fileCount ? config.fileCount + 1 : 1; // start at 1
  let prevTimestamp = config && config.timestamp ? config.timestamp : null;

  let fileName = `./public/sitemap.prod-${fileCount}.xml`; // needs to autoincrement
  let writeStream = fs.createWriteStream(fileName);
  let limit = LIMIT;

  let footer = `
  </urlset>`;

  const writeHeader = () => {
    let header = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    writeStream.write(header);
  };

  const writeStaticUrl = () => {
    writeStream = fs.createWriteStream(`./public/sitemap.prod-static.xml`);
    writeHeader();
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
      writeStream.write(path);
    });
    writeStream.write(footer);
  };

  const writePaperUrl = (paperId) => {
    let path = `
    <url>
      <loc>https://researchhub.com/paper/${paperId}/summary</loc>
      <lastmod>${formatDate(new Date())}</lastmod>
    </url>`;
    writeStream.write(path);
  };

  const writeHubUrl = (hub) => {
    let path = `
    <url>
      <loc>https://researchhub.com/hubs/${hub.slug ? hub.slug : hub.name}</loc>
      <lastmod>${formatDate(new Date())}</lastmod>
    </url>`;
    writeStream.write(path);
  };

  const configureState = (name) => {
    fileName = name ? name : `./public/sitemap.prod-${fileCount}.xml`;
    writeStream = fs.createWriteStream(fileName);
    writeHeader();
  };

  const collectAllPaperIds = async () => {
    var paperOnPage = 0;
    var next;
    var count;
    writeHeader();
    const fetchPapers = () => {
      return axios
        .get(
          next
            ? next
            : `https://backend.researchhub.com/api/paper/?limit=${LIMIT}&offset=${
                offset ? offset : 0
              }&ignore_apm=true`
        )
        .then((res) => {
          next = res.data.next;
          count = res.data.count;
          console.log("Writing Papers", next);

          let papers = res.data.results;

          papers.forEach((paper) => {
            if (paperOnPage < limit) {
              writePaperUrl(paper.id);
              paperOnPage++;
              paperCount++;
            } else {
              writeStream.write(footer);
              configureState();
              fileCount++;
              writePaperUrl(paper.id);
              paperCount++;
              paperOnPage = 0;
            }
          });

          if (next) {
            return fetchPapers();
          } else {
            return paperCount;
          }
        })
        .catch((err) => {
          console.log("err", err);
          return;
        });
    };

    return fetchPapers();
  };

  const collectAllHubSlugs = async () => {
    console.log("Writing Hubs");
    var hubsWritten = 0;
    var next;
    var count;

    const fetchHubs = () => {
      return axios
        .get(
          next
            ? next
            : "https://backend.researchhub.com/api/hub/?page_limit=1000&ignore_apm=true"
        )
        .then((res) => {
          next = res.data.next;
          count = res.data.count;
          let hubSlugs = res.data.results;

          hubSlugs.forEach((hub) => {
            if (hubsWritten < limit) {
              writeHubUrl(hub);
              hubCount++;
              hubsWritten++;
            } else {
              configureState();
              writeHubUrl(hub);
              hubCount++;
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

  const writeSitemapIndex = () => {
    console.log("Writing Sitemap Index");
    let fileName = `./public/sitemap-prod.xml`;
    let writeStream = fs.createWriteStream(fileName);
    let header = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    let footer = `
    </sitemapindex>`;
    writeStream.write(header);

    fs.readdir("./public/", (err, files) => {
      if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
      }

      files.forEach((file) => {
        if (file.includes("prod-")) {
          writeStream.write(`
        <sitemap>
          <loc>https://www.researchhub.com/${file}</loc>
        </sitemap>`);
        }
      });

      writeStream.write(footer);
    });
  };

  const writeConfig = () => {
    let fileName = `./public/config.txt`;
    let writeStream = fs.createWriteStream(fileName);

    let newConfig = {
      paperCount: paperCount,
      fileCount: fileCount,
      hubCount: hubCount,
      prevTimestamp: prevTimestamp,
      timestamp: new Date(),
    };
    console.log("Saving Config:", newConfig);
    writeStream.write(JSON.stringify(newConfig));
  };

  collectAllPaperIds().then(() => {
    let configCount = config && paperCount;
    if (paperCount !== configCount) {
      writeStream.write(footer);
    } else {
      fs.unlink(fileName, () => {
        fileCount = config && config.fileCount;
      });
    }
    writeStaticUrl();
    configureState(`./public/sitemap.prod-hubs.xml`);
    collectAllHubSlugs().then(() => {
      writeConfig();
      writeSitemapIndex();
    });
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
