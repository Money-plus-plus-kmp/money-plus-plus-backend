import swaggerAutogen from 'swagger-autogen';
import { API_HOST, API_SCHEME, PORT} from "./config/env.js";

const swagger = swaggerAutogen();

const doc = {
    info: {
        title: 'Money++ API',
        description: 'API documentation for Money++ backend'
    },
    host: `${API_HOST}${API_HOST === 'localhost' ? `:${PORT}` : ''}`,
    schemes: [API_SCHEME],
    basePath: '/',
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

await swagger(outputFile, endpointsFiles, doc);
