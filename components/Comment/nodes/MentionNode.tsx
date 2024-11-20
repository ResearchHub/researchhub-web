import { TextNode, NodeKey, SerializedTextNode } from 'lexical';

export type SerializedMentionNode = SerializedTextNode & {
  mentionName: string;
  userData: any;
  type: 'mention';
  version: 1;
};

export class MentionNode extends TextNode {
  __mention: string;
  __userData: any;

  constructor(mentionName: string, userData: any, key?: NodeKey) {
    super(mentionName, key);
    this.__mention = mentionName;
    this.__userData = userData;
  }

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention, node.__userData, node.__key);
  }

  createDOM(): HTMLElement {
    const dom = super.createDOM();
    dom.classList.add('editor-mention');
    return dom;
  }

  isSimpleText(): boolean {
    return false;
  }

  isSegmented(): boolean {
    return false;
  }

  isInline(): boolean {
    return true;
  }

  canBeEmpty(): boolean {
    return false;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  isAtomic(): boolean {
    return true;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      userData: this.__userData,
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