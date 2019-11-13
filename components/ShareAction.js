import PropTypes from "prop-types";
import { Fragment, useState } from "react";

import ActionButton from "~/components/ActionButton";
import ShareModal from "~/components/ShareModal";

import icons from "~/config/themes/icons";

const ShareAction = (props) => {
  const { customButton, iconNode, title, subtitle, url, addRipples } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openShareModal() {
    setModalIsOpen(true);
  }

  function closeShareModal() {
    setModalIsOpen(false);
  }

  function renderButton() {
    if (customButton) {
      return <a onClick={openShareModal}>{customButton}</a>;
    } else {
      return (
        <ActionButton
          action={openShareModal}
          iconNode={iconNode || icons.share}
          addRipples={addRipples && addRipples}
        />
      );
    }
  }

  return (
    <Fragment>
      {renderButton()}
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
  customButton: PropTypes.node,
  iconNode: PropTypes.node,
  title: PropTypes.any,
  subtitle: PropTypes.any,
  url: PropTypes.string,
};

export default ShareAction;
