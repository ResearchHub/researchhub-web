import MentionsModule from "./MentionsModule";
import SearchUsersBlot from "./SearchUsersBlot";
import UserBlot from "./UserBlot";

const loadQuillModules = ({ quillLib, quillInstance }) => {
  quillLib.register({ 'formats/searchUsers': SearchUsersBlot });
  quillLib.register('modules/mentions', MentionsModule);
  quillLib.register(UserBlot);


  quillInstance.update({
    modules: {
      toolbar: false,
      mentions: true,
    },
  });

  // Explicit initialization of MentionsModule is necessary
  const mentionsModule = new MentionsModule(quillInstance, {});

};

export default loadQuillModules;