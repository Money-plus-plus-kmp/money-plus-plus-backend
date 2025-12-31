import express from 'express';
import {PORT} from './config/env.js';
import connectToDatabase from "./database/mongodb.js";

const app = express();

app.get('/', (req, res) => {
    res.send("Welcome To Money++ Backend Server 💵💵")
});

app.listen(PORT, async () => {
    console.log(`App listening on http://localhost:${PORT}`);

    await connectToDatabase();
})

export default app;