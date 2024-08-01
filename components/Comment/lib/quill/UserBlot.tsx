import Quill from 'quill';
const Embed = Quill.import('blots/embed');

class UserBlot extends Embed {
  static create(user) {
    const node = super.create(user);
    const html = UserBlot.buildHTML(user)
    node.innerHTML = html;
    
    node.setAttribute("data-id", `${user.userId}`)
    node.setAttribute("data-first-name", `${user.firstName}`);
    node.setAttribute("data-last-name", `${user.lastName}`);
    node.setAttribute("data-author-id", `${user.authorProfileId}`);
    return node;
  }

  static value(node) {
    return {
      userId: node.getAttribute("data-id"),
      firstName: node.getAttribute("data-first-name"),
      lastName: node.getAttribute("data-last-name"),
      authorProfileId: node.getAttribute("data-author-id"),
    };
  }
  
  static buildHTML(user) {
    const hasName = (user.firstName + user.lastName).length > 0;
    const fullName = hasName ? `${user.firstName} ${user.lastName}` : "Unknown User";
    return `<a class="ql-user" href="/author/${user.authorProfileId}">@${fullName}</a>`
  }
}

UserBlot.blotName = 'user';
UserBlot.tagName = 'span';

export default UserBlot;
