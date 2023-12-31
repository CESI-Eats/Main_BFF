﻿import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import userRoutes from './routes/userRoutes'
import restorerRoutes from './routes/restorerRoutes'
import deliverymanRoutes from './routes/deliverymanRoutes'
import backOfficeRoutes from './routes/backofficeRoutes'
import { initLapinou } from './lapinou';
const app = express();

// Set JSON format for HTTP requests
app.use(express.json());

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')

// Create endpoint
app.get('/', (req, res) => {res.status(200).json({ response: true });});
app.use('/user', userRoutes)
app.use('/restorer', restorerRoutes)
app.use('/deliveryman', deliverymanRoutes)
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use('/backoffice', backOfficeRoutes)

initLapinou();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running...'));

export default app;
