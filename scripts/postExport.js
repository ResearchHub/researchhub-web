const fs = require("fs");
const axios = require("axios");
var ProgressBar = require("progress");

const start = new Date();
const collectAllPaperIds = async () => {
  console.log("Updating Sitemap...");
  var paperIds = [];
  var next;
  var count;

  const fetchPapers = () => {
    return axios
      .get(next ? next : "http://localhost:8000/api/paper/")
      .then((res) => {
        next = res.data.next;
        count = res.data.count;
        let papers = res.data.results.map((paper) => paper.id);
        paperIds = [...paperIds, ...papers];
        var bar = new ProgressBar("Paper Progress [:bar] :percent", {
          complete: "=",
          incomplete: " ",
          width: 20,
          current: paperIds.length,
          total: count,
        });
        if (next && paperIds.length < count) {
          bar.tick(paperIds.length);
          return fetchPapers();
        } else {
          bar.tick(paperIds.length);
          return paperIds;
        }
      })
      .catch((err) => {
        bar.interrupt("Hm something went wrong.");
        return paperIds;
      });
  };

  return fetchPapers();
};

const collectAllHubSlugs = async () => {
  var hubs = [];
  var next;
  var count;
  const fetchHubs = () => {
    return axios
      .get(next ? next : "http://localhost:8000/api/hub/?page_limit=1000&")
      .then((res) => {
        next = res.data.next;
        count = res.data.count;
        let hubSlugs = res.data.results.map((hub) => hub.name);
        hubs = [...hubs, ...hubSlugs];
        var bar = new ProgressBar("Hub Progress [:bar] :percent", {
          complete: "=",
          incomplete: " ",
          width: 20,
          current: hubs.length,
          total: count,
        });
        if (next && hubs.length < count) {
          bar.tick(hubs.length);
          return fetchPapers();
        } else {
          bar.tick(hubs.length);
          return hubs;
        }
      })
      .catch((err) => {
        return hubs;
      });
  };

  return fetchHubs();
};

collectAllPaperIds().then((paperIds) => {
  let allPaths = [];
  // Add Static Paths
  allPaths.push(
    `https://researchhub.com`,
    `https://researchhub.com/hubs`,
    `https://researchhub.com/live`,
    `https://researchhub.com/about`,
    `https://researchhub.com/about/tos`,
    `https://researchhub.com/about/privacy`
  );

  // Add Paper Paths
  let paperPaths = paperIds.map((paperId) => {
    return `https://researchhub.com/paper/${paperId}`;
  });
  allPaths.push(...paperPaths);

  // Add Hub Paths
  collectAllHubSlugs().then((hubs) => {
    let hubPaths = hubs.map((hub) => {
      return `https://researchhub.com/hubs/${hub}`;
    });
    allPaths.push(...hubPaths);

    //Write File
    console.log("Writing Updated XML...");
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
        ${allPaths
          .map(
            (path) => `<url>
          <loc>${path}</loc>
          <lastmod>${formatDate(new Date())}</lastmod>
        </url>`
          )
          .join("")}
      </urlset>`;

    fs.writeFileSync("./sitemap.xml.production", sitemapXml);
    console.log(`Done. ${new Date() - start}ms`);
  });
});

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
