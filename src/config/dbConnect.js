const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        // console.log(process.env);
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB connected successfully!!!");
    } catch (error) {
        console.log("DB connection failed!!!", error.message);
    }
};

dbConnect();

// MongoDB Username - Gavithra
// MongoDB Password - GaviMongo

// MONGO_URL =mongodb+srv://Gavithra:GaviMongo@timetablemanagementsyst.jqdmosq.mongodb.net/TimetableManagementSystem?retryWrites=true&w=majority&appName=TimetableManagementSystem