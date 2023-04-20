// SearchUsersBlot.js
import ReactQuill from 'react-quill';
import React from 'react';
import ReactDOM from 'react-dom';
import SearchUsers from '~/components/SearchSuggestion/SearchUsers';

const Quill = ReactQuill.Quill;
const Embed = Quill.import('blots/block/embed');

class SearchUsersBlot extends Embed {
  
  static create(value) {
    const node = super.create(value);
    const container = document.createElement('div');
    const onUserSelect = value.onUserSelect || (() => null);
    ReactDOM.render(<SearchUsers onSelect={onUserSelect} />, container);
    node.appendChild(container);
    return node;
  }
}

SearchUsersBlot.blotName = 'searchUsers';
SearchUsersBlot.tagName = 'div';

export default SearchUsersBlot;