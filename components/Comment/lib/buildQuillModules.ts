import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const buildQuillModules = ({ editorId, handleSubmit, handleImageUpload }) => {
  const modules = {
    // magicUrl: true,
    keyboard: {
      bindings: {
        commandEnter: {
          key: 13,
          shortKey: true,
          metaKey: true,
          handler: handleSubmit,
        },
      },
    },
    toolbar: {
      // magicUrl: true,
      container: `#${editorId}`,
      handlers: {
        image: handleImageUpload,
      },
    },
  };

  return modules;
}

export default buildQuillModules;