export const addNewUser = (params) => {
  fetch(API.AUTHOR({}), API.POST_CONFIG(params))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      let selectedAuthors = [...this.state.selectedAuthors, resp];
      this.setState({
        selectedAuthors,
      });
    })
    .catch((err) => {
      if (err.response.status === 429) {
        this.props.modalActions.openRecaptchaPrompt(true);
      }
    });
};
