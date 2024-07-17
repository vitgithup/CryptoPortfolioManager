import express, { Application , NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
const app: Application = express();
import portfolioRoutes from "./routes/portfolio";
import userRoutes from "./routes/user";
import session = require("express-session");
import cors from "cors";
import 'dotenv/config'
require('dotenv').config()


//json
app.use(express.json());

app.use(session({
  secret: 'env.SESSION_SECRET',
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 60 * 60 * 1000,
  },
  rolling: true,
  store: new (require('connect-pg-simple')(session))({
    conString:  process.env.DATABASE_URL
  }),
}));


app.use(
  cors({
    origin: ["http://localhost:3001","http://localhost:3000"],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD" ,"DELETE"],
    credentials: true,
  })
);

//test api
app.get('/test', (req, res) => {
  try {
    res.status(200).json({ message: 'TS-API is working!!' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.use("/portfolio", portfolioRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});


app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
      statusCode = error.status;
      errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

//start server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));