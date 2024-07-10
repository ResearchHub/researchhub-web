export type AuthorClaimErrorReason = "ALREADY_CLAIMED_BY_ANOTHER_USER" | "ALREADY_CLAIMED_BY_CURRENT_USER" | "UNEXPECTED_ERROR";

export class AuthorClaimError extends Error {
  reason: AuthorClaimErrorReason;

  constructor(reason: AuthorClaimErrorReason) {

    let message = "An error has occured"
    if (reason === "ALREADY_CLAIMED_BY_ANOTHER_USER") {
      message = "This profile has already been claimed by another user"
    }
    else if (reason === "ALREADY_CLAIMED_BY_CURRENT_USER") {
      message = "You have already claimed this profile. Visit the profile page to view your publications"
    }

    super(message);
    this.name = this.constructor.name;
    this.reason = reason;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}