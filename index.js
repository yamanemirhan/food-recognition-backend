const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDatabase = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const bodyParser = require("body-parser");
const routers = require("./routers");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["https://admin-food.netlify.app", "http://localhost:5173"],
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

const PORT = process.env.PORT;

app.use("/api", routers);

app.use(customErrorHandler);

app.listen(PORT, () => {
  connectDatabase();
  console.log(`App Started on 222 ${PORT} : ${process.env.NODE_ENV}`);
});
