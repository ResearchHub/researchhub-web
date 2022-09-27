import { formatDateStandard, timeToInUnits, timeToRoundUp } from "../utils/dates";
import { CreatedBy, ID } from "./root_types";
import { parseCreatedBy } from "./contribution";
import api, { generateApiUrl } from "../api";
import { Helpers } from "@quantfive/js-web-config";
import numeral from "numeral";
import { captureEvent } from "../utils/events";
import { ContentType, parseContentType } from "./contentType";

export function formatBountyAmount({ amount }) {
  return numeral(amount).format("0,0.[0000000000]");
}

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

export default class Bounty {
  _id: ID;
  _createdDate: string;
  _timeRemaining: string;
  _timeRemainingInDays: number;
  _createdBy: CreatedBy | null;
  _amount: number;
  _formattedAmount: string;
  _status: BOUNTY_STATUS;
  _expiration_date: string;
  _contentType: ContentType|undefined;
   // FIXME: Update to ContributionType if needed
  _relatedItem: any

  constructor(raw: any) {
    this._id = raw.id;
    this._createdDate = formatDateStandard(raw.created_date);
    this._timeRemaining = timeToRoundUp(raw.expiration_date);
    this._timeRemainingInDays = timeToInUnits({ date: raw.expiration_date, unit: "day" });
    this._createdBy = parseCreatedBy(raw.created_by);
    this._amount = parseFloat(raw.amount);
    this._formattedAmount = this._amount.toLocaleString();
    this._status = raw.status;
    this._expiration_date = raw.expiration_date;
    this._contentType = typeof(raw.content_type) === "object" ? parseContentType(raw.content_type) : undefined;
    this._relatedItem = raw.item;
  }

  static awardAPI({ bountyId, recipientUserId, objectId, contentType }) {
    const data = {
      recipient: recipientUserId,
      content_type: contentType,
      object_id: objectId,
    };

    const url = generateApiUrl("bounty") + bountyId + "/approve_bounty/";

    return new Promise((resolve, reject) => {
      fetch(url, api.POST_CONFIG(data))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          return resolve(new Bounty(res));
        })
        .catch((error) => {
          captureEvent({
            error,
            msg: "Failed to award bounty",
            data: { bountyId, recipientUserId, contentType },
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

  get createdDate(): string {
    return this._createdDate;
  }

  get timeRemaining(): string {
    return this._timeRemaining;
  }

  get timeRemainingInDays(): number {
    return this._timeRemainingInDays;
  }  

  get createdBy(): CreatedBy | null {
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
  get contentType(): ContentType|undefined {
    return this._contentType;
  }

  get relatedItem(): any {
    return this._relatedItem;
  }

  get formattedAmount(): string {
    return this._formattedAmount;
  }  
}