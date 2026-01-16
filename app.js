import express from 'express';
import {PORT} from './config/env.js';
import connectToDatabase from "./database/mongodb.js";
import authRouter from './routes/auth.route.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/auth/', authRouter)

app.use(errorMiddleware)

app.listen(PORT, async () => {
    console.log(`App listening on http://localhost:${PORT}`);

    await connectToDatabase();
})

export default app;