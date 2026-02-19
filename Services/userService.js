const User = require("../Model/User");

const getUsers = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;
  const search = query.search || "";

  const filter = {
    name: { $regex: search, $options: "i" },
  };

  const users = await User.find(filter)
    .skip((page - 1) * limit)                    
    .limit(limit);       

  const total = await User.countDocuments(filter);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    users,
  };
};

module.exports = { getUsers };
