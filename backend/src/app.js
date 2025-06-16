// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http'; // <-- ajouter
import { Server } from 'socket.io'; // <-- ajouter

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import conversationRoutes from './routes/conversationsRoutes.js';
import messageRoutes from './routes/messagesRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // créer un serveur http avec express

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3030', 'http://helloschool.sohan-birotheau.fr', 'http://localhost:5173'],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
    origin: ['http://localhost:3030', 'http://helloschool.sohan-birotheau.fr', 'http://localhost:5173', 'http://localhost'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile-pics', express.static(path.join(__dirname, '../public/images/users')));
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

// --- Socket.io events ---

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Rejoindre une conversation (room)
    socket.on('joinConversation', (conversationId) => {
        socket.join(`conversation_${conversationId}`);
        console.log(`Socket ${socket.id} joined conversation_${conversationId}`);
    });

    // Quitter une conversation
    socket.on('leaveConversation', (conversationId) => {
        socket.leave(`conversation_${conversationId}`);
        console.log(`Socket ${socket.id} left conversation_${conversationId}`);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

// On exporte io pour l’utiliser dans les controllers
export { io };

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on port ${PORT}`);
});
