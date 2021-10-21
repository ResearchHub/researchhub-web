export type ID = string | number | null | undefined;
export type KeyOf<ObjectType> = keyof ObjectType;
export type ValueOf<ObjectType> = ObjectType[keyof ObjectType];

export type Hub = {
  id: number;
  category: number;
  description: string;
  hub_image: string | null;
  is_locked: boolean;
  is_removed: boolean;
  name: string;
  slug: string;
  paper_count: number;
  subscriber_count: number;
  discussion_count: number;
};

export type PaperAuthor = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
};
