import { TextNode, NodeKey, SerializedTextNode } from 'lexical';

export type SerializedMentionNode = SerializedTextNode & {
  mentionName: string;
  userData: any;
  type: 'mention';
  version: 1;
};

export class MentionNode extends TextNode {
  __mention: string;
  __user: any;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention, node.__user, node.__key);
  }

  constructor(mention: string, user: any, key?: NodeKey) {
    super(mention, key);
    this.__mention = mention;
    this.__user = user;
  }

  createDOM(config: any): HTMLElement {
    const dom = document.createElement('span');
    dom.classList.add('editor-mention');
    dom.textContent = this.__mention;
    return dom;
  }

  updateDOM(): false {
    return false;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      userData: this.__user,
      type: 'mention',
      version: 1,
    };
  }

  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    const node = new MentionNode(
      serializedNode.mentionName,
      serializedNode.userData
    );
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }
}

export function $createMentionNode(mention: string, user: any): MentionNode {
  return new MentionNode(mention, user);
} 