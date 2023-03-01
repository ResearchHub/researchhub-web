import { formatDateStandard, timeSince } from "~/config/utils/dates";
import { parseCreatedBy } from "~/config/types/contribution";
import { CreatedBy, ID } from "~/config/types/root_types";
import { POST_TYPES } from "./types";

type CreateArgs = {
  parentCommentId?: ID;
  content: any;
  postType: POST_TYPES;
}

export default class CommentModel {
  _id: ID;
  _createdDate: string;
  _timeAgo: string;
  _updatedDate: string;
  _postType: POST_TYPES;
  _score: number;
  // Todo: Create a type for this
  _userVote: any;
  _createdBy: CreatedBy | null;
  _isEdited: boolean;
  _content: any;
  _children: CommentModel[];

  constructor(raw: any) {
    this._id = raw.id;
    this._createdDate = formatDateStandard(raw.created_date);
    this._updatedDate = formatDateStandard(raw.created_date);
    this._timeAgo = timeSince(raw.created_date);
    this._createdBy = parseCreatedBy(raw.created_by);
    this._content = raw.content;
    this._score = raw.score;
    this._userVote = raw.user_vote;
    this._isEdited = raw.is_edited;
    this._postType = raw.post_type;
    this._children = raw.children.map(child => new CommentModel(child));
  }

  static create({ parentCommentId, content, postType }: CreateArgs) {
    console.log('Creating comment');
    console.log('parentCommentId', parentCommentId);
    console.log('content', content);
    console.log('postType', postType);
  }

  delete() {
    console.log('deleting comment');
    console.log('commentId', this._id);
  }

  update() {
    console.log('updating comment');
    console.log('commentId', this._id);
  }

  get id(): ID {
    return this._id;
  }

  get createdDate(): string {
    return this._createdDate;
  }

  get updatedDate(): string {
    return this._updatedDate;
  }

  get timeAgo(): string {
    return this._timeAgo;
  }

  get createdBy(): CreatedBy | null {
    return this._createdBy;
  }

  get content(): any {
    return this._content;
  }

  get score(): number {
    return this._score;
  }

  get userVote(): any {
    return this._userVote;
  }

  get isEdited(): boolean {
    return this._isEdited;
  }

  get postType(): string {
    return this._postType;
  }

  get children(): CommentModel[] {
    return this._children;
  }
}