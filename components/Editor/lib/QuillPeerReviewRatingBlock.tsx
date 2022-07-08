import StarInput from "~/components/Form/StarInput";
import ReactDOMServer from "react-dom/server";
import reviewCategories from "../config/reviewCategories";
import { genClientId } from "~/config/utils/id";

let QuillPeerReviewRatingBlock = {};
if (process.browser) {
  const Quill = require('react-quill').default.Quill;
  const BlockEmbed = Quill.import('blots/block/embed');

  QuillPeerReviewRatingBlock = class QuillPeerReviewRatingBlock extends BlockEmbed {
    
    static create(value) {
      const node = super.create();
      node.setAttribute('data-rating', value.rating);
      const categoryObj = reviewCategories[value.category];
      
      if (categoryObj.isDefault) {
        // For the default category "overall rating", we want
        // to prevent the block being deleted.
        node.setAttribute('data-immutable', true);  
      }

      const _buildHTML = ({ withPlaceholder = true }) => {
        const rating = node.getAttribute('data-rating');
        const starInput = <StarInput value={rating} readOnly={false} />
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
          node.setAttribute("data-rating", newRating);
          const html = _buildHTML({});
          node.innerHTML = html;
        }
      });

      const html = _buildHTML({});
      node.innerHTML = html;

      node.setAttribute("id", `id-${genClientId()}`)
      node.setAttribute("data-category", value.category);
      node.setAttribute("data-rating", value.rating);

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
      const category = node.getAttribute("data-category");
      const rating = node.getAttribute("data-rating");

      return {
        rating: parseInt(rating),
        category: category,
      };
    }
  }
  
  QuillPeerReviewRatingBlock["blotName"] = 'peer-review-rating';
  QuillPeerReviewRatingBlock["tagName"] = 'div';
  QuillPeerReviewRatingBlock["className"] = 'ql-peer-review-rating-block';
}

export default QuillPeerReviewRatingBlock;
  


