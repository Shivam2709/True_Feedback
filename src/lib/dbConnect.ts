import mongoose from "mongoose";

// database connection is Number;
type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

// Check if database alread connected..
async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected");
    return;
  }

  // if not then connect database...
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConnected = db.connections[0].readyState;

    console.log("Database connected Successfully");
  } catch (error) {
    console.log("Database connection failed", error); // log connection error and exit process..

    process.exit(1);
  }
}

export default dbConnect;
