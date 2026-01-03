import express from 'express';
import {PORT, NODE_ENV} from './config/env.js';
import connectToDatabase from "./database/mongodb.js";
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const swaggerFile = require('./swagger-output.json');

const app = express();

app.get('/', (req, res) => {
    res.send(`Welcome To 💵💵++ Backend Server on ${NODE_ENV} environment `)
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(PORT, async () => {
    console.log(`App listening on http://localhost:${PORT}`);

    await connectToDatabase();
})

export default app;