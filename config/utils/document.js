export function buildSlug(str) {
  if (str && typeof str === "string") {
    let slug = str.replace(/[^a-zA-Z ]/g, ""); // remove special characters regex
    slug = slug
      .split(" ")
      .filter((el) => el !== "")
      .join("-")
      .toLowerCase();
    return slug ? slug : "";
  }
  return "";
}
