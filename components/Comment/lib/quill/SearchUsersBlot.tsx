import React from 'react';
import ReactDOM from 'react-dom';
import SearchUsers from '~/components/SearchSuggestion/SearchUsers';

import Quill from "quill";
const Embed = Quill.import('blots/embed');

class SearchUsersBlot extends Embed {
  static create(value) {
    const node = super.create(value);
    const container = document.createElement('div');
    container.style.display = 'inline-block';

    const onUserSelect = value.onUserSelect || (() => null);
    ReactDOM.render(<SearchUsers onSelect={onUserSelect} />, container);
    node.appendChild(container);
    return node;
  }
}

SearchUsersBlot.blotName = 'searchUsers';
SearchUsersBlot.tagName = 'span';


export default SearchUsersBlot;
