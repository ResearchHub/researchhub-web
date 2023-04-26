import React from 'react';
import ReactDOM from 'react-dom';
import SuggestUsers from '~/components/SearchSuggestion/SuggestUsers';

import Quill from "quill";
const Embed = Quill.import('blots/embed');

class SuggestUsersBlot extends Embed {
  static create(value) {
    const node = super.create(value);
    const container = document.createElement('div');
    container.style.display = 'inline-block';
    
    const onUserSelect = value.onUserSelect || (() => null);
    const onChange = value.onChange || (() => null);
    ReactDOM.render(<SuggestUsers onSelect={onUserSelect} onChange={onChange} />, container);
    node.appendChild(container);
    return node;
  }
}

SuggestUsersBlot.blotName = 'suggestUsers';
SuggestUsersBlot.tagName = 'span';


export default SuggestUsersBlot;
