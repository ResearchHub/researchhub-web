import withWebSocket from "~/components/withWebSocket";
import BaseModal from "../Modals/BaseModal";
import Button from "../Form/Button";
import { generateApiUrl } from "~/config/api";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { connect } from "react-redux";

const AddPublicationModal = ({ wsResponse }) => {

  const handleClick = async () => {

      const url = generateApiUrl(
        `paper/test`
      );
    
      try {
        const response = await fetch(url, API.GET_CONFIG());
      } catch (error) {
        console.log('error', error)
      }


  }

  return (
    <BaseModal
      isOpen={true}
      closeModal={() => null}
      zIndex={1000000001}
    >
      <Button onClick={handleClick}>Trigger</Button>
    </BaseModal>
  )
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = (dispatch) => ({});

export default withWebSocket(
  // @ts-ignore legacy hook
  connect(mapStateToProps, mapDispatchToProps)(AddPublicationModal)
);
