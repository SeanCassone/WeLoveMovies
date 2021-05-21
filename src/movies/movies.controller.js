const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const foundMovie = await moviesService.read(req.params);
  if (!foundMovie) {
    next({
      status: 404,
      message: `Movie cannot be found`,
    });
  }
  res.locals.movie = foundMovie;
  return next();
}

async function read(req, res) {
  const data = res.locals.movie;
  res.json({ data });
}

async function list(req, res) {
  const data = await moviesService.list(req.query);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
};
