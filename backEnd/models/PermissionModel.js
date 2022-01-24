const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Permission name is required"],
      unique: [true, "Permission name must be unique"],
    },

    description: { type: String },
  },
  { timestamps: true }
);

const Permission = mongoose.model("Permission", PermissionSchema);
module.exports = Permission;
