import { convertToUserBlotType } from '../quill';
import SuggestUsersBlot from './SuggestUsersBlot';
import { SuggestedUser } from '~/components/SearchSuggestion/lib/types';

class MentionsModule {
  quill: any;
  options: any;
  lastCharTyped: null;
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.handleTextChange = this.handleTextChange.bind(this);

    this.lastCharTyped = null;

    this.quill.on('text-change', this.handleTextChange);
  }

  handleTextChange() {
    const cursorIndex = this.quill.getSelection()?.index || 0;
    const textBeforeCursor = this.quill.getText(0, cursorIndex);
    this.lastCharTyped = textBeforeCursor.slice(-1);

    if (this.lastCharTyped === "@") {
      if (!this.suggestUsersEmbedded()) {
        this.insertSuggestUsersBlot(cursorIndex);
      }
    }
  }

  suggestUsersEmbedded() {
    const suggestUsersBlots = this.quill.scroll.descendants(SuggestUsersBlot, 0, this.quill.getLength());
    return suggestUsersBlots.length > 0;
  }
  
  insertSuggestUsersBlot(atIndex) {
    this.quill.insertEmbed(atIndex, 'suggestUsers', { onUserSelect: this.handleUserSelect.bind(this) });
    this.quill.setSelection(atIndex, "user");
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

    const contents = this.quill.getContents();
    const newContents = {
      ops: contents.ops.filter((op) => {
        return !(typeof op.insert === 'object' && Object.keys(op.insert).includes(SuggestUsersBlot.blotName));
      }),
    };
    this.quill.setContents(newContents, "user");

    // Move the cursor to the end of the newly inserted UserBlot
    this.quill.setSelection(this.quill.getLength() + 1, "silent");
  }
}

export default MentionsModule;
