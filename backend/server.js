import express from 'express';
import cors from 'cors';
import 'dotenv/config'

import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

// Connect to Database
await connectDB();

app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});