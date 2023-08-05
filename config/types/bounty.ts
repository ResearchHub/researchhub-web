import {
  formatDateStandard,
  timeToInUnits,
  timeToRoundUp,
} from "../utils/dates";
import { parseUser, RHUser, ID } from "./root_types";
import api, { generateApiUrl } from "../api";
import { Helpers } from "@quantfive/js-web-config";
import numeral from "numeral";
import { captureEvent } from "../utils/events";
import { ContentType, parseContentType } from "./contentType";
import Router from "next/router";
import { Comment } from "~/components/Comment/lib/types";

export function formatBountyAmount({
  amount,
  shortValue = false,
  withPrecision = true,
}) {
  if (withPrecision) {
    return numeral(amount).format("0,0.[0000000000]");
  } else {
    if (shortValue) {
      return amount > 1000
        ? (amount / 1000).toFixed(0) + "k"
        : amount.toFixed(0);
    }
    return Number(parseFloat(amount).toFixed(0)).toLocaleString();
  }
}

export const tallyAmounts = ({ bounties }: { bounties: Bounty[] }) => {
  return bounties.reduce((total, b: Bounty) => total + b.amount, 0);
};

export enum BOUNTY_STATUS {
  OPEN = "OPEN",
  EXPIRED = "EXPIRED",
  CLOSED = "CLOSED",
}

export const fetchBounty = ({ unifiedDocId }) => {
  const url = generateApiUrl(
    `bounty`,
    `?item_object_id=${unifiedDocId}&status=OPEN`
  );
  return fetch(url, api.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      return res;
    });
};

export const parseBountyList = (
  rawBounties: any[],
  relatedItem?: RelatedItem
): Bounty[] => {
  const parentBounties = {};
  const allBounties: Bounty[] = [];
  for (let i = 0; i < rawBounties.length; i++) {
    const current = new Bounty(rawBounties[i], relatedItem);

    if (!current.parentId) {
      parentBounties[String(current.id)] = current;
    }

    allBounties.push(current);
  }

  for (let i = 0; i < allBounties.length; i++) {
    const current = allBounties[i];
    const parent = parentBounties[String(current.parentId)];
    if (parent) {
      parent.appendChild(current);
      current.parent = parent;
    }
  }

  return allBounties;
};

export type RelatedItem = {
  type: "comment";
  object: Comment;
};

export default class Bounty {
  _id: ID;
  _createdDate: string;
  _timeRemaining: string;
  _timeRemainingInMinutes: number;
  _createdBy: RHUser | null;
  _amount: number;
  _formattedAmount: string;
  _status: BOUNTY_STATUS;
  _expiration_date: string;
  _contentType: ContentType | undefined;
  _effortLevel: string;
  _parent: Bounty | undefined; // Bounty contributions are linked by parentId
  _parentId: ID | undefined;
  _children: Bounty[];
  _relatedItem: RelatedItem | undefined;

  constructor(raw: any, relatedItem?: RelatedItem | undefined) {
    this._id = raw.id;
    this._createdDate = formatDateStandard(raw.created_date);
    this._timeRemaining = timeToRoundUp(raw.expiration_date);
    this._timeRemainingInMinutes = timeToInUnits({
      date: raw.expiration_date,
      unit: "minute",
    });

    this._createdBy = raw.created_by ? parseUser(raw.created_by) : null;
    this._amount = parseFloat(raw.amount);
    this._formattedAmount = this._amount.toLocaleString();
    this._status = raw.status;
    this._expiration_date = raw.expiration_date;
    this._contentType =
      typeof raw.content_type === "object"
        ? parseContentType(raw.content_type)
        : raw.content_type;
    this._relatedItem = raw.item;
    this._effortLevel = raw.effort_level;
    this._children = [];
    this._parentId = raw?.parent?.id;
    this._relatedItem = relatedItem;
  }

