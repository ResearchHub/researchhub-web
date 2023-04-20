import Quill from 'quill';

const Embed = Quill.import('blots/embed');

class UserBlot extends Embed {
  static create(user) {
    const node = super.create(user);
    // node.dataset.firstName = user.firstName;
    // node.dataset.lastName = user.lastName;
    node.innerHTML = `@${user.firstName} ${user.lastName}`;

    node.setAttribute("data-id", `${user.id}`)
    node.setAttribute("data-name", `${user.firstName} ${user.lastName}`);
    return node;
  }

  static value(node) {
    return {
      userId: node.getAttribute("data-id"),
    };
  }  
}

UserBlot.blotName = 'user';
UserBlot.tagName = 'span';

export default UserBlot;
