import Badge from "~/components/Badge";
import { StyleSheet, css } from "aphrodite";
import colors, { bountyColors } from "~/config/themes/colors";
import icons, {
  PostIcon,
  PaperIcon,
  HypothesisIcon,
  QuestionIcon,
} from "~/config/themes/icons";
import { useRouter } from "next/router";
import { breakpoints } from "~/config/themes/screen";
import { POST_TYPES } from "./TextEditor/config/postTypes";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import { Tooltip as ReactTooltip } from 'react-tooltip'
import ReactDOMServer from 'react-dom/server';
import { genClientId } from "~/config/utils/id";
import ALink from "./ALink";

type Args = {
  contentType: string,
  size?: "small"|"medium",
  label: string,
  onClick?: null|Function,  
}

const ContentBadge = ({
  contentType,
  size = "medium",
  label = "",
  onClick = null
}: Args) => {
  const router = useRouter();
 const cuid = genClientId()
  return (
    <Badge badgeClassName={[styles.badge, styles["badgeFor_" + contentType], styles[size] ]}>
      {contentType === "paper" ? (
        <>
          <span className={css(styles.icon)}>
            <PaperIcon withAnimation={false} onClick={undefined} />
          </span>
          <span>Paper</span>
        </>
      ) : contentType === "post" ? (
        <>
          <span className={css(styles.icon)}>
            <PostIcon withAnimation={false} onClick={undefined} />
          </span>
          <span>Post</span>
        </>
      ) : contentType === "hypothesis" ? (
        <>
          <span className={css(styles.icon)}>
            <HypothesisIcon withAnimation={false} onClick={undefined} />
          </span>
          <span>Meta Study</span>
        </>
      ) : contentType === "question" ? (
        <>
          <span className={css(styles.icon)}>
            <QuestionIcon withAnimation={false} onClick={undefined} />
          </span>
          <span>Question</span>
        </>
      ) : contentType === POST_TYPES.DISCUSSION || contentType === "comment" ? (
        <>
          <span className={css(styles.icon)}>{icons.commentsSolid}</span>
          <span>Comment</span>
        </>
      ) : contentType === POST_TYPES.ANSWER ? (
        <>
          <span className={css(styles.icon)}>{icons.commentAltLineSolid}</span>
          <span>Answer</span>
        </>
      ) : contentType === POST_TYPES.SUMMARY ? (
        <>
          <span className={css(styles.icon)}>{icons.layerGroup}</span>
          <span>Summary</span>
        </>
      ) : contentType === POST_TYPES.REVIEW ? (
        <>
          <span className={css(styles.icon)}>{icons.starFilled}</span>
          <span>Review</span>
        </>
      ) : contentType === "rsc_support" ? (
        <>
          <span className={css(styles.icon)}>
            <ResearchCoinIcon version={4} height={16} width={16} />
            {` `}
          </span>
          <span className={css(styles.rscContent)}>{label}</span>
        </>
      ) : contentType === "bounty" ? (
        <>
        <ReactTooltip
          anchorSelect={`.some-tooltip-${cuid}`}
          noArrow={true}
          clickable={true}
          delayShow={350}
          style={{
            zIndex: 2, width: 350, fontSize: 14, padding: 15, background: "white", color: "black", opacity: "1", border: `1px solid ${colors.ORANGE_DARK2()}`, boxShadow: "rgba(17, 17, 26, 0.1) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px", textTransform: "none",
            boxShadow: "0px 0px 15px rgba(255, 148, 22, 0.5)"            
          }}
        />
        <span
        style={{display: "flex", alignItems: "center",}} 
          className={`some-tooltip-${cuid}`}
          data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
          <div style={{
            
          }}>
            {/* <div style={{color: colors.ORANGE_DARK2()}}>
              <ResearchCoinIcon version={4} height={size === "small" ? 14 : 16} width={size === "small" ? 14 : 16} /> ResearchCoin Bounty
            </div> */}
            {/* <div>
              Bounties offer a financial
            </div> */}

            <div style={{display: "flex", columnGap: 10, alignItems: "center", color: "#7C7989", fontWeight: 400}}>
              <div style={{ display: "flex"}}>
                <div style={{borderRadius: 50, border: "2px solid #cecece", fontWeight: 400, display: "flex", alignItems: "center", columnGap: "5px"}}>
                  <img height={25} style={{borderRadius: "50px"}} src="https://researchhub-paper-prod.s3.amazonaws.com/uploads/author_profile_images/2022/08/09/blob_im4Dh4d?AWSAccessKeyId=AKIA3RZN3OVNPLBMN3JX&Signature=%2BNPlt5loY05SOvS7DEesA0GAM8g%3D&Expires=1677878650"  />
                </div>
                <div style={{borderRadius: 50, border: "2px solid #cecece", marginLeft: -15, fontWeight: 400, display: "flex", alignItems: "center", columnGap: "5px"}}>
                  <img height={25} style={{borderRadius: "50px"}} src="https://researchhub-paper-prod.s3.amazonaws.com/uploads/author_profile_images/2022/01/15/blob?AWSAccessKeyId=AKIA3RZN3OVNPLBMN3JX&Signature=R2jy8ckm7E6hhRYk%2BzHaIRMP87k%3D&Expires=1677878650"  />
                </div>
              </div>
              <div style={{fontWeight: 400}}>
                Tyler Diorio and Jeffrey Koury opened a bounty
              </div>
            </div>            

            <div style={{fontWeight: 400, marginTop: 10}}>
              Although there's already a substantial amount of input from the Community, I'm requesting a detailed peer review assessing the overall pros/cons of...
              <span style={{fontSize: 12}}><ALink theme="solidPrimary" href="">View bounty</ALink></span>
            </div>



            {/* <div style={{display: "flex", alignItems: "center",  columnGap: "5px", fontSize: 16, color: colors.ORANGE_DARK2(), marginBottom: 10,}}>
              <ResearchCoinIcon version={4} height={20} width={20} /> <span>ResearchCoin Bounty</span>
            </div> */}

            <div style={{fontSize: 14, lineHeight: "22px", marginTop: 10}}>
              {/* <div style={{display: "flex"}}>
                <div style={{fontWeight: 500, width: 85,}}>Created by</div>
                <div style={{fontWeight: 400, display: "flex", alignItems: "center", columnGap: "5px"}}>
                  <img height={20} style={{borderRadius: "50px"}} src="https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"  />
                  <span>Kobe Attias</span>
                </div>
              </div> */}
              <div style={{display: "flex"}}>
                <div style={{fontWeight: 500, width: 85}}>Amount</div>
                <div style={{fontWeight: 400}}>1,000 RSC <span style={{ fontSize: 12,marginLeft: 3, color: "rgba(36, 31, 58, 0.6)"}}>≈10.00 USD</span></div>
              </div>
              <div style={{display: "flex"}}>
                <div style={{fontWeight: 500, width: 85,}}>Expires in</div>
                <div style={{fontWeight: 400, display: "flex", alignItems: "center", columnGap: "5px"}}>
                  <span>23 days</span>
                </div>
              </div>              
            </div>
            <div>
            <div style={{borderBottom: "1px solid rgb(232, 232, 239)", marginBottom: 7,marginTop: 7,}} />

            <ul style={{ padding: 0,  margin: 0, fontSize: 12, listStyle: "none"}}>
              <li><ALink theme="solidPrimary" href="">About Bounties</ALink></li>
              <li><ALink theme="solidPrimary" href="solidPrimary">About ResearchCoin</ALink></li>
              <li><ALink theme="solidPrimary" href="solidPrimary">ResearchCoin available on Uniswap</ALink></li>
            </ul>

            {/* <ul style={{ padding: 0,  margin: 0, fontSize: 12, listStyle: "none"}}>
              <li><ALink theme="solidPrimary" href="">About Bounties</ALink></li>
              <li><ALink theme="solidPrimary" href="solidPrimary">About ResearchCoin</ALink></li>
            </ul> */}

{/* 
              <div>Bounty details</div>
              <div>Learn about </div> */}

            </div>

            {/* <div style={{fontSize: 16, marginBottom: 15}}>
              55 RSC ≈ 5.00 USD
            </div>
            <ul style={{ padding: 0, fontSize: 14, margin: 0, listStyle: "none"}}>
              <li><ALink theme="solidPrimary" href="">About Bounties</ALink></li>
              <li><ALink theme="solidPrimary" href="solidPrimary">About ResearchCoin</ALink></li>
            </ul> */}
          </div>
        )}>

          <span  className={css(styles.icon, size === "small" && styles.iconSmall)}>
            <ResearchCoinIcon version={4} height={size === "small" ? 14 : 16} width={size === "small" ? 14 : 16} />
            {` `}
          </span>
          <span className={css(styles.rscContent)}>{label}</span>
        </span>
        </>
      ) : (
        <></>
      )}
    </Badge>
  );
};

const styles = StyleSheet.create({
  small: {
    fontSize: 12,
    padding: "3px 6px 1px",
  },
  medium: {

  },
  icon: {
    marginRight: 6,
    fontSize: 16,
    height: 21,
  },
  iconSmall: {
    height: 18,
  },
  badgeFor_rsc_support: {
    background: bountyColors.BADGE_BACKGROUND,
    color: bountyColors.BADGE_TEXT,
  },
  badgeFor_bounty: {
    background: bountyColors.BADGE_BACKGROUND,
    color: bountyColors.BADGE_TEXT,
  },
  rscContent: {
    color: colors.ORANGE_DARK2(),
    marginTop: "-2px"
  },
  badge: {
    color: colors.BLACK(0.5),
    background: colors.LIGHT_GREY(1.0),
    display: "flex",
    padding: "4px 10px 1px 10px",
    textTransform: "capitalize",
    borderRadius: "4px",
    marginBottom: 0,
    marginRight: 0,
    fontSize: 14,
    lineHeight: "17px",
    fontWeight: 500,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginBottom: 0,
    },
  },
});

export default ContentBadge;
