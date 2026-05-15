import User from "../Model/User.js";

// ─── Paginated + Searchable User List ─────────────────────────────────────────
// Supports: ?page=1&limit=5&search=john
export const getUsers = async (query) => {
  const page = parseInt(query.page) || 1;
  console.log("😺 page", page);

  const limit = parseInt(query.limit) || 5;
  console.log("🍿 limit", limit);

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

  console.log("🍩 users", users);

  const total = await User.countDocuments(filter);
  console.log("🐿️ total", total);

  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    users,
  };
};

