const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Permission name is required"],
    unique: [true, "Permission name must be unique"],
  },
  name_ar: {
    type: String,
    required: [true, "Permission arabic name is required"],
    unique: [true, "Permission arabic name must be unique"],
  },
  description: { type: String },
});

// PermissionSchema.pre( 'save', function (next) {
//     this.role = undefined;
//     next();
// } )

const Permission = mongoose.model("Permission", PermissionSchema);
module.exports = Permission;
