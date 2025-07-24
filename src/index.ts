import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import customerRoutes from './routes/customer.routes';

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://summary-data.vercel.app',
  'http://localhost:3000'
];

const corsOptions = {
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use('/api/customers', customerRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 