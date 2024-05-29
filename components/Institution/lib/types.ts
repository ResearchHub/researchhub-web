import {
  ID,
} from "~/config/types/root_types";

export type Institution = {
  id: ID;
  displayName: string;
  city: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  thumbnailImageUrl?: string;
};

export type AuthorInstitution = {
  id: ID;
  institution: Institution;
  years: Array<number>;
};

export const parseInstitution = (raw: any): Institution => {
  return {
    id: raw.id,
    displayName: raw.display_name,
    city: raw.city,
    region: raw.region,
    latitude: raw.latitude,
    longitude: raw.longitude,
    imageUrl: raw.image_url,
    thumbnailImageUrl: raw.thumbnail_image_url,
  };
};
