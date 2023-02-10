import { css } from "aphrodite";
import { DEFAULT_ITEM_STYLE } from "~/components/shared/carousel/RhCarouselItem";
import { faPeopleGroup } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styles } from "~/components/Home/sidebar/styles/HomeRightSidebarStyles";
import ALink from "~/components/ALink";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export const getEducationalCarouselElements = () => [
  {
    title: (
      <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}>
        <img
          src="/static/beaker.svg"
          style={{ marginRight: 6, marginTop: -3, height: 20 }}
        />
        {" What is ResearchHub?"}
      </div>
    ),
    body: (
      <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
        {
          "A tool for the open publication and discussion of scientific research. ResearchHub’s users are rewarded with ResearchCoin (RSC) for publishing, reviewing, criticizing, and collaborating in the open."
        }
      </div>
    ),
  },
  {
    title: (
      <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}>
        <span style={{ marginRight: 8, marginTop: 3 }}>
          {icons.RSC({
            style: styles.RSC,
          })}
        </span>
        {" What is ResearchCoin (RSC)?"}
      </div>
    ),
    body: (
      <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
        {
          "ResearchCoin (RSC) is a token that empowers the scientific community of ResearchHub. Once earned, RSC gives users the ability to create bounties, tip other users, and gain voting rights within community decision making."
        }
      </div>
    ),
  },
  {
    title: (
      <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}>
        <span style={{ marginRight: 8, fontSize: "20px" }}>
          <FontAwesomeIcon
            icon={faPeopleGroup as IconProp}
            color={colors.BLUE()}
          />
        </span>
        {" Community"}
      </div>
    ),
    body: (
      <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
        <span>
          {
            "We’re a collection of skeptical, yet optimistic individuals who want to accelerate the pace of science. We think the incentives of scientific funding and publishing are broken, and that blockchain can help. If you'd like, "
          }
          <ALink
            target="__blank"
            theme="solidPrimary"
            href="https://discord.gg/researchhub"
          >
            <span style={{ textDecoration: "underline" }}> Join us.</span>
          </ALink>
        </span>
      </div>
    ),
  },
];
