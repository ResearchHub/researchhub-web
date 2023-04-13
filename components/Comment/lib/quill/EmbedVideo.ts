import Quill from "quill";

class EmbedVideo extends Quill {
  container: any;

  constructor(container, options = {}) {
    super(container, options);
    this.container.addEventListener('paste', (event) => this.handlePaste(event));
    this.update();
  }

  handlePaste(event: any) {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text');

    const youtubeUrl = this.extractYoutubeUrl(pastedData);
    if (youtubeUrl) {
      const videoId = this.extractYoutubeVideoId(youtubeUrl);
      this.insertYoutubeEmbed(videoId);
    } else {
      this.pastePlainText(pastedData);
    }
  }

  extractYoutubeUrl(text) {
    const regex = /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    const match = text.match(regex);
    return match ? match[0] : null;
  }

  pastePlainText(text) {
    const range = this.getSelection();
    this.insertText(range.index, text, 'silent');
  }

  extractYoutubeVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  insertYoutubeEmbed(videoId) {
    const embedHtml = `https://www.youtube.com/embed/${videoId}?showinfo=0`;
    const range = this.getSelection();
    this.pasteHTML(range.index, embedHtml, 'silent');
  }

}

export default EmbedVideo;