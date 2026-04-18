import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const url = process.env.hotelDataUrl;

if (!url) {
    console.error("ERROR: hotelDataUrl environment variable is not set");
    process.exit(1);
}

mongoose.connect(url).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
});

const db = mongoose.connection;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "Server is running" });
});

app.get("/hotels", async (req, res) => {
    try {
        const location = "charminar";
        const data = await db.collection("hotelsList").findOne({ location: location });
        
        if (!data) {
            return res.status(404).json({ error: "Location not found" });
        }
        
        res.json(data.charminar);
    } catch (error) {
        console.error("Error fetching hotels:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});