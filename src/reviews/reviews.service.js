const knex = require("../db/connection");

function list(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ movie_id: movieId });
}

async function read(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).first();
}

async function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}

async function readCritic(critic_id) {
  return knex("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return knex("reviews")
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  list,
  read,
  update,
  delete: destroy,
};
