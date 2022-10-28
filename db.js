import mongoose from "mongoose";

const MONGODB_URI = "";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) =>
    console.error("Error connectiong to MongoDB", error.message)
  );
