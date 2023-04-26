import { convertToUserBlotType } from '../quill';
import SuggestUsersBlot from './SuggestUsersBlot';
import { SuggestedUser } from '~/components/SearchSuggestion/lib/types';

class MentionsModule {
  quill: any;
  options: any;
  suggestInputText: string;
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.suggestInputText = "";
    this.quill.container.addEventListener("keydown", this.handleKeyDown.bind(this))
  }

  handleKeyDown(event) {
    const cursorIndex = this.quill.getSelection()?.index || 0;
    const backspaceKey = event.keyCode === 8;
    const escKey = event.keyCode === 27;

    if (event.key === "@") {
      if (!this.suggestUsersEmbedded()) {
        this.insertSuggestUsersBlot(cursorIndex);
      }
    }
    else if (backspaceKey && this.suggestInputText === "" && this.suggestUsersEmbedded()) {
      event.preventDefault();
      this.removeSuggestUsersBlot({ insertAtChar: false });
      this.quill.setSelection(this.quill.getLength() + 1, "silent");
    }
    else if (escKey) {
      this.removeSuggestUsersBlot({ insertAtChar: false });
      this.quill.setSelection(this.quill.getLength() + 1, "silent");
    }
  }

  handleTextChange(suggestInputText) {
    this.suggestInputText = suggestInputText;
  }

  suggestUsersEmbedded() {
    const suggestUsersBlots = this.quill.scroll.descendants(SuggestUsersBlot, 0, this.quill.getLength());
    return suggestUsersBlots.length > 0;
  }

  getSuggestUsersBlot() {
    const [blot] = this.quill.scroll.descendants(SuggestUsersBlot, 0, this.quill.getLength());
    return blot;
  }
  
  insertSuggestUsersBlot(atIndex) {
    this.quill.insertEmbed(atIndex, 'suggestUsers', { onUserSelect: this.handleUserSelect.bind(this), onChange: this.handleTextChange.bind(this) });
    this.quill.setSelection(atIndex, "user");
  }

  removeSuggestUsersBlot({insertAtChar = false}) {
    const contents = this.quill.getContents();
    const newContents = {
      ops: contents.ops.filter((op) => {
        return !(typeof op.insert === 'object' && Object.keys(op.insert).includes(SuggestUsersBlot.blotName));
      }),
    };
    if (insertAtChar) {
      newContents.ops.push({ insert: "@" })
    }
    this.quill.setContents(newContents, "user");
  }

  handleUserSelect(user:SuggestedUser) {
    const userBlotValue = convertToUserBlotType(user);
    const [suggestUsersBlot] = this.quill.scroll.descendants(SuggestUsersBlot, 0, this.quill.getLength());
  
    if (!suggestUsersBlot) {
      return;
    }

    // Get the current position of the SuggestUsersBlot
    const atIndex = suggestUsersBlot.offset(this.quill.scroll);
  
    // Remove "@" character
    this.quill.deleteText(atIndex-1, 1);
  
    // Insert the new UserBlot at the current position
    this.quill.insertEmbed(atIndex, 'user', userBlotValue);
  
    // Move the cursor to the end of the newly inserted UserBlot
    this.quill.setSelection(atIndex + 1, "silent");

    this.removeSuggestUsersBlot({});

    // Move the cursor to the end of the newly inserted UserBlot
    this.quill.setSelection(this.quill.getLength() + 1, "silent");
  }
}

export default MentionsModule;
