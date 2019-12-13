import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

import ComponentWrapper from "~/components/ComponentWrapper";
import colors from "~/config/themes/colors";

class Privacy extends React.Component {
  render() {
    return (
      <div className={css(styles.page)}>
        <ComponentWrapper>
          <h1>ResearchHub Privacy Policy</h1>
          This Privacy Policy describes how your personal information is
          collected, used, and shared when you visit{" "}
          <Link href={"/"} as={"/"}>
            https://researchnow.researchhub.com/
          </Link>{" "}
          (the “Site”).
          <h1>PERSONAL INFORMATION WE COLLECT</h1>
          <div className={css(styles.paragraph)}>
            When you visit the Site, we automatically collect certain
            information about your device, including information about your web
            browser, IP address, time zone, and some of the cookies that are
            installed on your device. Additionally, as you browse the Site, we
            collect information about the individual web pages or products that
            you view, what websites or search terms referred you to the Site,
            and information about how you interact with the Site. We refer to
            this automatically-collected information as “Device Information.”
          </div>
          <div className={css(styles.paragraph)}>
            We collect Device Information using the following technologies:
          </div>
          <ul>
            <li>
              “Cookies” are data files that are placed on your device or
              computer and often include an anonymous unique identifier. For
              more information about cookies, and how to disable cookies, visit
              http://www.allaboutcookies.org.
            </li>
            <li>
              “Log files” track actions occurring on the Site, and collect data
              including your IP address, browser type, Internet service
              provider, referring/exit pages, and date/time stamps.
            </li>
            <li>
              “Web beacons,” “tags,” and “pixels” are electronic files used to
              record information about how you browse the Site.
            </li>
          </ul>
          {/*<div className={css(styles.paragraph)}>
                Additionally when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number.  We refer to this information as “Order Information.”
            </div>*/}
          <div className={css(styles.paragraph)}>
            When we talk about “Personal Information” in this Privacy Policy, we
            are talking both about Device Information.
          </div>
          <h1>HOW DO WE USE YOUR PERSONAL INFORMATION?</h1>
          {/*<div className={css(styles.paragraph)}>
                We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).  Additionally, we use this Order Information to:
            </div>
            <div className={css(styles.paragraph)}>
                Communicate with you;
            </div>
            <div className={css(styles.paragraph)}>
                Screen our orders for potential risk or fraud; and
            </div>
            <div className={css(styles.paragraph)}>
                When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.
            </div>*/}
          <div className={css(styles.paragraph)}>
            We use the Device Information that we collect to help us screen for
            potential risk and fraud (in particular, your IP address), and more
            generally to improve and optimize our Site (for example, by
            generating analytics about how our customers browse and interact
            with the Site, and to assess the success of our marketing and
            advertising campaigns).
          </div>
          <h1>SHARING YOUR PERSONAL INFORMATION</h1>
          <div className={css(styles.paragraph)}>
            We share your Personal Information with third parties to help us use
            your Personal Information, as described above. We use Google
            Analytics to help us understand how our customers use the Site--you
            can read more about how Google uses your Personal Information here:
            https://www.google.com/intl/en/policies/privacy/. You can also
            opt-out of Google Analytics here:
            https://tools.google.com/dlpage/gaoptout.
          </div>
          <div className={css(styles.paragraph)}>
            Finally, we may also share your Personal Information to comply with
            applicable laws and regulations, to respond to a subpoena, search
            warrant or other lawful request for information we receive, or to
            otherwise protect our rights.
          </div>
          <h1>DO NOT TRACK</h1>
          <div className={css(styles.paragraph)}>
            Please note that we do not alter our Site’s data collection and use
            practices when we see a Do Not Track signal from your browser.
          </div>
          <h1>YOUR RIGHTS</h1>
          <div className={css(styles.paragraph)}>
            If you are a European resident, you have the right to access
            personal information we hold about you and to ask that your personal
            information be corrected, updated, or deleted. If you would like to
            exercise this right, please contact us through the contact
            information below.
          </div>
          <div className={css(styles.paragraph)}>
            Additionally, if you are a European resident we note that we are
            processing your information in order to fulfill contracts we might
            have with you (for example if you make an order through the Site),
            or otherwise to pursue our legitimate business interests listed
            above. Additionally, please note that your information will be
            transferred outside of Europe, including to Canada and the United
            States.
          </div>
          <h1>DATA RETENTION</h1>
          <div className={css(styles.paragraph)}>
            We will maintain your personal information for our records unless
            and until you ask us to delete this information.
          </div>
          <h1>CHANGES</h1>
          <div className={css(styles.paragraph)}>
            We may update this privacy policy from time to time in order to
            reflect, for example, changes to our practices or for other
            operational, legal or regulatory reasons.
          </div>
          <h1>CONTACT US</h1>
          <div className={css(styles.paragraph)}>
            For more information about our privacy practices, if you have
            questions, or if you would like to make a complaint, please contact
            us by e-mail at hello@researchhub.com or by mail using the details
            provided below:
          </div>
          <div className={css(styles.paragraph)}>
            430 California Street, San Francisco, CA, 94104, United States
          </div>
        </ComponentWrapper>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 10,
    paddingBottom: 20,
    maxWidth: "100vw",
    overflow: "hidden",
  },
  paragraph: {
    marginTop: 7,
    marginBottom: 7,
  },
});

export default Privacy;
