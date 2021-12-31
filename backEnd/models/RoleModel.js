const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " name is required"],
      unique: [true, " name must be unique"],
    },
    description: { type: String },
    permissions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
