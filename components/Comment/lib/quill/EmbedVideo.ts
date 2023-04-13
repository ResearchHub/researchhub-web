import Quill from "quill";
import { focusEditor, placeCursorAtEnd } from "../quill";

class EmbedVideo {
  container: any;
  quill: Quill;
  options: {};

  constructor(quill:Quill, options = {}) {
    this.quill = quill;
    this.options = options;
    this.container = document.querySelector(options.container),
    this.container.addEventListener('paste', (event) => this.handlePaste(event));
  }

  handlePaste(event: any) {
    // @ts-ignore
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text');
    
    const youtubeUrl = this.extractYoutubeUrl(pastedData);
    
    if (youtubeUrl) {
      event.preventDefault();
      const videoId = this.extractYoutubeVideoId(youtubeUrl);
      this.insertYoutubeEmbed(videoId);
    }
  }

  extractYoutubeUrl(text) {
    const regex = /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    const match = text.match(regex);
    return match ? match[0] : null;
  }

  extractYoutubeVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  insertYoutubeEmbed(videoId) {
    const Delta = Quill.import('delta');
    const cursorIndex = this.quill.getLength() - 1; // Get the current length of the editor content
    const videoUrl = `https://www.youtube.com/embed/${videoId}?showinfo=0`;
    const videoDelta = new Delta().retain(cursorIndex).insert({ video: videoUrl });
    this.quill.updateContents(videoDelta, 'user');
    this.quill.insertText(cursorIndex + 1, '\n');
  }

}

export default EmbedVideo;