const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reduceProperties = require("../utils/reduce-properties");

async function reviewExists(req, res, next) {
  const foundReview = await reviewsService.read(req.params.reviewId);
  if (!foundReview) {
    return next({
      status: 404,
      message: `Review cannot be found.`,
    });
  }
  res.locals.review = foundReview;
  return next();
}

async function update(req, res, next) {
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  const data = await reviewsService.update(updatedReview);
  res.json({ data });
}

async function destroy(req, res, next) {
  await reviewsService.delete(res.locals.review.review_id);
  res.sendStatus(204);
}

async function list(req, res) {
  const { movieId } = req.params;
  const results = await reviewsService.list(movieId);
  const reducedReviews = reduceProperties("review_id", {
    preferred_name: ["critic", "preferred_name"],
    surname: ["critic", "surname"],
    organization_name: ["critic", "organization_name"],
  });
  res.json({ data: reducedReviews(results) });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
