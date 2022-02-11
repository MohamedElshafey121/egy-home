const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Role = require("./RoleModel");

const addressSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: {
    type: String,
    required: [true, "address is required"],
  }, //الشارع اسم |رقم
  governate: {
    type: String,
    required: [true, "Governate is required"], //المحافظه
  },
  city: {
    type: String,
    required: [true, "City is required"],
  },
  area: {
    type: String,
    required: [true, "area is required"],
  },
  type: {
    type: String,
    required: [true, "address type is required"],
  },
  orderNotes: { type: String },
  phoneNumber: {
    type: String,
    required: [true, "Phone Number is required"],
  },
  email: {
    type: String,
    required: [true, "Email address is required"],
  },
  default: {
    //deafult_address?
    type: Boolean,
    required: true,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      minlength: 5,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide your email"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please Confirm Your Password"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password and password confirm should be identical",
      },
    },
    role: {
      type: String,
      default: "user",
      required: [true, "user role is required"],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    address: [addressSchema],
    categories: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    provider: {
      type: String,
      enum: ["email", "facebook", "google"],
      default: "email",
    },
    providerUserId: String,
  },
  {
    timestamps: true,
  }
);

//DOCUMENT MIDDLEWARE
// ecrypt password before save or when it's modified
userSchema.pre("save", async function (next) {
  //Only run this function if the password has modified
  if (!this.isModified("password")) return next();

  // encrypt password with cost 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm  field
  this.passwordConfirm = undefined;
  next();
});

//add password change at value
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//add role id
// userSchema.pre( 'save', async function ( next ) {
//     if ( !this.isModified( 'roleName' ) || !this.isNew ) return next();

//     const role = await Role.findOne( { name: this.roleName } );
// })

//QUERY MIDDLEWARE
// userSchema.pre( /^find/, async function ( next ) {
//     await this.select( '-__v' );
//     next();
// })

//INSTSNCE METHODS
//check if the password user enters  is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//check if user changed password after login
userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return changedTimestamp > jwtTimeStamp;
  }

  //false means password not changed
  return false;
};

//Create Resete Token
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // console.log( { resetToken }, this.passwordResetToken );

  return resetToken;
};

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "categories",
    select: "name",
  });

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
