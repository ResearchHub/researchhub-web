const fs = require("fs");

function getPathsObject() {
  const fileObj = {};

  const walkSync = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = `${dir}${file}`;
      const fileStat = fs.statSync(filePath);

      if (fileStat.isDirectory()) {
        walkSync(`${filePath}/`);
      } else {
        const cleanFileName = filePath
          .substr(0, filePath.lastIndexOf("."))
          .replace("pages/", "");

        if (
          !cleanFileName.includes("styles") &&
          !cleanFileName.includes("_") &&
          !cleanFileName.includes("Base") &&
          !cleanFileName.includes("orcid") //skip files that arn't pages or accessible to everyone
        ) {
          fileObj[`/${cleanFileName}`] = {
            page: `/${cleanFileName}`,
            lastModified: fileStat.mtime,
          };
        }
      }
    });
  };

  walkSync("pages/");

  return fileObj;
}

const pathsObj = getPathsObject();

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
  ${Object.keys(pathsObj)
    .map(
      (path) => `<url>
    <loc>https://researchhub.com${path}</loc>
    <lastmod>${formatDate(new Date(pathsObj[path].lastModified))}</lastmod>
  </url>`
    )
    .join("")}
</urlset>`;

fs.writeFileSync("./sitemap.xml", sitemapXml);
