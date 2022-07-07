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
      // node.setAttribute('contenteditable', false);
      
      const categoryObj = reviewCategories[this._category];
      if (categoryObj.isDefault) {
        // For the default category "overall rating", we want
        // to prevent the block being deleted.
        node.setAttribute('data-immutable', true);  
      }

      const _buildHTML = ({ withPlaceholder = true }) => {
        const starInput = <StarInput value={this._rating} readOnly={false} />
        const starInputAsHtml = ReactDOMServer.renderToString(starInput)      

        return `
          <div class="ql-review-category">
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

    deleteAt(index: number, length: number) {
      const isImmutable = String(this.domNode.getAttribute("data-immutable")) === "true";
      if (isImmutable) {
        return false;
      }

      super.deleteAt(index, length);
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
  


