const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    Isverified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      required: function () {
        return this.isDoctor == true;
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    Notification: {
      type: Array,
      default: [],
    },
    seenNotification: {
      type: Array,
      default: [],
    },
    tokens: [
      {
        token: { type: String, required: true },
      },
    ],
    profilePicture: {
      type: String,
    },
    RandomNumber: {
      type: String,
      default: "",
    },
    specializeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: function () {
        return this.isDoctor == true;
      },
      ref: "specialize",
    },
    city: {
      type: String,
      max: 50,
    },
    img: {
      type: String,
      required: function () {
        return this.isDoctor == true;
      },
    },
    phone: {
      type: Number
    },
    from: {
      type: String,
      max: 50,
    },
    uniqueString:{
      type:Number
    }
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const userData = this.toObject();
  delete userData.__v;
  delete userData.password;
  delete userData.tokens;
  return userData;
};
userSchema.pre("save", async function () {
  const data = this;
  if (data.isModified("password", "ConfirmPassword")) {
    data.password = await bcrypt.hash(data.password, 12);
  }
});
userSchema.statics.checkPass = async (email, oldPass) => {
  const userData = await user.findOne({ email });
  if (!userData) throw new Error("invalid email");
  const checkPass = await bcrypt.compare(oldPass, userData.password);
  if (!checkPass) throw new Error("invalid Password");
  return userData;
};

userSchema.methods.generateToken = async function () {
  const user = this;
  if (user.tokens.length == 3) throw new Error("token exded");
  const token = jwt.sign({ _id: user._id }, "privateKey");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.virtual("user", {
  ref: "user",
  localField: "_id",
  foreignField: "userId",
});

const user = mongoose.model("user", userSchema);
module.exports = user;
