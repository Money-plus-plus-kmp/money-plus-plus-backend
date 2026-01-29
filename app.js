import express from 'express';
import {PORT} from './config/env.js';
import {connectToDatabase} from "./database/mongodb.js";
import authRouter from './routes/auth.route.js';
import errorMiddleware from './middlewares/error.middleware.js';
import transactionRouter from './routes/transaction.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/auth/', authRouter)
app.use('/api/v1/transaction/' ,transactionRouter)

app.use(errorMiddleware)

if (process.env.NODE_ENV == 'development') {
    app.listen(PORT, async () => {
        console.log(`App listening on http://localhost:${PORT}`);
        await connectToDatabase();
    })
} else {
    await connectToDatabase();
}

export default app;