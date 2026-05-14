const User = require("../Model/User");

// ─── Paginated + Searchable User List ─────────────────────────────────────────
// Supports: ?page=1&limit=5&search=john
const getUsers = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const search = query.search || "";

  const filter = {
    isDeleted: false,                               // Exclude soft-deleted users
    name: { $regex: search, $options: "i" },        // Case-insensitive search
  };

  const users = await User.find(filter)
    .select("-password")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });                       // Newest first

  const total = await User.countDocuments(filter);

  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    users,
  };
};

module.exports = { getUsers };
