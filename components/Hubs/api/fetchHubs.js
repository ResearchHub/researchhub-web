import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";

export const getHubs = async ({
  ordering = "-paper_count,-discussion_count,id",
  page,
}) => {
  const url = API.HUB({ ordering, page });

  return fetch(url, API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then(async (resp) => {
      return {
        count: resp.count,
        next: resp.next,
        previous: resp.previous,
        hubs: resp.results,
      };
    })
    .catch((err) => {
      console.error(err);
    });
};

export const getCategories = () => {
  return fetch(API.GET_HUB_CATEGORIES(), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      const categories = [...resp.results];
      categories.sort((a, b) => a.category_name.localeCompare(b.category_name));
      categories.unshift({ id: 0.5, category_name: "Trending" });

      return categories;
    })
    .catch(emptyFncWithMsg);
};

const shims = {
  subscribedHubs: (hubs) => {
    return hubs.filter((hub) => {
      return hub.user_is_subscribed;
    });
  },
  categorizeHubs: (allHubs) => {
    let categorizedHubs = {};
    allHubs.forEach((hub) => {
      const category_id = hub.category;
      if (categorizedHubs[category_id]) {
        categorizedHubs[category_id].push(hub);
      } else {
        categorizedHubs[category_id] = [hub];
      }
    });
    return categorizedHubs;
  },
  sortHubs: (allHubs) => {
    let sortedHubs = {};
    allHubs.forEach((hub) => {
      let firstLetter = hub.name.slice(0, 1).toLowerCase();
      if (sortedHubs[firstLetter]) {
        sortedHubs[firstLetter].push(hub);
      } else {
        sortedHubs[firstLetter] = [hub];
      }
    });
    return sortedHubs;
  },
  findIndexById: (hubId, allHubs) => {
    for (let i = 0; i < allHubs.length; i++) {
      if (hubId === allHubs[i].id) {
        return i;
      }
    }
  },
};
