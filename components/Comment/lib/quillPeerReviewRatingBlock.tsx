import StarInput from "~/components/Form/StarInput";
import ReactDOMServer from "react-dom/server";
import { genClientId } from "~/config/utils/id";
import { reviewCategories } from "./options";

const _buildHTML = ({ node, category, starSize = "med", withLabel = false, readOnly = false }) => {
  const rating = node.getAttribute('data-rating');
  const starInput = <StarInput value={rating} readOnly={readOnly} size={starSize} withLabel={withLabel} />
  const starInputAsHtml = ReactDOMServer.renderToString(starInput);

  return `
    <div class="ql-review-category">
      <div class="ql-review-category-label">${category}</div>
      <div class="ql-review-category-rating">${starInputAsHtml}</div>
    </div>
  `;
}


let QuillPeerReviewRatingBlock = {};
if (process.browser) {
  const Quill = require('react-quill').default.Quill;
  const BlockEmbed = Quill.import('blots/block/embed');

  QuillPeerReviewRatingBlock = class QuillPeerReviewRatingBlock extends BlockEmbed {
    
    static create(value) {
      const node = super.create();
      node.setAttribute('data-rating', value.rating);
      const categoryObj = reviewCategories[value.category];
      
      if (!categoryObj) {
        return node;
      }

      if (categoryObj.isDefault) {
        // For the default category "overall rating", we want
        // to prevent the block being deleted.
        node.setAttribute('data-immutable', true);  
      }

      node.addEventListener('click', (e) => {
        const starEl = e.target.closest(".starRating");
        if (starEl) {
          const newRating = starEl.getAttribute('data-rating');
          node.setAttribute("data-rating", newRating);
          const html = _buildHTML({ node, category: categoryObj.label });
          node.innerHTML = html;
        }
      });

      const html = _buildHTML({ node, category: categoryObj.label });
      node.innerHTML = html;

      node.setAttribute("id", `id-${genClientId()}`)
      node.setAttribute("data-category", value.category);
      node.setAttribute("data-rating", value.rating);

      return node;      
    }

    attach() {
      super.attach();
      const isReadOnly = (this.parent.domNode.getAttribute("contenteditable") === "false");
      const category = this.domNode.getAttribute('data-category');
      const categoryObj = reviewCategories[category];

      if (!categoryObj) {
        return false;
      }

      const _removeNodeEvents = () => {
        const copy = this.domNode.cloneNode(true);
        this.domNode.parentNode.replaceChild(copy, this.domNode);
      }

      if (isReadOnly) {

        let starSize = "small";
        let withLabel = false;
        if (categoryObj.value === "overall") {
          starSize = "med";
          withLabel = true;
        }

        this.domNode.innerHTML = _buildHTML({
          node: this.domNode,
          starSize,
          category: categoryObj.label,
          withLabel,
          readOnly: true,
        });

        _removeNodeEvents();
      }
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
  


