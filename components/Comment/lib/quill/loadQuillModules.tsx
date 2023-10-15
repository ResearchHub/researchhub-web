import QuillPeerReviewRatingBlock from "../quillPeerReviewRatingBlock";
import MentionsModule from "./MentionsModule";
import SuggestUsersBlot from "./SuggestUsersBlot";
import UserBlot from "./UserBlot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOMServer from "react-dom/server";
import {
  faVideo,
  faImagePolaroid,
  faLinkSimple,
} from "@fortawesome/pro-regular-svg-icons";
import { faQuoteLeft } from "@fortawesome/pro-solid-svg-icons";

const loadQuillModules = ({ quillLib }) => {
  quillLib.register({ "formats/suggestUsers": SuggestUsersBlot });
  quillLib.register("modules/mentions", MentionsModule);
  quillLib.register(UserBlot);

  const MagicUrl = require("quill-magic-url").default;
  quillLib.register("modules/magicUrl", MagicUrl);

  quillLib.register(QuillPeerReviewRatingBlock);

  const icons = quillLib.import("ui/icons");
  icons.video = ReactDOMServer.renderToString(
    <FontAwesomeIcon icon={faVideo} />
  );
  icons.image = ReactDOMServer.renderToString(
    <FontAwesomeIcon icon={faImagePolaroid} />
  );
  icons.link = ReactDOMServer.renderToString(
    <FontAwesomeIcon icon={faLinkSimple} />
  );
  icons.blockquote = ReactDOMServer.renderToString(
    <FontAwesomeIcon icon={faQuoteLeft} />
  );
};

export default loadQuillModules;
