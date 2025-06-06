import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

const corsOptions = {
    origin: ['http://localhost:3030', 'http://helloschool.sohan-birotheau.fr'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // ajoute si besoin
};

app.use(cors(corsOptions));

// Gérer explicitement les requêtes OPTIONS (pré-vol)
app.options('*', cors(corsOptions));

app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
