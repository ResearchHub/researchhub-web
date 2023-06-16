export default function getReviewCategoryScore({ quillContents, category }) {
  let reviewScore = 0;
  const reviewDelta = quillContents.ops.find(
    (delta) => delta?.insert?.["peer-review-rating"]?.category === category
  );

  if (reviewDelta) {
    reviewScore = reviewDelta.insert["peer-review-rating"]?.rating;
  }

  return reviewScore;
}
