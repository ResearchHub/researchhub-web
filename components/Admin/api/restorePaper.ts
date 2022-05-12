const restorePaper = () => {
    const { setMessage, showMessage, paperId, restorePaper } = this.props;

    return fetch(
      API.PAPER_CENSOR({ paperId, isRemoved: false }),
      API.PATCH_CONFIG({ id: paperId })
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setMessage("Paper Successfully Restored.");
        showMessage({ show: true });
        restorePaper();
      })
      .catch((_error) => {
        setMessage("Unable to Restore Paper.");
        showMessage({ show: true });
      });
  };