// imports
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import colors from 'colors';
import morgan from 'morgan';

import connectdb from './config/db.js';
import testRoutes from './routes/testroute.js';
import authRoutes from './routes/authRoutes.js';
import errorMiddleware from './middlewares/errorMiddlewares.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobsRoutes.js';

// dotenv config
dotenv.config();

// Swagger configuration options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Portal Application',
      description: 'NodeJs ExpressJs Job Portal Application',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:8080', // Use environment variable for the base URL
        description: 'Local server',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API docs
};
const allowedOrigins = ['https://your-render-url.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

const spec = swaggerJsdoc(options);

// Connect to MongoDB
connectdb();

// Initialize express application
const app = express();

// Middlewares
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());

// CORS setup to allow all origins for simplicity
app.use(cors());

app.use(morgan('dev'));

// Routes
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobRoutes);

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

// Error handling middleware
app.use(errorMiddleware);

// Redirect root to Swagger UI
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode at ${PORT}`.bgCyan.white);
});
