import mongoose, { mongo } from "mongoose";

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
  },
  friends: [
    {
        ref: "Person",
        type: mongoose.Schema.Types.ObjectId
    }
  ]
});

export default mongoose.model("User", schema)