  static awardAPI({
    bountyId,
    recipientUserId,
    objectId,
    amount,
    contentType = "rhcommentmodel",
  }): Promise<Bounty> {
    const data = {
      recipient: recipientUserId,
      content_type: contentType,
      object_id: objectId,
      amount,
    };

    const url = generateApiUrl("bounty") + bountyId + "/approve_bounty/";

    return new Promise((resolve, reject) => {
      fetch(url, api.POST_CONFIG([data]))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          return resolve(new Bounty(res));
        })
        .catch((error) => {
          captureEvent({
            error,
            msg: "Failed to award bounty",
            data: { bountyId, recipientUserId, contentType, amount },
          });
          return reject(error);
        });
    });
  }

  static createAPI({
    bountyAmount,
    itemObjectId,
    itemContentType = "researchhubunifieddocument",
  }) {
    // TODO: Change hard coded value

    const today = new Date();
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    const data = {
      amount: parseFloat(bountyAmount),
      item_content_type: itemContentType,
      item_object_id: itemObjectId,
      expiration_date: thirtyDaysFromNow,
    };

    return new Promise((resolve, reject) => {
      return fetch(generateApiUrl("bounty"), api.POST_CONFIG(data))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          if (itemContentType !== "thread") {
            const r = Router;
            fetch(
              "/api/revalidate",
              api.POST_CONFIG({
                path: `/post/${r.router?.query.documentId}/${r.router?.query.title}`,
              })
            );
          }
          return resolve(new Bounty(res));
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  static closeBountyAPI({ bounty }) {
    return new Promise((resolve, reject) => {
      return fetch(
        generateApiUrl(`bounty/${bounty.id}/cancel_bounty`),
        api.POST_CONFIG()
      )
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          return resolve(res);
        })
        .catch((error) => {
          captureEvent({
            error,
            msg: "Failed to close bounty",
            data: { bountyId: bounty.id },
          });
          return reject(error);
        });
    });
  }

  get id(): ID {
    return this._id;
  }

  get parentId(): ID | undefined {
    return this._parentId;
  }

  get parent(): Bounty | undefined {
    return this._parent;
  }

  get children(): Bounty[] {
    return this._children;
  }

  get createdDate(): string {
    return this._createdDate;
  }

  // Since the BE bounties expire via a cron, they may be deliverd to the FE as
  // open when in reality, they have expired.
  get isExpiredOrClosed(): boolean {
    return this._timeRemainingInMinutes < 0 || this._status !== "OPEN";
  }

  get isOpen(): boolean {
    return !this.isExpiredOrClosed;
  }

  get timeRemaining(): string {
    return this._timeRemaining;
  }

  getUniqueContributors({ openOnly = true }): RHUser[] {
    const uniqueContributors: Array<RHUser> = [];

    if (this.createdBy) {
      uniqueContributors.push(this.createdBy);
    }

    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      const isAlreadyInList = Boolean(
        uniqueContributors.find((c) => c.id === child!.createdBy!.id)
      );
      if (
        !isAlreadyInList &&
        child.createdBy &&
        (openOnly ? child.isOpen : true)
      ) {
        uniqueContributors.push(child.createdBy);
      }
    }

    return uniqueContributors;
  }

  get timeRemainingInMinutes(): number {
    return this._timeRemainingInMinutes;
  }

  get createdBy(): RHUser | null {
    return this._createdBy;
  }

  get amount(): number {
    return this._amount;
  }

  get status(): BOUNTY_STATUS {
    return this._status;
  }

  get expiration_date(): string {
    return this._expiration_date;
  }
  get contentType(): ContentType | undefined {
    return this._contentType;
  }

  get relatedItem(): RelatedItem | undefined {
    return this._relatedItem;
  }

  get formattedAmount(): string {
    return this._formattedAmount;
  }

  get effortLevel(): string {
    return this._effortLevel;
  }

  appendChild(bounty: Bounty): void {
    this._children.push(bounty);
  }

  set parent(bounty: Bounty | undefined) {
    this._parent = bounty;
  }

  set createdBy(user: RHUser | null) {
    this._createdBy = user;
  }

  set children(children: Array<Bounty>) {
    this._children = children;
  }

  set status(status: BOUNTY_STATUS) {
    this._status = status;
  }

  set relatedItem(relatedItem: RelatedItem | undefined) {
    this._relatedItem = relatedItem;
  }
}
