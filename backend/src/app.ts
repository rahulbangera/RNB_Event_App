import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", express.static("public"));

export { app };
