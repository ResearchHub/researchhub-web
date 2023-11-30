import type { Klass, LexicalNode } from "lexical";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { MarkNode } from "@lexical/mark";
import { OverflowNode } from "@lexical/overflow";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { PageBreakNode } from "./PageBreakNode";
import { ImageNode } from "./ImageNode";
import { VideoNode } from "./VideoNode";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { TableNode as NewTableNode } from "./TableNode";

const EditorNodes: Array<Klass<LexicalNode>> = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  CodeHighlightNode,
  MarkNode,
  HashtagNode,
  AutoLinkNode,
  OverflowNode,
  HorizontalRuleNode,
  LinkNode,
  PageBreakNode,
  ImageNode,
  VideoNode,
  NewTableNode,
];

export default EditorNodes;
