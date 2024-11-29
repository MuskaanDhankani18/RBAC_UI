const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permissions: { type: [String], default: [] },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
});

const Role = mongoose.model("Role", RoleSchema);
const User = mongoose.model("User", UserSchema);

module.exports = { User, Role };
