/**
 * @license Copyright (c) 2014-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor.js";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment.js";
import AutoImage from "@ckeditor/ckeditor5-image/src/autoimage.js";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat.js";
import Autolink from "@ckeditor/ckeditor5-link/src/autolink.js";
import Autosave from "@ckeditor/ckeditor5-autosave/src/autosave.js";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote.js";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold.js";
import CloudServices from "@ckeditor/ckeditor5-cloud-services/src/cloudservices.js";
import Code from "@ckeditor/ckeditor5-basic-styles/src/code.js";
import CodeBlock from "@ckeditor/ckeditor5-code-block/src/codeblock.js";
import EasyImage from "@ckeditor/ckeditor5-easy-image/src/easyimage.js";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials.js";
import ExportToPDF from "@ckeditor/ckeditor5-export-pdf/src/exportpdf.js";
import Heading from "@ckeditor/ckeditor5-heading/src/heading.js";
import HorizontalLine from "@ckeditor/ckeditor5-horizontal-line/src/horizontalline.js";
import Image from "@ckeditor/ckeditor5-image/src/image.js";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption.js";
import ImageInsert from "@ckeditor/ckeditor5-image/src/imageinsert.js";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize.js";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle.js";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar.js";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload.js";
import Indent from "@ckeditor/ckeditor5-indent/src/indent.js";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic.js";
import Link from "@ckeditor/ckeditor5-link/src/link.js";
import List from "@ckeditor/ckeditor5-list/src/list.js";
import Markdown from "@ckeditor/ckeditor5-markdown-gfm/src/markdown.js";
import MathType from "@wiris/mathtype-ckeditor5";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed.js";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph.js";
import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
import PresenceList from "@ckeditor/ckeditor5-real-time-collaboration/src/presencelist.js";
import RealTimeCollaborativeComments from "@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativecomments.js";
import RealTimeCollaborativeEditing from "@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativeediting.js";
import RealTimeCollaborativeTrackChanges from "@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativetrackchanges.js";
import Table from "@ckeditor/ckeditor5-table/src/table.js";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar.js";
import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation.js";
import Watchdog from "@ckeditor/ckeditor5-watchdog/src/editorwatchdog.js";

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
  Alignment,
  AutoImage,
  Autoformat,
  Autolink,
  Autosave,
  BlockQuote,
  Bold,
  CloudServices,
  Code,
  CodeBlock,
  EasyImage,
  Essentials,
  ExportToPDF,
  Heading,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  Italic,
  Link,
  List,
  Markdown,
  MathType,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  PresenceList,
  RealTimeCollaborativeComments,
  RealTimeCollaborativeEditing,
  RealTimeCollaborativeTrackChanges,
  Table,
  TableToolbar,
  TextTransformation,
];

export default { Editor, Watchdog };
