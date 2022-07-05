import StarInput from "~/components/Form/StarInput";
import ReactDOMServer from "react-dom/server";

let QuillRatingBlock = {};
if (process.browser) {
  const Quill = require('react-quill').default.Quill;
  const BlockEmbed = Quill.import('blots/block/embed');

  QuillRatingBlock = class QuillRatingBlock extends BlockEmbed {
    
    static create(value) {
      const node = super.create();
      this._rating = value.rating;
      this._category = value.category;

      const _buildHTML = () => {
        const starInput = <StarInput value={this._rating} readOnly={false} />
        const starInputAsHtml = ReactDOMServer.renderToString(starInput)      
        return `
          <div class="ql-review-category">
            <div class="ql-review-category-label">${this._category}</div>
            <div class="ql-review-category-rating">${starInputAsHtml}</div>
          </div>
        `
      }

      node.addEventListener('click', (e) => {
        const starEl = e.target.closest(".starRating");
        if (starEl) {
          const newRating = starEl.getAttribute('data-rating');
          this._rating = newRating;
          const html = _buildHTML();
          node.innerHTML = html;
        }
      })

      const html = _buildHTML();
      node.innerHTML = html;
      return node;      
    }
  
    static value(node) {
      return {
        rating: parseInt(this._rating),
      };
    }
  }
  
  QuillRatingBlock["blotName"] = 'image';
  QuillRatingBlock["tagName"] = 'div';
}

export default QuillRatingBlock;
  


