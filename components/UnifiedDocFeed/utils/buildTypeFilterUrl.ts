import { prepURL } from "~/config/api";
import { getSortValue } from "./getSortValue";

// Used for static link generation for SEO purposes
export const buildTypeFilterUrl = ({ tabObj, router }) => {
  const sort = getSortValue({ query: router.query, type: tabObj.value });
  const params = {
    querystring: {
      ...(tabObj.value !== "all" && { type: tabObj.value }),
      ...(sort && { sort }),
      ...(sort && router.query.time && { time: router.query.time }),
    },
  };

  let path = router.asPath;
  const idx = path.indexOf("?");
  if (idx >= 0) {
    path = path.substring(0, idx);
  }

  const url = prepURL(path, params);

  return url;
};
