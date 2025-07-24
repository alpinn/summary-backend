import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db';
import customerRoutes from './routes/customer.routes';
import swaggerDocument from './config/swagger';

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://summary-data-frontend.vercel.app',
  'http://localhost:3000',
];

const corsOptions = {
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connectDB();

app.use('/api/customers', customerRoutes);

app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    documentation: '/api-docs',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
}); 