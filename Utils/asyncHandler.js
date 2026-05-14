/**
 * asyncHandler — wraps async route handlers to catch errors automatically.
 * Instead of writing try/catch in every controller, wrap the function here.
 *
 * Usage:
 *   exports.getUsers = asyncHandler(async (req, res) => {
 *     const users = await User.find();
 *     res.json(users);
 *   });
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
