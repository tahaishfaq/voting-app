// NPM Package
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "Voting",
    });
    console.log("Connection Created");
  } catch (error) {
    console.log("Error occurred while connecting DB", error);
  }
};

module.exports = connectDb;