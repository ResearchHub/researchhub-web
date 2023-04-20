import ReactDOM from 'react-dom';
import SearchUsers from '~/components/SearchSuggestion/SearchUsers';
import SearchUsersBlot from './SearchUsersBlot';
import UserBlot from './UserBlot';


// class MentionsModule {
//   constructor(quill, options) {
//     const container = document.createElement('div');
//     ReactDOM.render(<SearchUsers onSelect={() => null} />, container);
//     quill.root.parentNode.appendChild(container);
//   }
// }

// export default MentionsModule;

// MentionsModule.js
class MentionsModule {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.isActive = false;
    this.handleTextChange = this.handleTextChange.bind(this);

    this.quill.on('text-change', this.handleTextChange);
  }

  handleTextChange() {
    const index = this.quill.getSelection()?.index || 0;
    const textBeforeCursor = this.quill.getText(0, index);
    const atIndex = textBeforeCursor.lastIndexOf('@');

    if (atIndex !== -1) {
      if (!this.searchUsersExists()) {
        this.insertSearchUsersBlot(atIndex);
      }
    }
  }

  searchUsersExists() {
    const searchUsersBlots = this.quill.scroll.descendants(SearchUsersBlot, 0, this.quill.getLength());
    return searchUsersBlots.length > 0;
  }
  
  insertSearchUsersBlot(atIndex) {
    this.quill.insertEmbed(atIndex, 'searchUsers', { onUserSelect: this.handleUserSelect.bind(this) }, "user");
    this.quill.setSelection(atIndex + 1, "user");
  }
  

  handleUserSelect(user) {
    // Find the SearchUsersBlot instance in the scroll
    const [searchUsersBlot] = this.quill.scroll.descendants(SearchUsersBlot, 0, this.quill.getLength());
  
    if (!searchUsersBlot) {
      return;
    }
  
    // Get the current position of the SearchUsersBlot
    const atIndex = searchUsersBlot.offset(this.quill.scroll);
  
    // Remove the existing SearchUsersBlot
    this.quill.deleteText(atIndex, 1, "user");
  
    // Insert the new UserBlot at the current position
    this.quill.insertEmbed(atIndex, 'user', user, "user");
  
    // Move the cursor to the end of the newly inserted UserBlot
    this.quill.setSelection(atIndex + 1, "silent");

    console.log('user', user)
    console.log('quill', this.quill.getContents())
  }
  
  
  
  
}

export default MentionsModule;
