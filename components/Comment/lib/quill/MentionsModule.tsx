import { convertToUserBlotType } from '../quill';
import SuggestUsersBlot from './SuggestUsersBlot';
import { SuggestedUser } from '~/components/SearchSuggestion/lib/types';

class MentionsModule {
  quill: any;
  options: any;
  suggestInputText: string;
  editorEl: any;
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.suggestInputText = "";
    this.editorEl = this.quill.container.closest(".CommentEditor");

    this.quill.container.addEventListener("keydown", this.handleKeyDown.bind(this))
    document.addEventListener("click", this.handleMouseClick.bind(this))
  }

  handleMouseClick(event) {
    const editorIsClicked =  this.editorEl.contains(event.target);
    const mentionBtnIsClicked =  event.target.closest(".ql-mention");

    if (this.suggestUsersEmbedded()) {
      this.removeSuggestUsersBlot();
    }
    else if (editorIsClicked && mentionBtnIsClicked) {
      const cursorIndex = this.quill.getSelection()?.index || 0;
      this.quill.insertText(cursorIndex, "@")
      this.insertSuggestUsersBlot(cursorIndex+1);
    }
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
      this.removeSuggestUsersBlot();
      this.quill.setSelection(this.quill.getLength() + 1, "silent");
    }
    else if (escKey) {
      this.removeSuggestUsersBlot();
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

  removeSuggestUsersBlot() {
    const contents = this.quill.getContents();
    const newContents = {
      ops: contents.ops.filter((op) => {
        return !(typeof op.insert === 'object' && Object.keys(op.insert).includes(SuggestUsersBlot.blotName));
      }),
    };
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

    this.removeSuggestUsersBlot();

    // Move the cursor to the end of the newly inserted UserBlot
    this.quill.setSelection(this.quill.getLength() + 1, "silent");
  }
}

export default MentionsModule;
