export function formatPaperSlug(paperTitle) {
  if (paperTitle && typeof paperTitle === "string") {
    let slug = paperTitle.replace(/[^a-zA-Z ]/g, ""); // remove special characters regex
    slug = slug
      .split(" ")
      .filter((el) => el !== "")
      .join("-")
      .toLowerCase();
    return slug ? slug : "";
  }
  return "";
}
