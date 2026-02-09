import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
    minLength: [6, "Password must be at least 6 characters long"],
  },
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
});

const newUser = mongoose.model("newUser", UserSchema);
export default newUser;
