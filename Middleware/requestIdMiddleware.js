const { v4: uuidv4 } = require("uuid");

/**
 * requestId — attaches a unique ID to every incoming request.
 * Useful for tracing a specific request across logs.
 *
 * Each response will include: X-Request-Id: <uuid>
 */
const requestId = (req, res, next) => {
  const id = uuidv4();
  req.requestId = id;
  res.setHeader("X-Request-Id", id);
  next();
};

module.exports = requestId;
