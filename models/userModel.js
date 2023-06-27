import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    emailList: [String],
    categories: [String],
    passwordToken: { type: String },
    resetPasswordExpiry: { type: Date },
    verificationToken: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true, toObject: { virtuals: true } }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", UserSchema);
