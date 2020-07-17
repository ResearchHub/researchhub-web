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
          <p className={css(styles.paragraph)}>
            Effective May 20, 2020. Last Revised July 7, 2020
          </p>
          <p className={css(styles.paragraph)}>
            We want you to understand how and why ResearchHub, Inc.
            (“ResearchHub,” “we” or “us”) collects, uses, and shares information
            about you when you use our websites, mobile apps, and other online
            products and services (collectively, the "Services") or when you
            otherwise interact with us or receive a communication from us. This
            Privacy Policy applies to all of our Services.
          </p>
          <h2>
            <strong>What We Collect</strong>
          </h2>
          <h3 className={css(styles.header)}>Information You Provide to Us</h3>
          <p className={css(styles.paragraph)}>
            We collect information you provide to us directly when you use the
            Services. This includes:
          </p>
          <p className={css(styles.paragraph)}>
            <i>Account information.</i> To create an account, you must provide a
            username and password. Your username is public, and it doesn’t have
            to be related to your real name. You may also provide an email
            address. We also store your user account preferences and settings.
          </p>
          <p className={css(styles.paragraph)}>
            <i>Content you submit.</i> We collect the content you submit to the
            Services. Your content may include research outputs, text, links,
            images, gifs, and videos.
          </p>
          <p className={css(styles.paragraph)}>
            <i>Actions you take.</i> We collect information about the actions
            you take when using the Services. This includes your interactions
            with content, like voting, saving, hiding, and reporting. It also
            includes your interactions with other users, such as following,
            friending, and blocking. We collect your interactions with
            communities, like your subscriptions or moderator status.
          </p>
          <p className={css(styles.paragraph)}>
            <i>Transactional information.</i> If you purchase products or
            services from us we will collect certain information from you,
            including your name, address, email address, and information about
            the product or service you are purchasing.
          </p>
          <p className={css(styles.paragraph)}>
            <i>Other information.</i> You may choose to provide other
            information directly to us. For example, we may collect information
            when you fill out a form, participate in ResearchHub-sponsored
            activities or promotions, apply for a job, request customer support
            or otherwise communicate with us.
          </p>
          <h3 className={css(styles.header)}>
            Information We Collect Automatically
          </h3>
          <p className={css(styles.paragraph)}>
            When you access or use our Services, we may also automatically
            collect information about you. This includes:
          </p>
          <p className={css(styles.paragraph)}>
            <i>Log and usage data.</i> We may log information when you access
            and use the Services. This may include your IP address, user-agent
            string, browser type, operating system, referral URLs, device
            information (e.g., device IDs), pages visited, links clicked, the
            requested URL, hardware settings, and search terms. Except for the
            IP address used to create your account, ResearchHub will delete any
            IP addresses collected after 100 days.
          </p>
          <p className={css(styles.paragraph)}>
            <i>Information collected from cookies and similar technologies.</i>{" "}
            We may receive information from cookies, which are pieces of data
            your browser stores and sends back to us when making requests, and
            similar technologies. We use this information to improve your
            experience, understand user activity, personalize content and
            advertisements, and improve the quality of our Services. For more
            information on how you can disable cookies, please see “Your
            Choices” below.
          </p>
          <p className={css(styles.paragraph)}>
            <i>Location information.</i> We may receive and process information
            about your location. For example, with your consent, we may collect
            information about the specific location of your mobile device (for
            example, by using GPS or Bluetooth). We may also receive location
            information from you when you choose to share such information on
            our Services, including by associating your content with a location,
            or we may derive your approximate location from other information
            about you, including your IP address.
          </p>
          <h3 className={css(styles.header)}>
            Information Collected from Other Sources
          </h3>
          <p className={css(styles.paragraph)}>
            <i>Linked services.</i> If you authorize or link other services
            (e.g., third-party apps or websites) to access your ResearchHub
            account, ResearchHub receives information about your use of that
            service when it uses that authorization. Linking services may also
            cause the other service to send us information about your account
            with that service. To learn how information is shared with linked
            services, see “How Information About You Is Shared” below.
          </p>
          <p className={css(styles.paragraph)}>
            <i>Information collected from integrations.</i> We also may receive
            information about you, including log and usage data and cookie
            information, from third-party websites that integrate our Services,
            including our embeds, buttons, and advertising technology.
          </p>
          <h2>
            <strong>How We Use Information About You</strong>
          </h2>
          <p className={css(styles.paragraph)}>
            We use information about you to:
          </p>
          <ul>
            <li>Provide, maintain, and improve the Services;</li>
          </ul>
          <li>Research and develop new services;</li>
          <li>
            Help protect the safety of ResearchHub and our users, which includes
            blocking suspected spammers, addressing abuse, and enforcing the
            ResearchHub user agreement and our other policies;
          </li>
          <li>
            Send you technical notices, updates, security alerts, invoices and
            other support and administrative messages;
          </li>
          <li>Provide customer service;</li>
          <li>
            Communicate with you about products, services, offers, promotions,
            and events, and provide other news and information we think will be
            of interest to you{" "}
          </li>
          <li>
            Monitor and analyze trends, usage, and activities in connection with
            our Services; and
          </li>
          <li>
            Personalize the Services and provide advertisements, content and
            features that match user profiles or interests.{" "}
          </li>
          <h2>
            <strong>How Information About You Is Shared</strong>
          </h2>
          <p className={css(styles.paragraph)}>
            When you use the Services, certain information may be shared with
            other users and the public. For example:
          </p>
          <ul>
            <li>
              When you submit content (such as a post or comment) to the
              Services, any visitors to and users of our Services will be able
              to see that content, the username associated with the content, and
              the date and time you originally submitted the content.{" "}
            </li>
          </ul>
          <ul>
            <li>
              When you send private messages, messages via modmail, or private
              chats, the recipients of those messages will be able to see the
              content of your message, your username, and the date and time the
              message was sent. Keep in mind that additional users may be
              invited to join a private chat after you send a message.
              Moderators may elect to have modmail forwarded to their email
              accounts and, as a result, any modmail received by these
              moderators will be subject to the terms and policies of the
              moderator’s email provider.
            </li>
          </ul>
          <ul>
            <li>
              When other users view your profile, they will be able to see
              information about your activities on the Services, such as your
              username, prior posts and comments, karma, trophies, moderator
              status, ResearchHub Gold status, and how long you have been a
              member of the Services. If you choose to make the information
              public, your profile may also include your voting history.
            </li>
          </ul>
          <ul>
            <li>
              We offer social sharing features that let you share content or
              actions you take on our Services with other media. Your use of
              these features enables the sharing of certain information with
              your friends or the public, depending on the settings you
              establish with the third party that provides the social sharing
              feature. For more information about the purpose and scope of data
              collection and processing in connection with social sharing
              features, please visit the privacy policies of the third parties
              that provide these social sharing features (e.g.Twitter).
            </li>
          </ul>
          <p className={css(styles.paragraph)}>
            Please note that, even when you delete your account, the posts,
            comments and messages you submit through the Services may still be
            viewable or available on our servers.{" "}
          </p>
          <p className={css(styles.paragraph)}>
            Otherwise, we do not share, sell, or give away your personal
            information to third parties unless one of the following
            circumstances applies:
          </p>
          <ul>
            <li>
              <i>With linked services.</i> If you link your ResearchHub account
              with a third-party service, ResearchHub will share the information
              you authorize with that third-party service.{" "}
            </li>
          </ul>
          <ul>
            <li>
              <i>With our partners.</i> We may share information with vendors,
              consultants, and other service providers (but not with advertisers
              and ad partners) who need access to such information to carry out
              work for us. The partner’s use of personal data will be subject to
              appropriate confidentiality and security measures.
            </li>
          </ul>
          <ul>
            <li>
              <i>To comply with the law.</i> We may share information in
              response to a request for information if we believe disclosure is
              in accordance with, or required by, any applicable law,
              regulation, legal process or governmental request, including, but
              not limited to, meeting national security or law enforcement
              requirements. To the extent the law allows it, we will attempt to
              provide you with prior notice before disclosing your information
              in response to such a request.{" "}
            </li>
          </ul>
          <ul>
            <li>
              <i>In an emergency.</i> We may share information if we believe
              it's necessary to prevent imminent and serious bodily harm to a
              person.
            </li>
          </ul>
          <ul>
            <li>
              <i>To enforce our policies and rights.</i> We may share
              information if we believe your actions are inconsistent with our
              user agreements, or other ResearchHub policies, or to protect the
              rights, property, and safety of ourselves and others.
            </li>
          </ul>
          <ul>
            <li>
              <i>With our affiliates.</i> We may share information between and
              among ResearchHub, and any of our parents, affiliates,
              subsidiaries, and other companies under common control and
              ownership.
            </li>
          </ul>
          <ul>
            <li>
              <i>With your consent.</i> We may share information about you with
              your consent or at your direction.
            </li>
          </ul>
          <ul>
            <li>
              <i>Aggregated or de-identified information.</i> We may share
              information about you that has been aggregated or anonymized such
              that it cannot reasonably be used to identify you. For example, we
              may show the total number of times a post has been upvoted without
              identifying who the visitors were.
            </li>
          </ul>
          <h2>
            <strong>Analytics Partners</strong>
          </h2>
          <p className={css(styles.paragraph)}>
            We may partner with analytics providers to deliver advertising and
            content targeted to your interests and to better understand your use
            of the Services. These third parties may collect information sent by
            your computer, browser, or mobile device in response to a request
            for content, such as unique identifiers, your IP address, or other
            information about your computer or device. For example:
          </p>
          <p className={css(styles.paragraph)}>
            We use analytics partners (such as Google Analytics) to help analyze
            usage and traffic for our Services. As an example, we may use
            analytics partners to analyze and measure, in the aggregate, the
            number of unique visitors to our Services.
          </p>
          <h2>
            <strong>Your Choices</strong>
          </h2>
          <p className={css(styles.paragraph)}>
            As a ResearchHub user, you have choices about how to protect and
            limit the collection, use, and disclosure of information about you.
          </p>
          <h3 className={css(styles.header)}>Accessing Your Information</h3>
          <p className={css(styles.paragraph)}>
            You can also request a copy of the personal information ResearchHub
            maintains about you by emailing hello@ResearchHub.com
          </p>
          <h3 className={css(styles.header)}>Deleting Your Account</h3>
          <p className={css(styles.paragraph)}>
            You may delete your account information at any time from the user
            settings page. You can also submit a request to delete the personal
            information ResearchHub maintains about you by emailing
            hello@ResearchHub.com. When you delete your account, your profile is
            no longer visible to other users and disassociated from content you
            posted under that account. Please note, however, that the posts,
            comments, and messages you submitted prior to deleting your account
            will still be visible to others unless you first delete the specific
            content. We may also retain certain information about you as
            required by law or for legitimate business purposes after you delete
            your account.
          </p>
          <h3 className={css(styles.header)}>Controlling the Use of Cookies</h3>
          <p className={css(styles.paragraph)}>
            Most web browsers are set to accept cookies by default. If you
            prefer, you can usually choose to set your browser to remove or
            reject first- and third-party cookies. Please note that if you
            choose to remove or reject cookies, this could affect the
            availability and functionality of our Services.
          </p>
          <h3 className={css(styles.header)}>Controlling Analytics</h3>
          <p className={css(styles.paragraph)}>
            Some analytics providers we partner with may provide specific
            opt-out mechanisms and we may provide, as needed and as available,
            additional tools and third-party services that allow you to better
            understand cookies and how you can opt-out. For example, you may
            manage the use and collection{" "}
          </p>
          <h3 className={css(styles.header)}>Do Not Track</h3>
          <p className={css(styles.paragraph)}>
            Most modern web browsers give you the option to send a Do Not Track
            signal to the websites you visit, indicating that you do not wish to
            be tracked. However, there is no accepted standard for how a website
            should respond to this signal, and we do not take any action in
            response to this signal. Instead, in addition to publicly available
            third-party tools, we offer you the choices described in this policy
            to manage the collection and use of information about you.
          </p>

          <h2>
            <strong>Other Information</strong>
          </h2>
          <h3 className={css(styles.header)}>Information Security</h3>
          <p className={css(styles.paragraph)}>
            We take measures to help protect information about you from loss,
            theft, misuse and unauthorized access, disclosure, alteration, and
            destruction. For example, we use HTTPS while information is being
            transmitted. We also enforce technical and administrative access
            controls to limit which of our employees have access to non-public
            personal information.
          </p>
          <h3 className={css(styles.header)}>Data Retention</h3>
          <p className={css(styles.paragraph)}>
            We store the information we collect for as long as it is necessary
            for the purpose(s) for which we originally collected it. We may
            retain certain information for legitimate business purposes or as
            required by law.
          </p>
          <h3 className={css(styles.header)}>International Data Transfers</h3>
          <p className={css(styles.paragraph)}>
            We are based in the United States and we process and store
            information on servers located in the United States. We may store
            information on servers and equipment in other countries depending on
            a variety of factors, including the locations of our users and
            service providers. By accessing or using the Services or otherwise
            providing information to us, you consent to the processing, transfer
            and storage of information in and to the U.S. and other countries,
            where you may not have the same rights as you do under local law.
          </p>
          <p className={css(styles.paragraph)}>
            In connection with ResearchHub's processing of personal data
            received from the European Union and Switzerland, we adhere to the
            EU-U.S. and Swiss-U.S. Privacy Shield Program (“Privacy Shield”) and
            comply with its framework and principles.
          </p>
          <p className={css(styles.paragraph)}>
            Please direct any inquiries or complaints regarding our compliance
            with the Privacy Shield principles to the point of contact listed in
            the “Contact Us” section below. If we do not resolve your complaint,
            you may submit your complaint free of charge to JAMS. Under certain
            conditions specified by the Privacy Shield principles, you may also
            be able to invoke binding arbitration to resolve your complaint. We
            are subject to the investigatory and enforcement powers of the
            Federal Trade Commission. If we share EU or Swiss data with a
            third-party service provider that processes the data solely on our
            behalf, then we will be liable for that third party’s processing of
            EU or Swiss data{" "}
          </p>
          <h3 className={css(styles.header)}>
            Additional Information for EEA Users
          </h3>
          <p className={css(styles.paragraph)}>
            Users in the European Economic Area have the right to request access
            to, rectification of, or erasure of their personal data; to data
            portability in certain circumstances; to request restriction of
            processing; to object to processing; and to withdraw consent for
            processing where they have previously provided consent. These rights
            can be exercised using the information provided under “Your Choices”
            above or as described in the “Other Information - Data Subject and
            Consumer Information Requests” section below. EEA users also have
            the right to lodge a complaint with their local supervisory
            authority.
          </p>
          <p className={css(styles.paragraph)}>
            As required by applicable law, we collect and process information
            about individuals in the EEA only where we have legal bases for
            doing so. Our legal bases depend on the Services you use and how you
            use them. We process your information on the following legal bases:
          </p>
          <ul>
            <li>You have consented for us to do so for a specific purpose;</li>
          </ul>
          <ul>
            <li>
              We need to process the information to provide you the Services,
              including to operate the Services, provide customer support and
              personalized features and to protect the safety and security of
              the Services;
            </li>
          </ul>
          <ul>
            <li>
              It satisfies a legitimate interest (which is not overridden by
              your data protection interests), such as preventing fraud,
              ensuring network and information security, enforcing our rules and
              policies, protecting our legal rights and interests, research and
              development, and marketing and promoting the Services;
            </li>
          </ul>
          <ul>
            <li>
              We need to process your information to comply with our legal
              obligations.
            </li>
          </ul>
          <h3 className={css(styles.header)}>
            Data Subject and Consumer Information Requests
          </h3>
          <p className={css(styles.paragraph)}>
            Requests for a copy of the information ResearchHub has about your
            account—including EU General Data Protection Regulation (GDPR) data
            subject access requests and California Consumer Privacy Act (CCPA)
            consumer information requests—can be submitted by emailing
            hello@ResearchHub.com
          </p>
          <p className={css(styles.paragraph)}>
            All other data subject and consumer requests under data protection
            laws should be sent via email to <u>hello@ResearchHub.com</u> from
            the email address that you have verified with your ResearchHub
            account.
          </p>
          <p className={css(styles.paragraph)}>
            Before we process a request from you about your personal
            information, we need to verify the request via your access to your
            ResearchHub account or to a verified email address associated with
            your ResearchHub account. You may also designate an authorized agent
            to exercise these rights on your behalf. ResearchHub does not
            discriminate against users for exercising their rights under data
            protection laws to make requests regarding their personal
            information.
          </p>
          <h3 className={css(styles.header)}>Children</h3>
          <p className={css(styles.paragraph)}>
            Children under the age of 13 are not allowed to create an account or
            otherwise use the Services. Additionally, if you are in the EEA, you
            must be over the age required by the laws of your country to create
            an account or otherwise use the Services, or we need to have
            obtained verifiable consent from your parent or legal guardian.
          </p>
          <h3 className={css(styles.header)}>Changes to This Policy</h3>
          <p className={css(styles.paragraph)}>
            We may change this Privacy Policy from time to time. If we do, we
            will let you know by revising the date at the top of the policy. If
            we make a change to this policy that, in our sole discretion, is
            material, we will provide you with additional notice. We encourage
            you to review the Privacy Policy whenever you access or use our
            Services or otherwise interact with us to stay informed about our
            information practices and the ways you can help protect your
            privacy. By continuing to use our Services after Privacy Policy
            changes go into effect, you agree to be bound by the revised policy.
          </p>
          <h2>
            <strong>Contact Us</strong>
          </h2>
          <p className={css(styles.paragraph)}>
            If you would like to get in contact with us, please reach out to{" "}
            <a href="mailto:hello@researchhub.com" target="_blank">
              hello@ResearchHub.com
            </a>
          </p>
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
    lineHeight: 1.6,
  },
  paragraph: {
    marginTop: 7,
    marginBottom: 7,
    fontWeight: 400,
  },
  header: {
    fontWeight: 500,
  },
});

export default Privacy;
