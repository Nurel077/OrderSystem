import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

import routes from './routes';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Main API routes
app.use('/api', routes);

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Database connection error', err.stack));

// Basic route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export { app, pool };
