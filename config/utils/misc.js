import { doesNotExist } from "./nullchecks";

export function removeLineBreaksInStr(str) {
  return str.replace(/\r?\n |\r/g, "");
}

/**
 *
 * @param {String} str - any string
 *
 * returns string with first letter of each word capitalized
 */
export function capitalize(str) {
  return str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
}

export function getNestedValue(root, nodes, defaultValue = null) {
  const initialValue = root;

  if (doesNotExist(initialValue)) {
    return defaultValue;
  }

  const value = nodes.slice(0).reduce((acc, curr, i, arr) => {
    if (doesNotExist(acc[curr])) {
      arr.splice(1);
      return defaultValue;
    }
    return acc[curr];
  }, initialValue);

  return value;
}

export function truncateText(str) {
  if (str && str.length >= 90) {
    return str.slice(0, 90).trim() + "...";
  }
  return str;
}

export function logFetchError(fetchResponse) {
  const message = `Error fetching ${fetchResponse.url}:`;
}

/**
 *
 * @param {Object} author - author object
 *
 * returns the either the first / last or both is exists
 */
export function getAuthorName(author) {
  if (author.first_name && !author.last_name) {
    return author.first_name;
  } else if (author.last_name && !author.first_name) {
    return author.last_name;
  } else {
    return `${author.first_name} ${author.last_name}`;
  }
}

export function getBountyAmount({ type, paper }) {
  if (doesNotExist(type) || doesNotExist(paper)) {
    return 0;
  }

  if (type === "summary") {
    if (
      doesNotExist(paper.summary_low_quality) ||
      typeof paper.summary_low_quality === "boolean"
    ) {
      return 0;
    }
    return paper.summary_low_quality;
  } else if (type === "takeaways") {
    if (
      doesNotExist(paper.bullet_low_quality) ||
      typeof paper.bullet_low_quality === "boolean"
    ) {
      return 0;
    }
    return paper.bullet_low_quality;
  }
}

export function formatJournalName(journal) {
  switch (journal) {
    case "doi":
    case "org/10":
      return null;
    case "org/abs/":
    case "org/abs/2003":
    case "org/ftp/arxiv/papers/2101/2101":
    case "org/abs/2101":
    case "arxiv":
    case "Arxiv":
      return "arxiv";
    case "Future Science Ltd":
      return "futurescience";
    case "Wiley":
      return "wiley";
    case "Oxford University Press":
    case "Oxford University Press (OUP)":
      return "oup";
    case "Microbiology Society":
      return "mbs";
    case "International Association for Food Protection":
      return "iafp";
    case "Springer Science and Business Media LLC":
      return "springer";
    case "Georg Thieme Verlag KG":
      return "thieme";
    case "Frontiers Media SA":
    case "Frontiers in Bioengineering and Biotechnology":
    case "frontiersin":
      return "frontiers";
    case "Semantic_scholar":
    case "semantic_scholar":
      return "semanticscholar";
    case "Manubot":
      return "manubot";
    case "MDPI AG":
      return "mdpi";
    case "Informa UK Limited":
      return "informa";
    case "EMBO":
      return "embo";
    case "SAGE Publications":
      return "sage";
    case "World Scientific Pub Co Pte Lt":
      return "wspc";
    case "BMC Biology":
    case "BMC Medical Genomics":
      return "biomedcentral";
    default:
      if (journal && journal.includes("psyarxiv")) {
        return "psyarxiv";
      }
      if (journal && (journal.includes("abs") || journal.includes("arxiv"))) {
        return "arxiv";
      }
      if (journal && journal.includes("Frontiers")) {
        return "frontiers";
      }
      return journal;
  }
}

export function getJournalImagePath(source) {
  const src = `/static/icons/journals/${source}`;
  switch (source) {
    case "googleapis":
    case "informa":
      return src + ".webp";
    case "psyarxiv":
    case "biomedcentral":
    case "sage":
    case "sciencedirect":
    case "wspc":
      return src + ".png";
    default:
      return src + ".svg";
  }
}
