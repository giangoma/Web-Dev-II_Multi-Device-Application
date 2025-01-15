const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let database;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Handles URL-encoded form data
app.use(express.static(path.join(__dirname, 'public')));

async function connectToDatabase() {
    try {
        await client.connect();
        database = client.db("newsletter");
        console.log('Connected to MongoDB:', uri);
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }
}

app.post('/subscribe', async (req, res) => {
    console.log('\n=== Incoming Request ===');
    console.log('Request payload:', req.body);

    const { email } = req.body;

    // Basic validation
    if (!email || !email.includes('@')) {
        console.log('Validation Error: Invalid email address.');
        return res.status(400).json({ message: 'Invalid email address.' });
    }

    try {
        const subscriptions = database.collection("subscriptions");

        console.log('Checking for existing subscription...');
        const existingSubscription = await subscriptions.findOne({ email });
        if (existingSubscription) {
            console.log(`Duplicate Entry: Email ${email} is already subscribed.`);
            return res.status(409).json({ message: 'Email is already subscribed.' });
        }

        console.log('Inserting new subscription...');
        await subscriptions.insertOne({
            email,
            subscribedAt: new Date()
        });

        console.log(`Subscribed: ${email}`);
        res.json({ message: 'Thank you for subscribing!' });
    } catch (err) {
        console.error('Database Error:', err.message);
        res.status(500).json({ message: 'Failed to subscribe, please try again.' });
    }
});

connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
