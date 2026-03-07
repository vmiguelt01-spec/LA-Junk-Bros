require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.')); // Serves your index.html and logo.jpeg

// 1. Database Connection using the MONGO_URI from your .env file
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to LA Junk Bros Database"))
    .catch(err => console.error("Database connection error:", err));

// 2. Data Schema for Bookings
const bookingSchema = new mongoose.Schema({
    name: String,
    phone: String,
    serviceType: String,
    date: Date,
    message: String,
    createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

// 3. Email Setup (Using the info@lajunkbros.com settings)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Your Gmail App Password
    }
});

// 4. The "Book Now" Route
app.post('/api/book', async (req, res) => {
    try {
        const { name, phone, serviceType, date, message } = req.body;

        // Save to MongoDB
        const newBooking = new Booking({ name, phone, serviceType, date, message });
        await newBooking.save();

        // Send Email Notification
        const mailOptions = {
  from: process.env.EMAIL_USER,
  to: '8184000337@vtext.com',
  subject: 'NEW LEAD: LA Junk Bros',
  text: `-------------
Name: ${name}
Phone: ${phone}
Service: ${serviceType}
Notes: ${message}
-------------------
  `
};
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Booking received!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error processing booking." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
