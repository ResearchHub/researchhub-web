import { StyleSheet, css } from "aphrodite";
import { CreatedBy, AuthorProfile, UnifiedDocument } from "~/config/types/root_types";
import { Hub } from "~/config/types/hub";
import { ReactElement, useState } from "react";
import AuthorAvatar from "../AuthorAvatar";
import ALink from "../ALink";
import HubDropDown from "../Hubs/HubDropDown";
import colors from "~/config/themes/colors";
import { timeSince } from "~/config/utils/dates";
import icons, { HypothesisIcon } from "~/config/themes/icons";
import ReactTooltip from "react-tooltip";
import DocumentActions from "./DocumentActions";
// import DocumentActions from "./DocumentActions";

type Args = {
  title: string,
  createdBy: CreatedBy,
  authors?: Array<AuthorProfile>,
  unifiedDocument: UnifiedDocument,
  doi?: string,
  datePublished?: string,
  journal?: string,
  hubs?: Array<Hub>,
  createdDate: string,
  externalUrl: string,
  commentCount: number,
  type: "paper" | "hypothesis" | "post",
}

export default function DocumentHeader({
  title,
  createdBy,
  createdDate,
  authors,
  unifiedDocument,
  externalUrl,
  doi,
  datePublished,
  journal,
  commentCount,
  hubs = [],
  type,
}:Args): ReactElement<"div"> {
  console.log('unifiedDocument', unifiedDocument)
  const [isHubsDropdownOpen, setIsHubsDropdownOpen] = useState(false);
  const authorElems = (authors || []).map((author) => {
    return (
      <span className={css(styles.author)}>
        {author.isClaimed
          ? (
              <span data-tip={"Profile claimed by author"}>
              <ALink href={`/user/${author.id}/overview`}>
                {author.firstName} {author.lastName} <span className={css(styles.badgeIcon)}>{icons.checkCircleSolid}</span>
              </ALink>
              </span>
            )
          : (
              <span>{author.firstName} {author.lastName}</span>
            )
        }
      </span>
    )
  });

  return (
    <div>
      <ReactTooltip />
      <div className={css(styles.submittedBy)}>
        <AuthorAvatar author={createdBy} size={25} />
        <ALink href={`/user/${createdBy.authorProfile.id}/overview`}>{createdBy.authorProfile.firstName} {createdBy.authorProfile.lastName}</ALink>
        <div>
          {hubs?.length > 0 &&
            <>
              <span>{` posted in `}</span>
              {hubs?.slice(0, 2).map((h, index) => (
                <>
                  <ALink theme="solidPrimary" href={`/hubs/${h.slug}`} overrideStyle={styles.hubLink}>{h.name}</ALink>
                  {index < hubs?.slice(0, 2).length - 1 ? ", " : ""}
                </>
              ))}
              &nbsp;
              {hubs?.slice(2).length > 0 && (
                <HubDropDown
                  hubs={hubs?.slice(1)}
                  labelStyle={styles.hubLink}
                  containerStyle={styles.hubDropdownContainer}
                  isOpen={isHubsDropdownOpen}
                  setIsOpen={() => setIsHubsDropdownOpen(!isHubsDropdownOpen)}
                />
              )}
            </>
            }          
        </div>
        <span className={css(styles.timestamp)}>{timeSince(createdDate)}</span>
      </div>
      <div className={css(styles.title)}>{title}</div>
      <div className={css(styles.metadata)}>
        {journal &&
          <div className={css(styles.metadataRow)}>
            <div className={css(styles.metaKey)}>Journal</div>
            <div className={css(styles.metaVal)}>{journal}</div>
          </div>
        }
        {authorElems.length > 0 &&
          <div className={css(styles.metadataRow)}>
            <div className={css(styles.metaKey)}>Authors</div>
            <div className={css(styles.metaVal)}>{authorElems}</div>
            <div className={css(styles.claimProfile)}>
              Claim profile to earn Research Coin
              <img
                src={"/static/icons/coin-filled.png"}
                draggable={false}
                className={css(styles.coinIcon)}
                alt="RSC Coin"
                height={18}
              />              
            </div>
          </div>
        }
        {doi &&
          <div className={css(styles.metadataRow)}>
            <div className={css(styles.metaKey)}>DOI</div>
            <div className={css(styles.metaVal)}>{doi}</div>
          </div>
        }
        {datePublished &&
          <div className={css(styles.metadataRow)}>
            <div className={css(styles.metaKey)}>Published</div>
            <div className={css(styles.metaVal)}>{datePublished}</div>
          </div>
        }
      </div>
      <div className={css(styles.actionsAndDetailsRow)}>
        <div className={css(styles.additionalDetails)}>
          <div className={css(styles.comments)}>
            {icons.commentsSolid}
            {commentCount} {`comments`}
          </div>
          {(unifiedDocument?.reviewSummary?.count || 0) > 0 &&
            <div className={css(styles.reviews)}>
              {icons.starAlt}
              {unifiedDocument?.reviewSummary?.avg} {`based on `} {unifiedDocument?.reviewSummary?.count} {`reviews`}
            </div>
          }
          <div className={css(styles.type)}>
            {type === "paper"
              ? icons.paperAlt
              : type === "hypothesis"
              ? <HypothesisIcon onClick={() => null} />
              : type === "post"
              ? icons.post
              : null
            }
            <span className={css(styles.typeText)}>{type}</span>
          </div>
        </div>
        <div className={css(styles.actions)}>
          <DocumentActions
            unifiedDocument={unifiedDocument}
            type={type}
          />
        </div>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  actionsAndDetailsRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  additionalDetails: {

  },
  comments: {

  },
  reviews: {

  },
  type: {

  },
  typeText: {
    textTransform: "capitalize",
  },
  actions: {

  },
  submittedBy: {
    display: "flex",
  },
  claimProfile: {

  },
  coinIcon: {

  },
  timestamp: {
    color: colors.BLACK(0.5),
  },
  badgeIcon: {
    color: colors.NEW_BLUE(),
    fontSize: 14,
  },
  hubDropdownContainer: {
    display: "inline-block",
  },
  hubLink: {
    color: colors.BLACK(),
    textTransform: "capitalize",
    fontSize: 14,
    ":hover": {
      color: colors.BLACK(),
      textDecoration: "underline",
    },
  },
  title: {
    fontSize: 32,
    fontWeight: 500,
    lineHeight: "40px",
  },
  metadata: {

  },
  metadataRow: {

  },
  metaKey: {

  },
  metaVal: {

  },
  author: {

  }
});
