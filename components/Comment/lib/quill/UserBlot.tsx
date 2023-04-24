import Quill from 'quill';
const Embed = Quill.import('blots/embed');

class UserBlot extends Embed {
  static create(user) {
    const node = super.create(user);
    node.innerHTML = `${user.firstName} ${user.lastName}`;

    node.setAttribute("data-id", `${user.id}`)
    node.setAttribute("data-first-name", `${user.firstName}`);
    node.setAttribute("data-last-name", `${user.lastName}`);
    return node;
  }

  static value(node) {
    return {
      userId: node.getAttribute("data-id"),
      firstName: node.getAttribute("data-first-name"),
      lastName: node.getAttribute("data-last-name"),
    };
  }  
}

UserBlot.blotName = 'user';
UserBlot.tagName = 'span';

export default UserBlot;
