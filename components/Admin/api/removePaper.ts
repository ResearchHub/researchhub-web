import API from "~/config/api";

export default function({ paperId }) => {
  const { paperId, removePaper, setMessage, showMessage } = this.props;

  return fetch(
    API.PAPER_CENSOR({ paperId, isRemoved: true }),
    API.PATCH_CONFIG({ id: paperId })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      setMessage("Paper Successfully Removed.");
      showMessage({ show: true });
      removePaper();
    })
    .catch((_error) => {
      setMessage("Unable to Remove Paper.");
      showMessage({ show: true });
    });
};