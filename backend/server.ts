// server.ts
import express from 'express';
import './db'; 

// 1. Import your clean Route files
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import applicationRoutes from './routes/applicationRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// 2. Connect the URLs to the route files
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/', (req, res) => {
    res.send("ProAvenir API is running with clean architecture!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});