import express from 'express';
import {PORT, NODE_ENV} from './config/env.js';
import connectToDatabase from "./database/mongodb.js";

const app = express();

app.get('/', (req, res) => {
    res.send(`Welcome To Money++ Backend Server on ${NODE_ENV}💵💵`)
});

app.listen(PORT, async () => {
    console.log(`App listening on http://localhost:${PORT}`);

    await connectToDatabase();
})

export default app;