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
          "A modern day pre-print server and platform for open science where users can review, publish, and collaborate on scientific research. Our mission is to accelerate science."
        }

        <div className={css(DEFAULT_ITEM_STYLE.learnMore)}>
          <ALink
            theme="solidPrimary"
            overrideStyle={[DEFAULT_ITEM_STYLE.link]}
            href="https://docs.researchhub.com/welcome/what-is-researchhub"
            target="_blank"
          >
            Learn more about ResearchHub
          </ALink>
        </div>
      </div>
    ),
  },
  {
    title: (
      <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemTitle)}>
        {/* <div style={{ display: "flex" }}> */}
        <span style={{ marginRight: 8, marginTop: 3 }}>
          <RSC style={styles.RSC} />
        </span>
        <span>
          ResearchCoin<sup style={{ fontSize: 9 }}>TM</sup>{" "}
          <span style={{ color: colors.BLACK(0.6) }}>(RSC)</span>
        </span>
        {/* </div> */}
      </div>
    ),
    body: (
      <div className={css(DEFAULT_ITEM_STYLE.rhCarouselItemBody)}>
        {
          "RSC is a reward token users earn for contributing content. Every upvote earns RSC. Holding RSC gives users the ability to create bounties, tip authors, and vote in community governance."
        }

        <div className={css(DEFAULT_ITEM_STYLE.learnMore)}>
          You can{" "}
          <ALink
            theme="solidPrimary"
            overrideStyle={[DEFAULT_ITEM_STYLE.link]}
            href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd101dcc414f310268c37eeb4cd376ccfa507f571"
            target="_blank"
          >
            {"trade RSC on Uniswap"}
          </ALink>{" "}
          and other exchanges.
        </div>
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
            "We’re a collection of skeptical, yet optimistic individuals who want to accelerate the pace of science. We think the incentives of scientific funding and publishing are broken, and that blockchain can help."
          }
          <div className={css(DEFAULT_ITEM_STYLE.learnMore)}>
            <ALink
              target="__blank"
              theme="solidPrimary"
              href="https://discord.gg/researchhub"
            >
              <span> Click to join us on Discord.</span>
            </ALink>
          </div>
        </span>
      </div>
    ),
  },
];
