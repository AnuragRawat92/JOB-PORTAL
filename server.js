// Importing required modules
import swaggerui from "swagger-ui-express";
import swaggerdoc from "swagger-jsdoc";
import express from "express";
import 'express-async-errors';
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import xss from "xss-clean";
import mongosanitize from "express-mongo-sanitize";

// Importing local files
import connectdb from "./config/db.js";
import testroutes from "./routes/testroute.js";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middlewares/errorMiddlewares.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobsRoutes.js";

// dotenv configuration
dotenv.config();

// Swagger configuration options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "NodeJs ExpressJs Job Portal Application"
    },
    servers: [
      {
        url: "http://localhost:8080",
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
  apis: ['./routes/*.js']
};

const spec = swaggerdoc(options);

// Connect to MongoDB
connectdb();

// Initialize express application
const app = express();

// Middlewares
app.use(helmet());
app.use(xss());
app.use(mongosanitize());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/test', testroutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobRoutes);
app.use('/api-doc', swaggerui.serve, swaggerui.setup(spec));

// Error handling middleware
app.use(errorMiddleware);

// Redirect root to Swagger UI
app.get('/', (req, res) => {
  res.redirect('/api-doc');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.Dev_Mode} mode at ${PORT}`.bgCyan.white);
});
