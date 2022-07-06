import StarInput from "~/components/Form/StarInput";
import ReactDOMServer from "react-dom/server";
import reviewCategories from "../config/reviewCategories";

let QuillPeerReviewRatingBlock = {};
if (process.browser) {
  const Quill = require('react-quill').default.Quill;
  const BlockEmbed = Quill.import('blots/block/embed');

  QuillPeerReviewRatingBlock = class QuillPeerReviewRatingBlock extends BlockEmbed {
    
    static create(value) {
      const node = super.create();
      this._rating = value.rating;
      this._category = value.category;

      const _buildHTML = ({ withPlaceholder = true }) => {
        const starInput = <StarInput value={this._rating} readOnly={false} />
        const starInputAsHtml = ReactDOMServer.renderToString(starInput)      
        const categoryObj = reviewCategories[this._category];

        return `
          <div class="ql-review-category" contenteditable="false">
            <div class="ql-review-category-label">${categoryObj.label}</div>
            <div class="ql-review-category-rating">${starInputAsHtml}</div>
          </div>
        `;
      }

      node.addEventListener('click', (e) => {
        const starEl = e.target.closest(".starRating");
        if (starEl) {
          const newRating = starEl.getAttribute('data-rating');
          this._rating = newRating;
          const html = _buildHTML({});
          node.innerHTML = html;
        }
      });

      const html = _buildHTML({});
      node.innerHTML = html;
      return node;      
    }
  
    static value(node) {
      return {
        rating: parseInt(this._rating),
        category: this._category,
      };
    }
  }
  
  QuillPeerReviewRatingBlock["blotName"] = 'peer-review-rating';
  QuillPeerReviewRatingBlock["tagName"] = 'div';
  QuillPeerReviewRatingBlock["className"] = 'ql-peer-review-rating-block';
}

export default QuillPeerReviewRatingBlock;
  


