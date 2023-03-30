import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "aphrodite";
import { DEFAULT_ITEM_STYLE } from "~/components/shared/carousel/RhCarouselItem";
import { faPeopleGroup } from "@fortawesome/pro-duotone-svg-icons";
import { styles } from "~/components/Home/sidebar/styles/HomeRightSidebarStyles";
import ALink from "~/components/ALink";
import colors from "~/config/themes/colors";
import { RSC } from "~/config/themes/icons";

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

        <ul
          style={{
            marginTop: 6,
            fontSize: 14,
            paddingLeft: 0,
            listStyle: "none",
          }}
        >
          <li>
            <ALink
              theme="solidPrimary"
              overrideStyle={DEFAULT_ITEM_STYLE.link}
              href="https://docs.researchhub.com/welcome/what-is-researchhub"
              target="_blank"
            >
              Learn more about ResearchHub
            </ALink>
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: (
      <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}>
        <span style={{ marginRight: 8, marginTop: 3 }}>
          <RSC style={styles.RSC} />
        </span>
        {" About ResearchCoin (RSC)"}
      </div>
    ),
    body: (
      <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
        {
          "ResearchCoin empowers the ResearchHub community. With ResearchCoin, users have the ability to create bounties, tip authors, and gain voting rights for community decision making."
        }
      </div>
    ),
  },
  {
    title: (
      <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}>
        <span style={{ marginRight: 8, fontSize: "20px" }}>
          {/* @ts-ignore FontAwesome faulty ts error */}
          <FontAwesomeIcon icon={faPeopleGroup} color={colors.BLUE()} />
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
