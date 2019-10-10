import PropTypes from "prop-types";
import { Fragment, useState } from "react";

import ActionButton from "~/components/ActionButton";
import ShareModal from "~/components/ShareModal";

import icons from "~/config/themes/icons";

const ShareAction = (props) => {
  const { iconNode, title, subtitle, url } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openShareModal() {
    setModalIsOpen(true);
  }

  function closeShareModal() {
    setModalIsOpen(false);
  }

  return (
    <Fragment>
      <ActionButton
        action={openShareModal}
        iconNode={iconNode || icons.share}
      />
      <ShareModal
        isOpen={modalIsOpen}
        close={closeShareModal}
        title={title}
        subtitle={subtitle}
        url={url}
      />
    </Fragment>
  );
};

ShareAction.propTypes = {
  iconNode: PropTypes.node,
  title: PropTypes.any,
  subtitle: PropTypes.any,
  url: PropTypes.string,
};

export default ShareAction;
