import mongoose from "mongoose";
const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then((res) => {
      console.log("Database Connection established");
    })
    .catch((err) => {
      console.log("Database Connection Failed", err);
    });
};
export default connectDB;
