import { TextNode, NodeKey, SerializedTextNode } from 'lexical';
import { StyleSheet, css } from 'aphrodite';
import colors from '~/config/themes/colors';

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
    const dom = document.createElement('span');
    dom.className = css(styles.mention);
    
    const badge = document.createElement('span');
    badge.className = css(styles.badge);
    
    if (this.__userData?.avatarUrl) {
      const avatar = document.createElement('img');
      avatar.src = this.__userData.avatarUrl;
      avatar.className = css(styles.avatar);
      badge.appendChild(avatar);
    }
    
    const name = document.createElement('span');
    name.textContent = this.__mention;
    badge.appendChild(name);
    
    dom.appendChild(badge);
  
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

const styles = StyleSheet.create({
  mention: {
    display: 'inline-block',
    margin: '0 2px',
    verticalAlign: 'baseline',
  },
  badge: {
    backgroundColor: '#e8f2ff',
    color: '#1877f2',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 500,
    border: '1px solid #1877f2',
    display: 'inline-flex',
    alignItems: 'center',
    ':hover': {
      backgroundColor: '#d8e6fd',
      cursor: 'default',
    }
  },
  avatar: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    marginRight: '4px',
    objectFit: 'cover',
  }
});

export function $createMentionNode(mention: string, user: any): MentionNode {
  return new MentionNode(mention, user);
}
